// const express = require('express');
// const { body } = require('express-validator');
// const { registerUser, loginUser, getMe, updateMe } = require('../controllers/authController');
// const { protect } = require('../middleware/authMiddleware');
// const validateRequest = require('../middleware/validateRequest');

// const router = express.Router();

// router.post(
//   '/register',
//   [
//     body('name').trim().isLength({ min: 2, max: 60 }).withMessage('Name must be 2-60 characters'),
//     body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
//     body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
//     body('role').isIn(['teacher', 'student']).withMessage('Role must be teacher or student'),
//   ],
//   validateRequest,
//   registerUser
// );

// router.post(
//   '/login',
//   [
//     body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
//     body('password').notEmpty().withMessage('Password is required'),
//   ],
//   validateRequest,
//   loginUser
// );

// router.get('/me', protect, getMe);
// router.put(
//   '/me',
//   protect,
//   [
//     body('name').optional().trim().isLength({ min: 2, max: 60 }),
//     body('password').optional().isLength({ min: 6 }),
//   ],
//   validateRequest,
//   updateMe
// );

// module.exports = router;



// const express = require('express');
// const { body } = require('express-validator');

// const {
//   registerUser,
//   loginUser,
//   VerifyEmail,
//   getMe,
//   updateMe,
//   forgotPassword,
//   verifyOTP,
//   resetPassword
// } = require('../controllers/authController');

// const { protect } = require('../middleware/authMiddleware');
// const validateRequest = require('../middleware/validateRequest');


// const router = express.Router();




// // Register

// router.post(
//   '/register',
//   [
//     body('name')
//       .trim()
//       .isLength({ min: 2, max: 60 })
//       .withMessage('Name must be 2-60 characters'),


//     body('email')
//       .isEmail()
//       .withMessage('A valid email is required')
//       .normalizeEmail(),


//     body('password')
//       .isLength({ min: 6 })
//       .withMessage('Password must be at least 6 characters'),


//     body('role')
//       .isIn(['teacher','student'])
//       .withMessage('Role must be teacher or student'),

//   ],
//   validateRequest,
//   registerUser
// );



// router.post(
//   '/verify-email',
//   [
//     body('email')
//       .isEmail()
//       .withMessage('Valid email required')
//       .normalizeEmail(),

//     body('otp')
//       .isLength({ min: 6, max: 6 })
//       .withMessage('OTP must be 6 digits'),
//   ],
//   validateRequest,
//   verifyEmail
// );




// // Login

// router.post(
//   '/login',
//   [

//     body('email')
//       .isEmail()
//       .withMessage('A valid email is required')
//       .normalizeEmail(),


//     body('password')
//       .notEmpty()
//       .withMessage('Password is required'),

//   ],

//   validateRequest,

//   loginUser
// );









// // Forgot Password Routes


// router.post(
//   '/forgot-password',
//   [
//     body('email')
//       .isEmail()
//       .withMessage('Valid email required')
//       .normalizeEmail(),
//   ],
//   validateRequest,
//   forgotPassword
// );





// router.post(
//   '/verify-otp',
//   [
//     body('email')
//       .isEmail()
//       .withMessage('Valid email required'),

//     body('otp')
//       .isLength({min:6,max:6})
//       .withMessage('OTP must be 6 digits'),

//   ],
//   validateRequest,
//   verifyOTP
// );






// router.post(
//   '/reset-password',
//   [

//     body('email')
//       .isEmail()
//       .withMessage('Valid email required'),


//     body('otp')
//       .notEmpty()
//       .withMessage('OTP required'),


//     body('password')
//       .isLength({min:6})
//       .withMessage(
//         'Password must be at least 6 characters'
//       ),

//   ],

//   validateRequest,

//   resetPassword

// );









// // Protected Routes

// router.get(
//   '/me',
//   protect,
//   getMe
// );





// router.put(
//   '/me',

//   protect,

//   [
//     body('name')
//       .optional()
//       .trim()
//       .isLength({min:2,max:60}),


//     body('password')
//       .optional()
//       .isLength({min:6}),
//   ],

//   validateRequest,

//   updateMe

// );





// module.exports = router;







const express = require('express');
const { body } = require('express-validator');

const {
  registerUser,
  verifyEmail,
  loginUser,
  getMe,
  updateMe,
  forgotPassword,
  verifyOTP,
  resetPassword
} = require('../controllers/authController');


const { protect } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');


const router = express.Router();




// ================================
// REGISTER
// ================================

router.post(
  '/register',

  [
    body('name')
      .trim()
      .isLength({
        min:2,
        max:60
      })
      .withMessage(
        'Name must be 2-60 characters'
      ),



    body('email')
      .isEmail()
      .withMessage(
        'A valid email is required'
      )
      .normalizeEmail(),



    body('password')
      .isLength({
        min:6
      })
      .withMessage(
        'Password must be at least 6 characters'
      ),



    body('role')
      .isIn([
        'teacher',
        'student'
      ])
      .withMessage(
        'Role must be teacher or student'
      ),

  ],

  validateRequest,

  registerUser
);







// ================================
// VERIFY EMAIL OTP
// ================================

router.post(

  '/verify-email',

  [

    body('email')
      .isEmail()
      .withMessage(
        'Valid email required'
      )
      .normalizeEmail(),



    body('otp')
      .isLength({
        min:6,
        max:6
      })
      .withMessage(
        'OTP must be 6 digits'
      ),

  ],

  validateRequest,

  verifyEmail

);







// ================================
// LOGIN
// ================================

router.post(

  '/login',

  [

    body('email')
      .isEmail()
      .withMessage(
        'A valid email is required'
      )
      .normalizeEmail(),



    body('password')
      .notEmpty()
      .withMessage(
        'Password is required'
      ),

  ],

  validateRequest,

  loginUser

);







// ================================
// FORGOT PASSWORD
// ================================

router.post(

  '/forgot-password',

  [

    body('email')
      .isEmail()
      .withMessage(
        'Valid email required'
      )
      .normalizeEmail(),

  ],

  validateRequest,

  forgotPassword

);








// ================================
// VERIFY PASSWORD RESET OTP
// ================================

router.post(

  '/verify-otp',

  [

    body('email')
      .isEmail()
      .withMessage(
        'Valid email required'
      ),



    body('otp')
      .isLength({
        min:6,
        max:6
      })
      .withMessage(
        'OTP must be 6 digits'
      ),

  ],

  validateRequest,

  verifyOTP

);









// ================================
// RESET PASSWORD
// ================================

router.post(

  '/reset-password',

  [

    body('email')
      .isEmail()
      .withMessage(
        'Valid email required'
      ),



    body('otp')
      .notEmpty()
      .withMessage(
        'OTP required'
      ),



    body('password')
      .isLength({
        min:6
      })
      .withMessage(
        'Password must be at least 6 characters'
      ),

  ],

  validateRequest,

  resetPassword

);








// ================================
// PROTECTED ROUTES
// ================================


router.get(

  '/me',

  protect,

  getMe

);








router.put(

  '/me',

  protect,


  [

    body('name')
      .optional()
      .trim()
      .isLength({
        min:2,
        max:60
      }),



    body('password')
      .optional()
      .isLength({
        min:6
      }),

  ],


  validateRequest,


  updateMe

);







module.exports = router;