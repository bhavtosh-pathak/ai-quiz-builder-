const express = require('express');
const rateLimit = require('express-rate-limit');
const { generateQuiz, getExplanation } = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Protects the Gemini API quota from abuse — configurable via env vars.
const aiLimiter = rateLimit({
  windowMs: (Number(process.env.AI_RATE_LIMIT_WINDOW_MIN) || 15) * 60 * 1000,
  max: Number(process.env.AI_RATE_LIMIT_MAX) || 10,
  message: { success: false, message: 'Too many AI requests. Please wait a few minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(protect);

router.post('/generate-quiz', authorize('teacher'), aiLimiter, generateQuiz);
router.post('/explain', aiLimiter, getExplanation); // available to both roles

module.exports = router;
