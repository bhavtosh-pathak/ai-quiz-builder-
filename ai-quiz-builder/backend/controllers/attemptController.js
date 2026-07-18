const asyncHandler = require('express-async-handler');
const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');
const { buildLeaderboard, notifyAttemptEnded } = require('../sockets/socketHandler');

// A student is flagged for teacher review once they cross this many
// recorded proctoring violations (tab switches, fullscreen exits, etc).
// The frontend also auto-submits at this same threshold — kept in sync
// here so a flagged attempt is never graded as "not flagged" even if the
// client's own auto-submit logic is bypassed.
const VIOLATION_FLAG_THRESHOLD = 3;
const VALID_VIOLATION_TYPES = new Set(['tab_switch', 'fullscreen_exit', 'copy_attempt', 'devtools_attempt']);

// @desc    Submit a quiz attempt, score it server-side, and broadcast the
//          updated leaderboard to everyone in the quiz's socket room.
// @route   POST /api/attempts/:quizId/submit
// @access  Private/Student
const submitAttempt = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const { answers, startedAt, autoSubmitted, autoSubmitReason, violations } = req.body; // answers: [{ questionId, selectedOption }]

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }
  if (quiz.status !== 'published') {
    res.status(400);
    throw new Error('This quiz is not open for submissions');
  }

  const alreadyAttempted = await Attempt.findOne({ quiz: quizId, student: req.user._id });
  if (alreadyAttempted) {
    res.status(400);
    throw new Error('You have already submitted this quiz');
  }

  // Score authoritatively on the server — never trust client-calculated scores.
  const answerMap = new Map((answers || []).map((a) => [a.questionId, a.selectedOption]));
  const negMarkEnabled = quiz.negativeMarking?.enabled;
  const negMarkValue = quiz.negativeMarking?.value || 0;

  let score = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let skippedCount = 0;

  const scoredAnswers = quiz.questions.map((q) => {
    const selected = answerMap.get(q._id.toString()) ?? null;
    const marks = q.marks || 1;

    if (selected === null || selected === undefined) {
      skippedCount += 1;
      return {
        questionId: q._id,
        selectedOption: null,
        correctAnswer: q.correctAnswer,
        isCorrect: false,
        marksAwarded: 0,
      };
    }

    const isCorrect = selected === q.correctAnswer;
    let marksAwarded = 0;
    if (isCorrect) {
      marksAwarded = marks;
      correctCount += 1;
    } else {
      marksAwarded = negMarkEnabled ? -negMarkValue : 0;
      wrongCount += 1;
    }
    score += marksAwarded;

    return {
      questionId: q._id,
      selectedOption: selected,
      correctAnswer: q.correctAnswer,
      isCorrect,
      marksAwarded,
    };
  });

  score = Math.max(0, Math.round(score * 100) / 100); // never show negative total score
  const percentage = quiz.totalMarks > 0 ? Math.round((score / quiz.totalMarks) * 10000) / 100 : 0;
  const started = startedAt ? new Date(startedAt) : new Date();
  const submittedAt = new Date();

  // Sanitize the reported violations — only accept known types, and cap the
  // count so a malicious client can't stuff an unbounded array.
  const cleanViolations = (Array.isArray(violations) ? violations : [])
    .filter((v) => v && VALID_VIOLATION_TYPES.has(v.type))
    .slice(0, 50)
    .map((v) => ({ type: v.type, timestamp: v.timestamp ? new Date(v.timestamp) : new Date() }));

  const attempt = await Attempt.create({
    student: req.user._id,
    quiz: quiz._id,
    answers: scoredAnswers,
    score,
    totalMarks: quiz.totalMarks,
    percentage,
    correctCount,
    wrongCount,
    skippedCount,
    startedAt: started,
    submittedAt,
    durationTakenSeconds: Math.round((submittedAt - started) / 1000),
    autoSubmitted: !!autoSubmitted,
    autoSubmitReason: autoSubmitted ? (autoSubmitReason === 'cheating' ? 'cheating' : 'timeout') : null,
    violations: cleanViolations,
    violationCount: cleanViolations.length,
    flagged: cleanViolations.length >= VIOLATION_FLAG_THRESHOLD,
  });

  // Real-time: push the fresh leaderboard to everyone watching this quiz room.
  const io = req.app.get('io');
  if (io) {
    const leaderboard = await buildLeaderboard(quiz._id);
    io.to(`quiz:${quiz._id}`).emit('leaderboard:update', leaderboard);
    io.to(`quiz:${quiz._id}`).emit('attempt:new', {
      studentName: req.user.name,
      score,
      percentage,
    });
    if (attempt.flagged) {
      io.to(`quiz:${quiz._id}`).emit('quiz:cheatingDetected', {
        quizId: quiz._id.toString(),
        studentId: req.user._id.toString(),
        studentName: req.user.name,
        type: 'submission_flagged',
        violationCount: attempt.violationCount,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // This student's attempt is now over — clear any live cheating alert for
  // them from the "Live Cheating Alerts" box on the teacher dashboard.
  await notifyAttemptEnded(quiz._id, req.user._id);

  res.status(201).json({
    success: true,
    attempt,
    rank: await computeRank(quiz._id, attempt._id),
  });
});

/** Helper: 1-based rank of an attempt within its quiz. */
const computeRank = async (quizId, attemptId) => {
  const attempts = await Attempt.find({ quiz: quizId }).sort({ score: -1, submittedAt: 1 }).select('_id');
  return attempts.findIndex((a) => a._id.toString() === attemptId.toString()) + 1;
};

// @desc    Get the leaderboard for a quiz
// @route   GET /api/attempts/:quizId/leaderboard
// @access  Private
const getLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await buildLeaderboard(req.params.quizId);
  res.json({ success: true, leaderboard });
});

// @desc    Get the logged-in student's own attempts (with quiz info)
// @route   GET /api/attempts/mine
// @access  Private/Student
const getMyAttempts = asyncHandler(async (req, res) => {
  const attempts = await Attempt.find({ student: req.user._id })
    .populate('quiz', 'title subject totalMarks quizCode')
    .sort({ submittedAt: -1 });

  res.json({ success: true, attempts });
});

// @desc    Get a single attempt in detail (for review screen)
// @route   GET /api/attempts/:id
// @access  Private (owner or quiz owner)
const getAttemptById = asyncHandler(async (req, res) => {
  const attempt = await Attempt.findById(req.params.id).populate('quiz').populate('student', 'name email');

  if (!attempt) {
    res.status(404);
    throw new Error('Attempt not found');
  }

  const isStudentOwner = attempt.student._id.toString() === req.user._id.toString();
  const isQuizOwner = attempt.quiz.createdBy.toString() === req.user._id.toString();
  if (!isStudentOwner && !isQuizOwner) {
    res.status(403);
    throw new Error('You do not have access to this attempt');
  }

  res.json({ success: true, attempt });
});

// @desc    Get all attempts for a quiz (teacher's performance view)
// @route   GET /api/attempts/:quizId/all
// @access  Private/Teacher (quiz owner)
const getQuizAttempts = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId);
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }
  if (quiz.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the quiz owner can view this data');
  }

  const attempts = await Attempt.find({ quiz: quiz._id })
    .populate('student', 'name email')
    .sort({ score: -1, submittedAt: 1 });

  res.json({ success: true, attempts });
});

module.exports = { submitAttempt, getLeaderboard, getMyAttempts, getAttemptById, getQuizAttempts };