// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, 'Name is required'],
//       trim: true,
//       minlength: 2,
//       maxlength: 60,
//     },
//     email: {
//       type: String,
//       required: [true, 'Email is required'],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
//     },
//     password: {
//       type: String,
//       required: [true, 'Password is required'],
//       minlength: 6,
//       select: false, // never returned by default queries
//     },
//     role: {
//       type: String,
//       enum: ['teacher', 'student'],
//       default: 'student',
//       required: true,
//     },
//     avatarColor: {
//       // deterministic pastel/brand color used for avatar initials on the frontend
//       type: String,
//       default: '#3B4CCA',
//     },
//     institution: {
//       type: String,
//       trim: true,
//       maxlength: 120,
//       default: '',
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   { timestamps: true } // adds createdAt / updatedAt
// );

// userSchema.index({ role: 1 });

// // Hash password before saving, only if it was modified
// userSchema.pre('save', async function hashPassword(next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Instance method to compare plaintext password against the hash
// userSchema.methods.comparePassword = async function comparePassword(candidate) {
//   return bcrypt.compare(candidate, this.password);
// };

// // Strip sensitive fields whenever a user document is serialized
// userSchema.methods.toSafeObject = function toSafeObject() {
//   return {
//     id: this._id,
//     name: this.name,
//     email: this.email,
//     role: this.role,
//     avatarColor: this.avatarColor,
//     institution: this.institution,
//     createdAt: this.createdAt,
//   };
// };

// module.exports = mongoose.model('User', userSchema);




// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, 'Name is required'],
//       trim: true,
//       minlength: 2,
//       maxlength: 60,
//     },

//     email: {
//       type: String,
//       required: [true, 'Email is required'],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
//     },

//     password: {
//       type: String,
//       required: [true, 'Password is required'],
//       minlength: 6,
//       select: false,
//     },

//     role: {
//       type: String,
//       enum: ['teacher', 'student'],
//       default: 'student',
//       required: true,
//     },

//     avatarColor: {
//       type: String,
//       default: '#3B4CCA',
//     },

//     institution: {
//       type: String,
//       trim: true,
//       maxlength: 120,
//       default: '',
//     },

//     isActive: {
//       type: Boolean,
//       default: true,
//     },


//     // Password Reset OTP fields
//     emailOTP: {
//   type: String,
//   default: null,
// },


// emailOTPExpire: {
//   type: Date,
//   default: null,
// },


// isEmailVerified: {
//   type: Boolean,
//   default: false,
// },


//   },
//   { timestamps: true }
// );



// userSchema.index({ role: 1 });



// // Hash password before saving
// userSchema.pre('save', async function hashPassword(next) {

//   if (!this.isModified('password')) {
//     return next();
//   }

//   const salt = await bcrypt.genSalt(10);

//   this.password = await bcrypt.hash(
//     this.password,
//     salt
//   );

//   next();

// });




// // Compare password
// userSchema.methods.comparePassword = async function comparePassword(candidate) {

//   return bcrypt.compare(
//     candidate,
//     this.password
//   );

// };




// // Remove sensitive fields
// userSchema.methods.toSafeObject = function toSafeObject() {

//   return {

//     id: this._id,

//     name: this.name,

//     email: this.email,

//     role: this.role,

//     avatarColor: this.avatarColor,

//     institution: this.institution,

//     createdAt: this.createdAt,

//   };

// };



// module.exports = mongoose.model('User', userSchema);








const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 60,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // never returned by default queries
    },
    role: {
      type: String,
      enum: ['teacher', 'student'],
      default: 'student',
      required: true,
    },
    avatarColor: {
      // deterministic pastel/brand color used for avatar initials on the frontend
      type: String,
      default: '#3B4CCA',
    },
    institution: {
      type: String,
      trim: true,
      maxlength: 120,
      default: '',
    },
    emailOTP: {
  type: String,
  default: null,
},

emailOTPExpire: {
  type: Date,
  default: null,
},

isEmailVerified: {
  type: Boolean,
  default: false,
},

resetOTP: {
  type: String,
  default: null,
},

resetOTPExpire: {
  type: Date,
  default: null,
},
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } // adds createdAt / updatedAt
);

userSchema.index({ role: 1 });

// Hash password before saving, only if it was modified
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare plaintext password against the hash
userSchema.methods.comparePassword = async function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Strip sensitive fields whenever a user document is serialized
userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    avatarColor: this.avatarColor,
    institution: this.institution,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);