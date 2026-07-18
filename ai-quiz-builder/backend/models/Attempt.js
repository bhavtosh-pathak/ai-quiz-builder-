// const mongoose = require('mongoose');

// const answerSchema = new mongoose.Schema(
//   {
//     questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
//     selectedOption: { type: String, default: null }, // null = unanswered
//     correctAnswer: { type: String, required: true },
//     isCorrect: { type: Boolean, required: true },
//     marksAwarded: { type: Number, required: true, default: 0 },
//     timeTakenSeconds: { type: Number, default: 0 },
//   },
//   { _id: false }
// );

// const attemptSchema = new mongoose.Schema(
//   {
//     student: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     quiz: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Quiz',
//       required: true,
//     },
//     answers: {
//       type: [answerSchema],
//       default: [],
//     },
//     score: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//     totalMarks: {
//       type: Number,
//       required: true,
//     },
//     percentage: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//     correctCount: { type: Number, default: 0 },
//     wrongCount: { type: Number, default: 0 },
//     skippedCount: { type: Number, default: 0 },
//     startedAt: {
//       type: Date,
//       required: true,
//     },
//     submittedAt: {
//       type: Date,
//       default: Date.now,
//     },
//     durationTakenSeconds: {
//       type: Number,
//       default: 0,
//     },
//     autoSubmitted: {
//       type: Boolean,
//       default: false,
//     },
//     cheatingLogs: [
//   {
//     type: {
//       type: String,
//       enum: [
//         "TAB_SWITCH",
//         "COPY",
//         "PASTE",
//         "FULLSCREEN_EXIT"
//       ],
//       required: true,
//     },

//     timestamp: {
//       type: Date,
//       default: Date.now,
//     },
//   }
// ],

// tabSwitchCount: {
//   type: Number,
//   default: 0,
// },

// cheatingScore: {
//   type: Number,
//   default: 0,
// },
//   },
//   { timestamps: true }
// );

// // One attempt per student per quiz — prevents duplicate/re-attempts
// attemptSchema.index({ student: 1, quiz: 1 }, { unique: true });
// // Used heavily by leaderboard queries (sort by score desc, then submission time asc)
// attemptSchema.index({ quiz: 1, score: -1, submittedAt: 1 });

// module.exports = mongoose.model('Attempt', attemptSchema);
// new files are here


// const mongoose = require('mongoose');

// const answerSchema = new mongoose.Schema(
//   {
//     questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
//     selectedOption: { type: String, default: null }, // null = unanswered
//     correctAnswer: { type: String, required: true },
//     isCorrect: { type: Boolean, required: true },
//     marksAwarded: { type: Number, required: true, default: 0 },
//     timeTakenSeconds: { type: Number, default: 0 },
//   },
//   { _id: false }
// );

// // One recorded anti-cheating event: a tab switch, an exit from fullscreen,
// // a copy/paste attempt, or a devtools-shortcut attempt.
// const violationSchema = new mongoose.Schema(
//   {
//     type: {
//       type: String,
//       enum: ['tab_switch', 'fullscreen_exit', 'copy_attempt', 'devtools_attempt'],
//       required: true,
//     },
//     timestamp: { type: Date, default: Date.now },
//   },
//   { _id: false }
// );

// const attemptSchema = new mongoose.Schema(
//   {
//     student: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     quiz: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Quiz',
//       required: true,
//     },
//     answers: {
//       type: [answerSchema],
//       default: [],
//     },
//     score: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//     totalMarks: {
//       type: Number,
//       required: true,
//     },
//     percentage: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//     correctCount: { type: Number, default: 0 },
//     wrongCount: { type: Number, default: 0 },
//     skippedCount: { type: Number, default: 0 },
//     startedAt: {
//       type: Date,
//       required: true,
//     },
//     submittedAt: {
//       type: Date,
//       default: Date.now,
//     },
//     durationTakenSeconds: {
//       type: Number,
//       default: 0,
//     },
//     autoSubmitted: {
//       type: Boolean,
//       default: false,
//     },
//     // --- Anti-cheating / proctoring ---
//     violations: {
//       type: [violationSchema],
//       default: [],
//     },
//     violationCount: {
//       type: Number,
//       default: 0,
//     },
//     flagged: {
//       // true once violationCount crosses the configured threshold —
//       // surfaced to the teacher as an integrity warning, not a hard block
//       // (the attempt is still auto-submitted and graded normally).
//       type: Boolean,
//       default: false,
//     },
//     autoSubmitReason: {
//       type: String,
//       enum: ['timeout', 'cheating', null],
//       default: null,
//     },
//   },
//   { timestamps: true }
// );

// // One attempt per student per quiz — prevents duplicate/re-attempts
// attemptSchema.index({ student: 1, quiz: 1 }, { unique: true });
// // Used heavily by leaderboard queries (sort by score desc, then submission time asc)
// attemptSchema.index({ quiz: 1, score: -1, submittedAt: 1 });

// module.exports = mongoose.model('Attempt', attemptSchema);





const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    selectedOption: { type: String, default: null }, // null = unanswered
    correctAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    marksAwarded: { type: Number, required: true, default: 0 },
    timeTakenSeconds: { type: Number, default: 0 },
  },
  { _id: false }
);

// One recorded anti-cheating event: a tab switch, an exit from fullscreen,
// a copy/paste attempt, or a devtools-shortcut attempt.
const violationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['tab_switch', 'fullscreen_exit', 'copy_attempt', 'devtools_attempt'],
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const attemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    answers: {
      type: [answerSchema],
      default: [],
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
      default: 0,
    },
    correctCount: { type: Number, default: 0 },
    wrongCount: { type: Number, default: 0 },
    skippedCount: { type: Number, default: 0 },
    startedAt: {
      type: Date,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    durationTakenSeconds: {
      type: Number,
      default: 0,
    },
    autoSubmitted: {
      type: Boolean,
      default: false,
    },
    // --- Anti-cheating / proctoring ---
    violations: {
      type: [violationSchema],
      default: [],
    },
    violationCount: {
      type: Number,
      default: 0,
    },
    flagged: {
      // true once violationCount crosses the configured threshold —
      // surfaced to the teacher as an integrity warning, not a hard block
      // (the attempt is still auto-submitted and graded normally).
      type: Boolean,
      default: false,
    },
    autoSubmitReason: {
      type: String,
      enum: ['timeout', 'cheating', null],
      default: null,
    },
  },
  { timestamps: true }
);

// One attempt per student per quiz — prevents duplicate/re-attempts
attemptSchema.index({ student: 1, quiz: 1 }, { unique: true });
// Used heavily by leaderboard queries (sort by score desc, then submission time asc)
attemptSchema.index({ quiz: 1, score: -1, submittedAt: 1 });

// Guards against "Cannot overwrite model once compiled" if this module is
// ever evaluated more than once in the same process (can happen with some
// nodemon reload edge cases, or if another file mistakenly re-registers
// the schema) — reuse the already-compiled model instead of re-defining it.
module.exports = mongoose.models.Attempt || mongoose.model('Attempt', attemptSchema);