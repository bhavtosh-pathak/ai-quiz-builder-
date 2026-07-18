// const mongoose = require('mongoose');
// const { customAlphabet } = require('nanoid');

// // Uppercase alphanumeric, unambiguous characters only (no 0/O, 1/I)
// const generateCode = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6);

// const questionSchema = new mongoose.Schema(
//   {
//     questionText: {
//       type: String,
//       required: [true, 'Question text is required'],
//       trim: true,
//     },
//     options: {
//       type: [String],
//       required: true,
//       validate: {
//         validator: (arr) => Array.isArray(arr) && arr.length === 4 && arr.every((o) => o && o.trim().length),
//         message: 'Each question must have exactly 4 non-empty options',
//       },
//     },
//     correctAnswer: {
//       // stores the exact text of the correct option (must match one entry in options)
//       type: String,
//       required: [true, 'Correct answer is required'],
//     },
//     difficulty: {
//       type: String,
//       enum: ['easy', 'medium', 'hard'],
//       default: 'medium',
//     },
//     explanation: {
//       // optional AI-generated rationale, shown after submission (bonus feature)
//       type: String,
//       default: '',
//     },
//     marks: {
//       type: Number,
//       default: 1,
//       min: 0,
//     },
//     source: {
//       type: String,
//       enum: ['manual', 'ai'],
//       default: 'manual',
//     },
//   },
//   { _id: true, timestamps: false }
// );

// const quizSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: [true, 'Quiz title is required'],
//       trim: true,
//       maxlength: 150,
//     },
//     description: {
//       type: String,
//       trim: true,
//       maxlength: 500,
//       default: '',
//     },
//     quizCode: {
//       type: String,
//       unique: true,
//       uppercase: true,
//       index: true,
//     },
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     subject: {
//       type: String,
//       trim: true,
//       default: 'General',
//     },
//     questions: {
//       type: [questionSchema],
//       default: [],
//     },
//     duration: {
//       // minutes
//       type: Number,
//       required: true,
//       default: 10,
//       min: 1,
//     },
//     totalMarks: {
//       type: Number,
//       default: 0,
//     },
//     negativeMarking: {
//       enabled: { type: Boolean, default: false },
//       value: { type: Number, default: 0.25, min: 0 }, // marks deducted per wrong answer
//     },
//     shuffleQuestions: {
//       type: Boolean,
//       default: false,
//     },
//     shuffleOptions: {
//       type: Boolean,
//       default: false,
//     },
//     status: {
//       type: String,
//       enum: ['draft', 'published', 'closed'],
//       default: 'draft',
//     },
//     aiGenerated: {
//       type: Boolean,
//       default: false,
//     },
//     aiPrompt: {
//       type: String,
//       default: '',
//     },
//   },
//   { timestamps: true }
// );

// quizSchema.index({ createdBy: 1, createdAt: -1 });
// quizSchema.index({ title: 'text', subject: 'text', description: 'text' });

// // Auto-generate a unique quiz code and compute total marks before saving
// quizSchema.pre('validate', function assignCode(next) {
//   if (!this.quizCode) {
//     this.quizCode = generateCode();
//   }
//   next();
// });

// quizSchema.pre('save', function computeTotals(next) {
//   if (this.isModified('questions')) {
//     this.totalMarks = this.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
//   }
//   next();
// });

// module.exports = mongoose.model('Quiz', quizSchema);




// const mongoose = require('mongoose');
// const { customAlphabet } = require('nanoid');

// // Uppercase alphanumeric, unambiguous characters only (no 0/O, 1/I)
// const generateCode = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6);

// const questionSchema = new mongoose.Schema(
//   {
//     questionText: {
//       type: String,
//       required: [true, 'Question text is required'],
//       trim: true,
//     },
//     options: {
//       type: [String],
//       required: true,
//       validate: {
//         validator: (arr) => Array.isArray(arr) && arr.length === 4 && arr.every((o) => o && o.trim().length),
//         message: 'Each question must have exactly 4 non-empty options',
//       },
//     },
//     correctAnswer: {
//       type: String,
//       required: [true, 'Correct answer is required'],
//     },
//     difficulty: {
//       type: String,
//       enum: ['easy', 'medium', 'hard'],
//       default: 'medium',
//     },
//     explanation: {
//       type: String,
//       default: '',
//     },
//     marks: {
//       type: Number,
//       default: 1,
//       min: 0,
//     },
//     source: {
//       type: String,
//       enum: ['manual', 'ai'],
//       default: 'manual',
//     },
//   },
//   { _id: true, timestamps: false }
// );

// const quizSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: [true, 'Quiz title is required'],
//       trim: true,
//       maxlength: 150,
//     },
//     description: {
//       type: String,
//       trim: true,
//       maxlength: 500,
//       default: '',
//     },
//     quizCode: {
//       type: String,
//       unique: true,
//       uppercase: true,
//       index: true,
//     },
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     subject: {
//       type: String,
//       trim: true,
//       default: 'General',
//     },
//     questions: {
//       type: [questionSchema],
//       default: [],
//     },
//     duration: {
//       // minutes
//       type: Number,
//       required: true,
//       default: 10,
//       min: 1,
//     },
//     totalMarks: {
//       type: Number,
//       default: 0,
//     },
//     negativeMarking: {
//       enabled: { type: Boolean, default: false },
//       value: { type: Number, default: 0.25, min: 0 },
//     },
//     shuffleQuestions: {
//       type: Boolean,
//       default: false,
//     },
//     shuffleOptions: {
//       type: Boolean,
//       default: false,
//     },
//     status: {
//       type: String,
//       enum: ['draft', 'published', 'closed'],
//       default: 'draft',
//     },
//     publishedAt: {
//       // set automatically the moment status becomes 'published'
//       type: Date,
//       default: null,
//     },
//     aiGenerated: {
//       type: Boolean,
//       default: false,
//     },
//     aiPrompt: {
//       type: String,
//       default: '',
//     },
//   },
//   { timestamps: true }
// );

// quizSchema.index({ createdBy: 1, createdAt: -1 });
// quizSchema.index({ title: 'text', subject: 'text', description: 'text' });

// // Auto-generate a unique quiz code before validation
// quizSchema.pre('validate', function assignCode(next) {
//   if (!this.quizCode) {
//     this.quizCode = generateCode();
//   }
//   next();
// });

// // Compute total marks + stamp publishedAt on the draft -> published transition
// quizSchema.pre('save', function computeTotalsAndPublish(next) {
//   if (this.isModified('questions')) {
//     this.totalMarks = this.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
//   }
//   if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
//     this.publishedAt = new Date();
//   }
//   next();
// });

// // expiresAt = publishedAt + duration (minutes). null if not published yet.
// quizSchema.virtual('expiresAt').get(function () {
//   if (!this.publishedAt) return null;
//   return new Date(this.publishedAt.getTime() + this.duration * 60 * 1000);
// });

// // true only once the quiz was published AND the duration window has passed
// quizSchema.virtual('isExpired').get(function () {
//   if (this.status !== 'published' || !this.publishedAt) return false;
//   return Date.now() > this.publishedAt.getTime() + this.duration * 60 * 1000;
// });

// quizSchema.set('toJSON', { virtuals: true });
// quizSchema.set('toObject', { virtuals: true });

// module.exports = mongoose.model('Quiz', quizSchema);





const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');

// Uppercase alphanumeric, unambiguous characters only (no 0/O, 1/I)
const generateCode = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6);

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length === 4 && arr.every((o) => o && o.trim().length),
        message: 'Each question must have exactly 4 non-empty options',
      },
    },
    correctAnswer: {
      // stores the exact text of the correct option (must match one entry in options)
      type: String,
      required: [true, 'Correct answer is required'],
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    explanation: {
      // optional AI-generated rationale, shown after submission (bonus feature)
      type: String,
      default: '',
    },
    marks: {
      type: Number,
      default: 1,
      min: 0,
    },
    source: {
      type: String,
      enum: ['manual', 'ai'],
      default: 'manual',
    },
  },
  { _id: true, timestamps: false }
);

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    quizCode: {
      type: String,
      unique: true,
      uppercase: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: {
      type: String,
      trim: true,
      default: 'General',
    },
    questions: {
      type: [questionSchema],
      default: [],
    },
    duration: {
      // minutes
      type: Number,
      required: true,
      default: 10,
      min: 1,
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
    negativeMarking: {
      enabled: { type: Boolean, default: false },
      value: { type: Number, default: 0.25, min: 0 }, // marks deducted per wrong answer
    },
    shuffleQuestions: {
      type: Boolean,
      default: false,
    },
    shuffleOptions: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'closed'],
      default: 'draft',
    },
    publishedAt: {
  type: Date,
  default: null,
},
    aiGenerated: {
      type: Boolean,
      default: false,
    },
    aiPrompt: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

quizSchema.index({ createdBy: 1, createdAt: -1 });
quizSchema.index({ title: 'text', subject: 'text', description: 'text' });

// Auto-generate a unique quiz code and compute total marks before saving
quizSchema.pre('validate', function assignCode(next) {
  if (!this.quizCode) {
    this.quizCode = generateCode();
  }
  next();
});

quizSchema.pre('save', function computeTotals(next) {
  if (this.isModified('questions')) {
    this.totalMarks = this.questions.reduce((sum, q) => sum + (q.marks || 1), 0);
  }
  next();
});

module.exports = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);