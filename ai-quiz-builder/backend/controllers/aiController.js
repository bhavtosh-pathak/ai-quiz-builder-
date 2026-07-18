const asyncHandler = require('express-async-handler');
const { generateQuizQuestions, explainAnswer } = require('../services/geminiService');

// @desc    Generate quiz questions from a natural-language prompt via Gemini
// @route   POST /api/ai/generate-quiz
// @access  Private/Teacher
const generateQuiz = asyncHandler(async (req, res) => {
  const { topic, count, difficulty } = req.body;

  if (!topic || !topic.trim()) {
    res.status(400);
    throw new Error('A topic or prompt is required, e.g. "Generate 10 Java OOP MCQs"');
  }

  const questionCount = Math.min(Math.max(Number(count) || 10, 1), 25);

  const questions = await generateQuizQuestions({
    topic: topic.trim(),
    count: questionCount,
    difficulty: difficulty || 'mixed',
  });

  res.json({ success: true, questions, count: questions.length });
});

// @desc    Get an AI explanation for why an answer is correct
// @route   POST /api/ai/explain
// @access  Private
const getExplanation = asyncHandler(async (req, res) => {
  const { questionText, options, correctAnswer } = req.body;

  if (!questionText || !Array.isArray(options) || !correctAnswer) {
    res.status(400);
    throw new Error('questionText, options and correctAnswer are required');
  }

  const explanation = await explainAnswer({ questionText, options, correctAnswer });
  res.json({ success: true, explanation });
});

module.exports = { generateQuiz, getExplanation };
