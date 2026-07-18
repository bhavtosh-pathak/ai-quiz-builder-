const express = require('express');
const {
  submitAttempt,
  getLeaderboard,
  getMyAttempts,
  getAttemptById,
  getQuizAttempts,
} = require('../controllers/attemptController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/:quizId/submit', authorize('student'), submitAttempt);
router.get('/:quizId/leaderboard', getLeaderboard);
router.get('/:quizId/all', authorize('teacher'), getQuizAttempts);
router.get('/mine', authorize('student'), getMyAttempts);
router.get('/:id', getAttemptById);

module.exports = router;
