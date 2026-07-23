const express = require('express');
const { body } = require('express-validator');
const {
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
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.use(protect); // every quiz route requires authentication

router.post(
  '/',
  authorize('teacher'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 minute'),
  ],
  validateRequest,
  createQuiz
);

router.get('/mine', authorize('teacher'), getMyQuizzes);
router.get('/available', authorize('student'), getAvailableQuizzes);
router.get('/join/:code', authorize('student'), joinQuizByCode);
router.get('/students-list', authorize('teacher'), getStudentsList);
router.get('/:id', getQuizById);
router.put('/:id', authorize('teacher'), updateQuiz);
router.delete('/:id', authorize('teacher'), deleteQuiz);
router.delete('/:id/questions/:questionId', authorize('teacher'), deleteQuestion);
router.patch('/:id/publish', authorize('teacher'), publishQuiz);
router.patch('/:id/close', authorize('teacher'), closeQuiz);
 // /:id se pehle rakhna zaroori hai

module.exports = router;
