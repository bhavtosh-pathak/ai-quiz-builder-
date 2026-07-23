const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');
const User = require('../models/User');

// @desc    Teacher analytics dashboard summary
// @route   GET /api/dashboard/teacher
// @access  Private/Teacher
const getTeacherDashboard = asyncHandler(async (req, res) => {
  const teacherId = new mongoose.Types.ObjectId(req.user._id);

  const quizzes = await Quiz.find({ createdBy: teacherId }).select('_id title status createdAt totalMarks publishedAt duration');
  const quizIds = quizzes.map((q) => q._id);

  const attempts = await Attempt.find({ quiz: { $in: quizIds } }).select('student score percentage quiz submittedAt');

  const totalQuizzes = quizzes.length;
  const totalStudents = new Set(attempts.map((a) => a.student.toString())).size;
  const averageScore = attempts.length
    ? Math.round((attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length) * 100) / 100
    : 0;

  // Per-quiz attempt counts + average, used for a bar chart
  const quizPerformance = quizzes.map((q) => {
    const quizAttempts = attempts.filter((a) => a.quiz.toString() === q._id.toString());
    const avg = quizAttempts.length
      ? Math.round((quizAttempts.reduce((s, a) => s + a.percentage, 0) / quizAttempts.length) * 100) / 100
      : 0;
    return {
      quizId: q._id,
      title: q.title,
      status: q.status,
      attempts: quizAttempts.length,
      averagePercentage: avg,
    };
  });

  // Top performers across all of this teacher's quizzes
  const topAttemptIds = [...attempts].sort((a, b) => b.percentage - a.percentage).slice(0, 5);
  const topStudentIds = topAttemptIds.map((a) => a.student);
  const topStudents = await User.find({ _id: { $in: topStudentIds } }).select('name');
  const topPerformers = topAttemptIds.map((a) => ({
    studentName: topStudents.find((s) => s._id.toString() === a.student.toString())?.name || 'Unknown',
    percentage: a.percentage,
    score: a.score,
  }));

  const recentQuizzes = [...quizzes]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5)
    .map((q) => {
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
    stats: { totalQuizzes, totalStudents, totalAttempts: attempts.length, averageScore },
    quizPerformance,
    topPerformers,
    recentQuizzes,
  });
});

// @desc    Student analytics dashboard summary
// @route   GET /api/dashboard/student
// @access  Private/Student
const getStudentDashboard = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  const attempts = await Attempt.find({ student: studentId })
    .populate('quiz', 'title subject totalMarks')
    .sort({ submittedAt: 1 });

  // Same eligibility rules as getAvailableQuizzes in quizController:
  // only quizzes published on/after this student's account creation,
  // and either public (no assignedStudents) or specifically assigned to them.
  const availableQuizzes = await Quiz.find({
    status: 'published',
    publishedAt: { $gte: req.user.createdAt },
    _id: { $nin: attempts.map((a) => a.quiz?._id).filter(Boolean) },
    $or: [
      { assignedStudents: { $exists: false } },
      { assignedStudents: { $size: 0 } },
      { assignedStudents: studentId },
    ],
  }).select('publishedAt duration');

  const availableCount = availableQuizzes.filter((q) => {
    if (!q.publishedAt) return false;

    const expiresAt = q.publishedAt.getTime() + q.duration * 60 * 1000;

    return Date.now() < expiresAt;
  }).length;

  const totalAttempts = attempts.length;
  const averagePercentage = totalAttempts
    ? Math.round((attempts.reduce((s, a) => s + a.percentage, 0) / totalAttempts) * 100) / 100
    : 0;
  const bestPercentage = totalAttempts ? Math.max(...attempts.map((a) => a.percentage)) : 0;

  // Score history in chronological order — powers the performance line chart
  const performanceHistory = attempts.map((a) => ({
    quizTitle: a.quiz?.title || 'Deleted quiz',
    percentage: a.percentage,
    submittedAt: a.submittedAt,
  }));

  res.json({
    success: true,
    stats: { availableCount, totalAttempts, averagePercentage, bestPercentage },
    performanceHistory,
    recentAttempts: [...attempts].reverse().slice(0, 5),
  });
});

module.exports = { getTeacherDashboard, getStudentDashboard };