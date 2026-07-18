// const asyncHandler = require('express-async-handler');
// const User = require('../models/User');
// const generateToken = require('../utils/generateToken');

// // Deterministic palette so each user gets a stable avatar color from their id
// const AVATAR_PALETTE = ['#3B4CCA', '#E3B341', '#2F9E64', '#D6455D', '#8956E3', '#0EA5A0'];
// const pickAvatarColor = (seed) => {
//   const sum = [...seed].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
//   return AVATAR_PALETTE[sum % AVATAR_PALETTE.length];
// };

// // @desc    Register a new user (teacher or student)
// // @route   POST /api/auth/register
// // @access  Public
// const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password, role, institution } = req.body;

//   const existing = await User.findOne({ email: email.toLowerCase() });
//   if (existing) {
//     res.status(400);
//     throw new Error('An account with that email already exists');
//   }

//   const user = await User.create({
//     name,
//     email,
//     password,
//     role: role === 'teacher' ? 'teacher' : 'student',
//     institution: institution || '',
//     avatarColor: pickAvatarColor(email),
//   });

//   res.status(201).json({
//     success: true,
//     token: generateToken(user),
//     user: user.toSafeObject(),
//   });
// });

// // @desc    Authenticate user & return token
// // @route   POST /api/auth/login
// // @access  Public
// const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
//   if (!user || !(await user.comparePassword(password))) {
//     res.status(401);
//     throw new Error('Invalid email or password');
//   }

//   if (!user.isActive) {
//     res.status(403);
//     throw new Error('This account has been deactivated');
//   }

//   res.json({
//     success: true,
//     token: generateToken(user),
//     user: user.toSafeObject(),
//   });
// });

// // @desc    Get the logged-in user's profile
// // @route   GET /api/auth/me
// // @access  Private
// const getMe = asyncHandler(async (req, res) => {
//   res.json({ success: true, user: req.user.toSafeObject() });
// });

// // @desc    Update the logged-in user's profile
// // @route   PUT /api/auth/me
// // @access  Private
// const updateMe = asyncHandler(async (req, res) => {
//   const { name, institution, password } = req.body;

//   if (name) req.user.name = name;
//   if (institution !== undefined) req.user.institution = institution;
//   if (password) req.user.password = password; // pre-save hook re-hashes

//   const updated = await req.user.save();
//   res.json({ success: true, user: updated.toSafeObject() });
// });

// module.exports = { registerUser, loginUser, getMe, updateMe };








// const asyncHandler = require('express-async-handler');
// const User = require('../models/User');
// const generateToken = require('../utils/generateToken');
// const sendOTPEmail = require('../services/emailService');


// // Deterministic palette so each user gets a stable avatar color from their id
// const AVATAR_PALETTE = [
//   '#3B4CCA',
//   '#E3B341',
//   '#2F9E64',
//   '#D6455D',
//   '#8956E3',
//   '#0EA5A0'
// ];


// const pickAvatarColor = (seed) => {
//   const sum = [...seed].reduce(
//     (acc, ch) => acc + ch.charCodeAt(0),
//     0
//   );

//   return AVATAR_PALETTE[
//     sum % AVATAR_PALETTE.length
//   ];
// };




// // Register User
// const registerUser = asyncHandler(async (req, res) => {

//   const {
//     name,
//     email,
//     password,
//     role,
//     institution
//   } = req.body;


//   const existing = await User.findOne({
//     email: email.toLowerCase()
//   });


//   if(existing){

//     res.status(400);

//     throw new Error(
//       "An account with that email already exists"
//     );

//   }


//   // Generate OTP
//   const otp = Math.floor(
//     100000 + Math.random() * 900000
//   ).toString();



//   const user = await User.create({

//     name,

//     email,

//     password,

//     role: role === "teacher"
//       ? "teacher"
//       : "student",

//     institution: institution || '',

//     avatarColor: pickAvatarColor(email),


//     emailOTP: otp,

//     emailOTPExpire:
//       new Date(
//         Date.now() + 10 * 60 * 1000
//       ),

//     isEmailVerified:false

//   });



//   // Send OTP mail

//   await sendOTPEmail(
//     email,
//     otp
//   );



//   res.status(201).json({

//     success:true,

//     message:
//     "OTP sent to your email"

//   });


// });

// const verifyEmail = asyncHandler(async (req, res) => {

//   const {
//     email,
//     otp
//   } = req.body;



//   const user = await User.findOne({

//     email: email.toLowerCase(),

//     emailOTP: otp,

//     emailOTPExpire: {
//       $gt: Date.now()
//     }

//   });



//   if (!user) {

//     res.status(400);

//     throw new Error(
//       "Invalid or expired OTP"
//     );

//   }



//   user.isEmailVerified = true;

//   user.emailOTP = null;

//   user.emailOTPExpire = null;



//   await user.save();



//   res.json({

//     success: true,

//     message: "Email verified successfully",

//     token: generateToken(user),

//     user: user.toSafeObject()

//   });


// });






// // Login User
// const loginUser = asyncHandler(async(req,res)=>{


//   const {
//     email,
//     password
//   } = req.body;



//   const user = await User.findOne({
//     email:email.toLowerCase()
//   }).select('+password');



//   if(
//     !user ||
//     !(await user.comparePassword(password))
//   ){

//     res.status(401);

//     throw new Error(
//       'Invalid email or password'
//     );

//   }



//   if(!user.isActive){

//     res.status(403);

//     throw new Error(
//       'This account has been deactivated'
//     );

//   }




//   res.json({

//     success:true,

//     token:generateToken(user),

//     user:user.toSafeObject(),

//   });


// });








// // Get Profile
// const getMe = asyncHandler(async(req,res)=>{

//   res.json({

//     success:true,

//     user:req.user.toSafeObject()

//   });

// });








// // Update Profile
// const updateMe = asyncHandler(async(req,res)=>{


//   const {
//     name,
//     institution,
//     password
//   } = req.body;



//   if(name)
//     req.user.name=name;



//   if(institution !== undefined)
//     req.user.institution=institution;



//   if(password)
//     req.user.password=password;



//   const updated = await req.user.save();



//   res.json({

//     success:true,

//     user:updated.toSafeObject()

//   });


// });








// // ================================
// // FORGOT PASSWORD FLOW
// // ================================


// // Send OTP

// const forgotPassword = asyncHandler(async(req,res)=>{


//   const { email } = req.body;



//   const user = await User.findOne({
//     email:email.toLowerCase()
//   });



//   if(!user){

//     res.status(404);

//     throw new Error(
//       "User not found"
//     );

//   }




//   const otp = Math.floor(
//     100000 +
//     Math.random()*900000
//   ).toString();



//   user.resetOTP = otp;



//   user.resetOTPExpire =
//     new Date(
//       Date.now() + 10*60*1000
//     );



//   await user.save();




//   await sendOTPEmail(
//     email,
//     otp
//   );




//   res.json({

//     success:true,

//     message:
//     "OTP sent successfully"

//   });



// });





// // const user = await User.findOne({
// //   email:email.toLowerCase()
// // }).select('+password');



// // if(
// //   !user ||
// //   !(await user.comparePassword(password))
// // ){

// //   res.status(401);

// //   throw new Error(
// //     'Invalid email or password'
// //   );

// // }



// // if(!user.isEmailVerified){

// //   res.status(403);

// //   throw new Error(
// //     "Please verify your email before login"
// //   );

// // }



// // if(!user.isActive){

// //   res.status(403);

// //   throw new Error(
// //     'This account has been deactivated'
// //   );

// // }




// // Verify OTP

// const verifyOTP = asyncHandler(async(req,res)=>{


//   const {
//     email,
//     otp
//   } = req.body;




//   const user = await User.findOne({

//     email,

//     resetOTP:otp,

//     resetOTPExpire:{
//       $gt:Date.now()
//     }

//   });




//   if(!user){

//     res.status(400);

//     throw new Error(
//       "Invalid or expired OTP"
//     );

//   }




//   res.json({

//     success:true,

//     message:
//     "OTP verified"

//   });


// });









// // Reset Password

// const resetPassword = asyncHandler(async(req,res)=>{


//   const {
//     email,
//     otp,
//     password
//   } = req.body;




//   const user = await User.findOne({

//     email,

//     resetOTP:otp,

//     resetOTPExpire:{
//       $gt:Date.now()
//     }

//   });





//   if(!user){

//     res.status(400);

//     throw new Error(
//       "Invalid OTP"
//     );

//   }





//   user.password=password;



//   user.resetOTP=null;



//   user.resetOTPExpire=null;




//   await user.save();




//   res.json({

//     success:true,

//     message:
//     "Password reset successful"

//   });



// });







// module.exports = {

//   registerUser,

//   loginUser,

//   verifyEmail,

//   getMe,

//   updateMe,

//   forgotPassword,

//   verifyOTP,

//   resetPassword

// };







const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendOTPEmail = require('../services/emailService');


// Avatar color generator
const AVATAR_PALETTE = [
  '#3B4CCA',
  '#E3B341',
  '#2F9E64',
  '#D6455D',
  '#8956E3',
  '#0EA5A0'
];


const pickAvatarColor = (seed) => {

  const sum = [...seed].reduce(
    (acc, ch) => acc + ch.charCodeAt(0),
    0
  );

  return AVATAR_PALETTE[
    sum % AVATAR_PALETTE.length
  ];

};




// ================================
// REGISTER USER + SEND EMAIL OTP
// ================================

const registerUser = asyncHandler(async (req, res) => {

  const {
    name,
    email,
    password,
    role,
    institution
  } = req.body;



  const existing = await User.findOne({
    email: email.toLowerCase()
  });



  if(existing){

    res.status(400);

    throw new Error(
      "An account with that email already exists"
    );

  }



  const otp = Math.floor(
    100000 + Math.random() * 900000
  ).toString();



  const user = await User.create({

    name,

    email,

    password,

    role:
      role === "teacher"
      ? "teacher"
      : "student",


    institution: institution || '',


    avatarColor: pickAvatarColor(email),


    emailOTP: otp,


    emailOTPExpire:
      new Date(
        Date.now() + 10 * 60 * 1000
      ),


    isEmailVerified:false

  });




  await sendOTPEmail(
    email,
    otp
  );




  res.status(201).json({

    success:true,

    message:
    "OTP sent to your email"

  });


});








// ================================
// VERIFY EMAIL OTP
// ================================

const verifyEmail = asyncHandler(async(req,res)=>{


  const {
    email,
    otp
  } = req.body;




  const user = await User.findOne({

    email: email.toLowerCase(),

    emailOTP: otp,

    emailOTPExpire:{
      $gt:Date.now()
    }

  });





  if(!user){

    res.status(400);

    throw new Error(
      "Invalid or expired OTP"
    );

  }





  user.isEmailVerified = true;

  user.emailOTP = null;

  user.emailOTPExpire = null;




  await user.save();





  res.json({

    success:true,

    message:
    "Email verified successfully",


    token:
    generateToken(user),


    user:
    user.toSafeObject()

  });



});









// ================================
// LOGIN USER
// ================================

const loginUser = asyncHandler(async(req,res)=>{


  const {
    email,
    password
  } = req.body;




  const user = await User.findOne({

    email:email.toLowerCase()

  }).select('+password');
  console.log("LOGIN USER:", user?.email, user?.isEmailVerified);





  if(
    !user ||
    !(await user.comparePassword(password))
  ){

    res.status(401);

    throw new Error(
      "Invalid email or password"
    );

  }





  if(!user.isEmailVerified){

    res.status(403);

    throw new Error(
      "Please verify your email before login"
    );

  }





  if(!user.isActive){

    res.status(403);

    throw new Error(
      "This account has been deactivated"
    );

  }






  res.json({

    success:true,

    token:
    generateToken(user),


    user:
    user.toSafeObject()

  });



});









// ================================
// GET PROFILE
// ================================

const getMe = asyncHandler(async(req,res)=>{


  res.json({

    success:true,

    user:req.user.toSafeObject()

  });


});









// ================================
// UPDATE PROFILE
// ================================

const updateMe = asyncHandler(async(req,res)=>{


  const {
    name,
    institution,
    password
  } = req.body;




  if(name)
    req.user.name=name;



  if(institution !== undefined)
    req.user.institution=institution;



  if(password)
    req.user.password=password;




  const updated =
    await req.user.save();




  res.json({

    success:true,

    user:
    updated.toSafeObject()

  });



});









// ================================
// FORGOT PASSWORD
// ================================

const forgotPassword = asyncHandler(async(req,res)=>{


  const { email } = req.body;




  const user = await User.findOne({

    email:email.toLowerCase()

  });





  if(!user){

    res.status(404);

    throw new Error(
      "User not found"
    );

  }





  const otp = Math.floor(
    100000 +
    Math.random()*900000
  ).toString();




  user.resetOTP = otp;


  user.resetOTPExpire =
    new Date(
      Date.now()+10*60*1000
    );




  await user.save();





  await sendOTPEmail(
    email,
    otp
  );




  res.json({

    success:true,

    message:
    "OTP sent successfully"

  });



});









// ================================
// VERIFY RESET OTP
// ================================

const verifyOTP = asyncHandler(async(req,res)=>{


  const {
    email,
    otp
  } = req.body;




  const user = await User.findOne({

    email,

    resetOTP:otp,

    resetOTPExpire:{
      $gt:Date.now()
    }

  });





  if(!user){

    res.status(400);

    throw new Error(
      "Invalid or expired OTP"
    );

  }





  res.json({

    success:true,

    message:
    "OTP verified"

  });



});









// ================================
// RESET PASSWORD
// ================================

const resetPassword = asyncHandler(async(req,res)=>{


  const {
    email,
    otp,
    password
  } = req.body;





  const user = await User.findOne({

    email,

    resetOTP:otp,

    resetOTPExpire:{
      $gt:Date.now()
    }

  });





  if(!user){

    res.status(400);

    throw new Error(
      "Invalid OTP"
    );

  }





  user.password=password;


  user.resetOTP=null;


  user.resetOTPExpire=null;




  await user.save();





  res.json({

    success:true,

    message:
    "Password reset successful"

  });



});









module.exports = {

  registerUser,

  verifyEmail,

  loginUser,

  getMe,

  updateMe,

  forgotPassword,

  verifyOTP,

  resetPassword

};