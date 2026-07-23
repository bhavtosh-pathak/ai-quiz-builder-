// const asyncHandler = require('express-async-handler');
// const Quiz = require('../models/Quiz');
// const Attempt = require('../models/Attempt');

// // @desc    Create a new quiz (manual, empty, or pre-filled with AI questions)
// // @route   POST /api/quizzes
// // @access  Private/Teacher
// const createQuiz = asyncHandler(async (req, res) => {
//   const {
//     title,
//     description,
//     subject,
//     duration,
//     negativeMarking,
//     shuffleQuestions,
//     shuffleOptions,
//     questions,
//     aiGenerated,
//     aiPrompt,
//   } = req.body;

//   const quiz = await Quiz.create({
//     title,
//     description,
//     subject,
//     duration,
//     negativeMarking,
//     shuffleQuestions,
//     shuffleOptions,
//     questions: questions || [],
//     aiGenerated: !!aiGenerated,
//     aiPrompt: aiPrompt || '',
//     createdBy: req.user._id,
//   });

//   res.status(201).json({ success: true, quiz });
// });

// // @desc    Get all quizzes created by the logged-in teacher (with search/filter/pagination)
// // @route   GET /api/quizzes/mine
// // @access  Private/Teacher
// const getMyQuizzes = asyncHandler(async (req, res) => {
//   const { search = '', status = 'all', page = 1, limit = 9 } = req.query;

//   const query = { createdBy: req.user._id };
//   if (status !== 'all') query.status = status;
//   if (search) query.$text = { $search: search };

//   const skip = (Number(page) - 1) * Number(limit);

//   const [quizzes, total] = await Promise.all([
//     Quiz.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
//     Quiz.countDocuments(query),
//   ]);

//   res.json({
//     success: true,
//     quizzes,
//     pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
//   });
// });

// // @desc    Get a single quiz by id (owner sees answers, others do not)
// // @route   GET /api/quizzes/:id
// // @access  Private
// const getQuizById = asyncHandler(async (req, res) => {
//   const quiz = await Quiz.findById(req.params.id);
//   if (!quiz) {
//     res.status(404);
//     throw new Error('Quiz not found');
//   }

//   const isOwner = quiz.createdBy.toString() === req.user._id.toString();
//   if (!isOwner && req.user.role === 'teacher') {
//     res.status(403);
//     throw new Error('You do not have access to this quiz');
//   }

//   res.json({ success: true, quiz, isOwner });
// });

// // @desc    Update quiz metadata and/or full question list
// // @route   PUT /api/quizzes/:id
// // @access  Private/Teacher (owner only)
// const updateQuiz = asyncHandler(async (req, res) => {
//   const quiz = await Quiz.findById(req.params.id);
//   if (!quiz) {
//     res.status(404);
//     throw new Error('Quiz not found');
//   }
//   if (quiz.createdBy.toString() !== req.user._id.toString()) {
//     res.status(403);
//     throw new Error('Only the quiz owner can edit this quiz');
//   }
//   if (quiz.status === 'published') {
//     res.status(400);
//     throw new Error('Published quizzes cannot be edited. Close it first to make changes.');
//   }

//   const editable = [
//     'title',
//     'description',
//     'subject',
//     'duration',
//     'negativeMarking',
//     'shuffleQuestions',
//     'shuffleOptions',
//     'questions',
//   ];
//   editable.forEach((field) => {
//     if (req.body[field] !== undefined) quiz[field] = req.body[field];
//   });

//   const updated = await quiz.save();
//   res.json({ success: true, quiz: updated });
// });

// // @desc    Delete a single question from a quiz
// // @route   DELETE /api/quizzes/:id/questions/:questionId
// // @access  Private/Teacher (owner only)
// const deleteQuestion = asyncHandler(async (req, res) => {
//   const quiz = await Quiz.findById(req.params.id);
//   if (!quiz) {
//     res.status(404);
//     throw new Error('Quiz not found');
//   }
//   if (quiz.createdBy.toString() !== req.user._id.toString()) {
//     res.status(403);
//     throw new Error('Only the quiz owner can edit this quiz');
//   }

//   quiz.questions = quiz.questions.filter((q) => q._id.toString() !== req.params.questionId);
//   await quiz.save();

//   res.json({ success: true, quiz });
// });

// // @desc    Publish a quiz (makes it joinable by students via quiz code)
// // @route   PATCH /api/quizzes/:id/publish
// // @access  Private/Teacher (owner only)
// const publishQuiz = asyncHandler(async (req, res) => {
//   const quiz = await Quiz.findById(req.params.id);
//   if (!quiz) {
//     res.status(404);
//     throw new Error('Quiz not found');
//   }
//   if (quiz.createdBy.toString() !== req.user._id.toString()) {
//     res.status(403);
//     throw new Error('Only the quiz owner can publish this quiz');
//   }
//   if (quiz.questions.length === 0) {
//     res.status(400);
//     throw new Error('Add at least one question before publishing');
//   }

//   quiz.status = 'published';
//   await quiz.save();

//   res.json({ success: true, quiz });
// });

// // @desc    Close a published quiz (stops new attempts)
// // @route   PATCH /api/quizzes/:id/close
// // @access  Private/Teacher (owner only)
// const closeQuiz = asyncHandler(async (req, res) => {
//   const quiz = await Quiz.findById(req.params.id);
//   if (!quiz) {
//     res.status(404);
//     throw new Error('Quiz not found');
//   }
//   if (quiz.createdBy.toString() !== req.user._id.toString()) {
//     res.status(403);
//     throw new Error('Only the quiz owner can close this quiz');
//   }

//   quiz.status = 'closed';
//   await quiz.save();

//   res.json({ success: true, quiz });
// });

// // @desc    Delete an entire quiz (and its attempts)
// // @route   DELETE /api/quizzes/:id
// // @access  Private/Teacher (owner only)
// const deleteQuiz = asyncHandler(async (req, res) => {
//   const quiz = await Quiz.findById(req.params.id);
//   if (!quiz) {
//     res.status(404);
//     throw new Error('Quiz not found');
//   }
//   if (quiz.createdBy.toString() !== req.user._id.toString()) {
//     res.status(403);
//     throw new Error('Only the quiz owner can delete this quiz');
//   }

//   await Attempt.deleteMany({ quiz: quiz._id });
//   await quiz.deleteOne();

//   res.json({ success: true, message: 'Quiz deleted' });
// });

// // @desc    Look up a quiz by its shareable code (student joining)
// // @route   GET /api/quizzes/join/:code
// // @access  Private/Student
// const joinQuizByCode = asyncHandler(async (req, res) => {
//   const quiz = await Quiz.findOne({ quizCode: req.params.code.toUpperCase() });

//   if (!quiz) {
//     res.status(404);
//     throw new Error('No quiz found with that code');
//   }
//   if (quiz.status !== 'published') {
//     res.status(400);
//     throw new Error('This quiz is not currently open for attempts');
//   }

//   const existingAttempt = await Attempt.findOne({ quiz: quiz._id, student: req.user._id });
//   if (existingAttempt) {
//     res.status(400);
//     throw new Error('You have already attempted this quiz');
//   }

//   // Strip correct answers before sending to the student
//   const safeQuestions = quiz.questions.map((q) => ({
//     _id: q._id,
//     questionText: q.questionText,
//     options: q.options,
//     difficulty: q.difficulty,
//     marks: q.marks,
//   }));

//   res.json({
//     success: true,
//     quiz: {
//       _id: quiz._id,
//       title: quiz.title,
//       description: quiz.description,
//       subject: quiz.subject,
//       duration: quiz.duration,
//       totalMarks: quiz.totalMarks,
//       negativeMarking: quiz.negativeMarking,
//       shuffleQuestions: quiz.shuffleQuestions,
//       shuffleOptions: quiz.shuffleOptions,
//       quizCode: quiz.quizCode,
//       questions: safeQuestions,
//     },
//   });
// });

// // @desc    List published quizzes available for students to browse
// // @route   GET /api/quizzes/available
// // @access  Private/Student
// const getAvailableQuizzes = asyncHandler(async (req, res) => {
//   const { search = '', page = 1, limit = 9 } = req.query;

//   const query = { status: 'published' };
//   if (search) query.$text = { $search: search };

//   const attempted = await Attempt.find({ student: req.user._id }).distinct('quiz');
//   query._id = { $nin: attempted };

//   const skip = (Number(page) - 1) * Number(limit);
//   const [quizzes, total] = await Promise.all([
//     Quiz.find(query)
//       .select('title description subject duration totalMarks quizCode createdAt questions')
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(Number(limit))
//       .populate('createdBy', 'name'),
//     Quiz.countDocuments(query),
//   ]);

//   const shaped = quizzes.map((q) => ({
//     _id: q._id,
//     title: q.title,
//     description: q.description,
//     subject: q.subject,
//     duration: q.duration,
//     totalMarks: q.totalMarks,
//     quizCode: q.quizCode,
//     questionCount: q.questions.length,
//     createdBy: q.createdBy?.name,
//     createdAt: q.createdAt,
//   }));

//   res.json({
//     success: true,
//     quizzes: shaped,
//     pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
//   });
// });

// module.exports = {
//   createQuiz,
//   getMyQuizzes,
//   getQuizById,
//   updateQuiz,
//   deleteQuestion,
//   publishQuiz,
//   closeQuiz,
//   deleteQuiz,
//   joinQuizByCode,
//   getAvailableQuizzes,
// };



const asyncHandler = require('express-async-handler');
const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');
const User = require('../models/User');

// @desc    Create a new quiz (manual, empty, or pre-filled with AI questions)
// @route   POST /api/quizzes
// @access  Private/Teacher
const createQuiz = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    subject,
    duration,
    negativeMarking,
    shuffleQuestions,
    shuffleOptions,
    questions,
    aiGenerated,
    aiPrompt,
    assignedEmails, // NEW — array of student emails, optional
  } = req.body;

  // Resolve emails -> student user IDs. Unknown/non-student emails are
  // silently skipped rather than failing the whole request.
  let assignedStudents;
  if (Array.isArray(assignedEmails) && assignedEmails.length > 0) {
    const cleanEmails = assignedEmails.map((e) => String(e).toLowerCase().trim()).filter(Boolean);
    const matchedStudents = await User.find({
      email: { $in: cleanEmails },
      role: 'student',
    }).select('_id');
    assignedStudents = matchedStudents.map((s) => s._id);
    if (assignedStudents.length === 0) assignedStudents = undefined; // none matched -> treat as public
  }

  const quiz = await Quiz.create({
    title,
    description,
    subject,
    duration,
    negativeMarking,
    shuffleQuestions,
    shuffleOptions,
    questions: questions || [],
    aiGenerated: !!aiGenerated,
    aiPrompt: aiPrompt || '',
    createdBy: req.user._id,
    assignedStudents,
  });

  res.status(201).json({ success: true, quiz });
});

// @desc    Get all quizzes created by the logged-in teacher (with search/filter/pagination)
// @route   GET /api/quizzes/mine
// @access  Private/Teacher
const getMyQuizzes = asyncHandler(async (req, res) => {
  const { search = '', status = 'all', page = 1, limit = 9 } = req.query;

  const query = { createdBy: req.user._id };
  if (status !== 'all') query.status = status;
  if (search) query.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);

  const [quizzes, total] = await Promise.all([
    Quiz.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('title description subject duration totalMarks quizCode questions status createdAt publishedAt assignedStudents')
      .populate('assignedStudents', 'name email'),
    Quiz.countDocuments(query),
  ]);

  const updatedQuizzes = quizzes.map((q) => {
    let displayStatus = q.status;

    if (q.status === 'published' && q.publishedAt) {
      const expiresAt = q.publishedAt.getTime() + q.duration * 60 * 1000;
      displayStatus = Date.now() > expiresAt ? 'expired' : 'live';
    }

    return {
      ...q.toObject(),
      status: displayStatus,
    };
  });

  res.json({
    success: true,
    quizzes: updatedQuizzes,
    pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
  });
});

// @desc    Get a single quiz by id (owner sees answers, others do not)
// @route   GET /api/quizzes/:id
// @access  Private
const getQuizById = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).populate('assignedStudents', 'name email');
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }

  const isOwner = quiz.createdBy.toString() === req.user._id.toString();
  if (!isOwner && req.user.role === 'teacher') {
    res.status(403);
    throw new Error('You do not have access to this quiz');
  }

  res.json({ success: true, quiz, isOwner });
});

// @desc    Update quiz metadata and/or full question list
// @route   PUT /api/quizzes/:id
// @access  Private/Teacher (owner only)
const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }
  if (quiz.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the quiz owner can edit this quiz');
  }
  if (quiz.status === 'published') {
    res.status(400);
    throw new Error('Published quizzes cannot be edited. Close it first to make changes.');
  }

  const editable = [
    'title',
    'description',
    'subject',
    'duration',
    'negativeMarking',
    'shuffleQuestions',
    'shuffleOptions',
    'questions',
  ];
  editable.forEach((field) => {
    if (req.body[field] !== undefined) quiz[field] = req.body[field];
  });

  // Handle assignedEmails the same way createQuiz does
  if (req.body.assignedEmails !== undefined) {
    if (Array.isArray(req.body.assignedEmails) && req.body.assignedEmails.length > 0) {
      const cleanEmails = req.body.assignedEmails.map((e) => String(e).toLowerCase().trim()).filter(Boolean);
      const matchedStudents = await User.find({
        email: { $in: cleanEmails },
        role: 'student',
      }).select('_id');
      quiz.assignedStudents = matchedStudents.length ? matchedStudents.map((s) => s._id) : undefined;
    } else {
      quiz.assignedStudents = undefined; // empty selection -> public quiz
    }
  }

  const updated = await quiz.save();
  res.json({ success: true, quiz: updated });
});

// @desc    Delete a single question from a quiz
// @route   DELETE /api/quizzes/:id/questions/:questionId
// @access  Private/Teacher (owner only)
const deleteQuestion = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }
  if (quiz.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the quiz owner can edit this quiz');
  }

  quiz.questions = quiz.questions.filter((q) => q._id.toString() !== req.params.questionId);
  await quiz.save();

  res.json({ success: true, quiz });
});

// @desc    Publish a quiz (makes it joinable by students via quiz code)
// @route   PATCH /api/quizzes/:id/publish
// @access  Private/Teacher (owner only)
const publishQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }
  if (quiz.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the quiz owner can publish this quiz');
  }
  if (quiz.questions.length === 0) {
    res.status(400);
    throw new Error('Add at least one question before publishing');
  }

  quiz.status = 'published';
  quiz.publishedAt = new Date();
  await quiz.save();

  res.json({ success: true, quiz });
});

// @desc    Close a published quiz (stops new attempts)
// @route   PATCH /api/quizzes/:id/close
// @access  Private/Teacher (owner only)
const closeQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }
  if (quiz.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the quiz owner can close this quiz');
  }

  quiz.status = 'closed';
  await quiz.save();

  res.json({ success: true, quiz });
});

// @desc    Delete an entire quiz (and its attempts)
// @route   DELETE /api/quizzes/:id
// @access  Private/Teacher (owner only)
const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }
  if (quiz.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the quiz owner can delete this quiz');
  }

  await Attempt.deleteMany({ quiz: quiz._id });
  await quiz.deleteOne();

  res.json({ success: true, message: 'Quiz deleted' });
});

// @desc    Look up a quiz by its shareable code (student joining)
// @route   GET /api/quizzes/join/:code
// @access  Private/Student
const joinQuizByCode = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOne({ quizCode: req.params.code.toUpperCase() });

  if (!quiz) {
    res.status(404);
    throw new Error('No quiz found with that code');
  }
  if (quiz.status !== 'published') {
    res.status(400);
    throw new Error('This quiz is not currently open for attempts');
  }

  // Restricted quiz — only assigned students can join, even with the code
  if (quiz.assignedStudents?.length) {
    const isAssigned = quiz.assignedStudents.some((id) => id.toString() === req.user._id.toString());
    if (!isAssigned) {
      res.status(403);
      throw new Error('This quiz is not assigned to you');
    }
  }

  // A student can't join a quiz that was published before their account existed
  if (quiz.publishedAt && quiz.publishedAt < req.user.createdAt) {
    res.status(403);
    throw new Error('This quiz is not available to your account');
  }

  if (quiz.publishedAt) {
    const expiresAt = quiz.publishedAt.getTime() + quiz.duration * 60 * 1000;
    if (Date.now() > expiresAt) {
      res.status(410);
      throw new Error('This quiz has expired');
    }
  }

  const existingAttempt = await Attempt.findOne({ quiz: quiz._id, student: req.user._id });
  if (existingAttempt) {
    res.status(400);
    throw new Error('You have already attempted this quiz');
  }

  const safeQuestions = quiz.questions.map((q) => ({
    _id: q._id,
    questionText: q.questionText,
    options: q.options,
    difficulty: q.difficulty,
    marks: q.marks,
  }));

  res.json({
    success: true,
    quiz: {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      subject: quiz.subject,
      duration: quiz.duration,
      totalMarks: quiz.totalMarks,
      negativeMarking: quiz.negativeMarking,
      shuffleQuestions: quiz.shuffleQuestions,
      shuffleOptions: quiz.shuffleOptions,
      quizCode: quiz.quizCode,
      publishedAt: quiz.publishedAt,
      questions: safeQuestions,
    },
  });
});

// @desc    List published quizzes for students to browse — only quizzes
//          published on/after the student's account creation, that are
//          either public (no assignedStudents) or specifically assigned
//          to this student. Labeled 'completed' / 'expired' / 'active'.
// @route   GET /api/quizzes/available
// @access  Private/Student
const getAvailableQuizzes = asyncHandler(async (req, res) => {
  const { search = '', page = 1, limit = 9 } = req.query;

  const query = {
    status: 'published',
    publishedAt: { $gte: req.user.createdAt },
    $or: [
      { assignedStudents: { $exists: false } },
      { assignedStudents: { $size: 0 } },
      { assignedStudents: req.user._id },
    ],
  };
  if (search) query.$text = { $search: search };

  const myAttempts = await Attempt.find({ student: req.user._id }).select('quiz score percentage submittedAt');
  const attemptMap = new Map(myAttempts.map((a) => [a.quiz.toString(), a]));

  const allMatching = await Quiz.find(query)
    .select('title description subject duration totalMarks quizCode createdAt publishedAt questions')
    .sort({ createdAt: -1 })
    .populate('createdBy', 'name');

  const now = Date.now();

  const shapedAll = allMatching.map((q) => {
    const expiresAt = q.publishedAt ? q.publishedAt.getTime() + q.duration * 60 * 1000 : null;
    const isExpired = expiresAt ? now > expiresAt : false;
    const myAttempt = attemptMap.get(q._id.toString());

    let studentStatus;
    if (myAttempt) {
      studentStatus = 'completed';
    } else if (isExpired) {
      studentStatus = 'expired';
    } else {
      studentStatus = 'active';
    }

    return {
      _id: q._id,
      title: q.title,
      description: q.description,
      subject: q.subject,
      duration: q.duration,
      totalMarks: q.totalMarks,
      quizCode: q.quizCode,
      questionCount: q.questions.length,
      createdBy: q.createdBy?.name,
      createdAt: q.createdAt,
      publishedAt: q.publishedAt,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isExpired,
      studentStatus,
      myScore: myAttempt ? { score: myAttempt.score, percentage: myAttempt.percentage } : null,
    };
  });

  const statusRank = { active: 0, completed: 1, expired: 2 };
  shapedAll.sort((a, b) => {
    if (statusRank[a.studentStatus] !== statusRank[b.studentStatus]) {
      return statusRank[a.studentStatus] - statusRank[b.studentStatus];
    }
    if (a.studentStatus === 'active') {
      return (a.expiresAt?.getTime() || Infinity) - (b.expiresAt?.getTime() || Infinity);
    }
    if (a.studentStatus === 'completed') {
      const aTime = attemptMap.get(a._id.toString())?.submittedAt?.getTime() || 0;
      const bTime = attemptMap.get(b._id.toString())?.submittedAt?.getTime() || 0;
      return bTime - aTime;
    }
    return (b.expiresAt?.getTime() || 0) - (a.expiresAt?.getTime() || 0);
  });

  const total = shapedAll.length;
  const skip = (Number(page) - 1) * Number(limit);
  const pageSlice = shapedAll.slice(skip, skip + Number(limit));

  res.json({
    success: true,
    quizzes: pageSlice,
    pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
  });
});

// @desc    List students (for teacher to pick emails when restricting a quiz)
// @route   GET /api/quizzes/students-list
// @access  Private/Teacher
const getStudentsList = asyncHandler(async (req, res) => {
  const { search = '' } = req.query;
  const query = { role: 'student', isActive: true };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  const students = await User.find(query).select('name email institution');
  res.json({ success: true, students });
});

module.exports = {
  createQuiz,
  getMyQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuestion,
  publishQuiz,
  closeQuiz,
  deleteQuiz,
  joinQuizByCode,
  getAvailableQuizzes,
  getStudentsList,
};