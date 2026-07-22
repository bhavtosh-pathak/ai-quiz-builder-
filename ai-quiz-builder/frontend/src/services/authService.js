// // import api from './api';

// // export const authService = {
// //   register: (payload) => api.post('/auth/register', payload).then((r) => r.data),
// //   login: (payload) => api.post('/auth/login', payload).then((r) => r.data),
// //   getMe: () => api.get('/auth/me').then((r) => r.data),
// //   updateMe: (payload) => api.put('/auth/me', payload).then((r) => r.data),
// // };

// // import api from './api';


// // export const authService = {

// //   register: (payload) =>
// //     api.post('/auth/register', payload)
// //       .then((r) => r.data),



// //   login: (payload) =>
// //     api.post('/auth/login', payload)
// //       .then((r) => r.data),




// //   getMe: () =>
// //     api.get('/auth/me')
// //       .then((r) => r.data),





// //   updateMe: (payload) =>
// //     api.put('/auth/me', payload)
// //       .then((r) => r.data),






// //   // Forgot Password - Send OTP

// //   forgotPassword: (payload) =>
// //     api.post('/auth/forgot-password', payload)
// //       .then((r) => r.data),





// //   // Verify OTP

// //   verifyOTP: (payload) =>
// //     api.post('/auth/verify-otp', payload)
// //       .then((r) => r.data),





// //   // Reset Password

// //   resetPassword: (payload) =>
// //     api.post('/auth/reset-password', payload)
// //       .then((r) => r.data),


// // };

// import api from './api';


// export const authService = {


//   // Register User
//   register: (payload) =>
//     api.post('/auth/register', payload)
//       .then((r) => r.data),




//   // Login User
//   login: (payload) =>
//     api.post('/auth/login', payload)
//       .then((r) => r.data),




//   // Verify Email OTP
//   verifyEmail: (payload) =>
//     api.post('/auth/verify-email', payload)
//       .then((r) => r.data),




//   // Get Current User
//   getMe: () =>
//     api.get('/auth/me')
//       .then((r) => r.data),




//   // Update Profile
//   updateMe: (payload) =>
//     api.put('/auth/me', payload)
//       .then((r) => r.data),







//   // ================================
//   // FORGOT PASSWORD FLOW
//   // ================================



//   // Send Forgot Password OTP
//   forgotPassword: (payload) =>
//     api.post('/auth/forgot-password', payload)
//       .then((r) => r.data),






//   // Verify Forgot Password OTP
//   verifyOTP: (payload) =>
//     api.post('/auth/verify-otp', payload)
//       .then((r) => r.data),






//   // Reset Password
//   resetPassword: (payload) =>
//     api.post('/auth/reset-password', payload)
//       .then((r) => r.data),



// };

import api from './api';

export const authService = {
  register: (payload) => api.post('/auth/register', payload).then((r) => r.data),
  verifyEmail: (payload) => api.post('/auth/verify-email', payload).then((r) => r.data),
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data),
  getMe: () => api.get('/auth/me').then((r) => r.data),
  updateMe: (payload) => api.put('/auth/me', payload).then((r) => r.data),
  forgotPassword: (payload) => api.post('/auth/forgot-password', payload).then((r) => r.data),
  verifyOTP: (payload) => api.post('/auth/verify-otp', payload).then((r) => r.data),
  resetPassword: (payload) => api.post('/auth/reset-password', payload).then((r) => r.data),
};
