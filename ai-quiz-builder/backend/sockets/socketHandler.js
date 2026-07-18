// // const jwt = require('jsonwebtoken');
// // const Attempt = require('../models/Attempt');
// // const User = require('../models/User');

// // // In-memory map of quizId -> Set of socketIds currently in that quiz room.
// // // Fine for a single-instance deployment; swap for a Redis adapter to scale horizontally.
// // const roomParticipants = new Map();

// // /**
// //  * Builds a sorted leaderboard (rank, name, score, percentage, submission time)
// //  * for a given quiz. Shared by the REST leaderboard endpoint and every
// //  * socket broadcast so both stay perfectly in sync.
// //  */
// // const buildLeaderboard = async (quizId) => {
// //   const attempts = await Attempt.find({ quiz: quizId })
// //     .populate('student', 'name avatarColor')
// //     .sort({ score: -1, submittedAt: 1 });

// //   return attempts.map((a, index) => ({
// //     rank: index + 1,
// //     studentId: a.student._id,
// //     studentName: a.student.name,
// //     avatarColor: a.student.avatarColor,
// //     score: a.score,
// //     totalMarks: a.totalMarks,
// //     percentage: a.percentage,
// //     submittedAt: a.submittedAt,
// //   }));
// // };

// // /**
// //  * Authenticates a socket connection using the same JWT issued by the REST API.
// //  */
// // const authenticateSocket = async (socket, next) => {
// //   try {
// //     const token = socket.handshake.auth?.token;
// //     if (!token) return next(new Error('Authentication required'));

// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     const user = await User.findById(decoded.id);
// //     if (!user) return next(new Error('User not found'));

// //     socket.user = { id: user._id.toString(), name: user.name, role: user.role };
// //     next();
// //   } catch (err) {
// //     next(new Error('Invalid or expired token'));
// //   }
// // };

// // const emitParticipantCount = (io, quizId) => {
// //   const count = roomParticipants.get(quizId)?.size || 0;
// //   io.to(`quiz:${quizId}`).emit('room:participantCount', { quizId, count });
// // };

// // /**
// //  * Registers all Socket.io event handlers. Called once from server.js with
// //  * the shared `io` instance.
// //  */
// // const registerSocketHandlers = (io) => {
// //   io.use(authenticateSocket);

// //   io.on('connection', (socket) => {
// //     console.log(`[socket] connected: ${socket.user.name} (${socket.user.role}) — ${socket.id}`);

// //     // Student or teacher joins a quiz's live room (lobby + during attempt)
// //     socket.on('room:join', async ({ quizId }) => {
// //       if (!quizId) return;
// //       socket.join(`quiz:${quizId}`);

// //       if (!roomParticipants.has(quizId)) roomParticipants.set(quizId, new Set());
// //       roomParticipants.get(quizId).add(socket.id);
// //       socket.data.quizId = quizId;

// //       emitParticipantCount(io, quizId);

// //       // Send the current leaderboard immediately on join so late joiners aren't blank
// //       try {
// //         const leaderboard = await buildLeaderboard(quizId);
// //         socket.emit('leaderboard:update', leaderboard);
// //       } catch (err) {
// //         console.error('[socket] failed to build leaderboard on join:', err.message);
// //       }
// //     });

// //     socket.on('room:leave', ({ quizId }) => {
// //       if (!quizId) return;
// //       socket.leave(`quiz:${quizId}`);
// //       roomParticipants.get(quizId)?.delete(socket.id);
// //       emitParticipantCount(io, quizId);
// //     });

// //     // Lightweight presence ping so teachers see "X students currently answering"
// //     socket.on('quiz:progress', ({ quizId, answeredCount, totalQuestions }) => {
// //       if (!quizId) return;
// //       socket.to(`quiz:${quizId}`).emit('quiz:studentProgress', {
// //         studentId: socket.user.id,
// //         studentName: socket.user.name,
// //         answeredCount,
// //         totalQuestions,
// //       });
// //     });
// //     socket.on("quiz:cheating", ({ quizId, type }) => {
// //        console.log(
// //     "CHEATING EVENT RECEIVED:",
// //     socket.user.name,
// //     type
// //   );

// //   if (!quizId) return;

// //   socket.to(`quiz:${quizId}`).emit("quiz:cheatingDetected", {

// //     studentId: socket.user.id,

// //     studentName: socket.user.name,

// //     type,

// //     time: new Date()
 

// //   });
// //      console.log("EVENT EMITTED TO TEACHER");

// // });

// //     socket.on('disconnect', () => {
// //       const quizId = socket.data.quizId;
// //       if (quizId) {
// //         roomParticipants.get(quizId)?.delete(socket.id);
// //         emitParticipantCount(io, quizId);
// //       }
// //       console.log(`[socket] disconnected: ${socket.user?.name} — ${socket.id}`);
// //     });
// //   });
// // };

// // module.exports = { registerSocketHandlers, buildLeaderboard };
// // new files   



// const jwt = require('jsonwebtoken');
// const Attempt = require('../models/Attempt');
// const User = require('../models/User');

// // In-memory map of quizId -> Set of socketIds currently in that quiz room.
// // Fine for a single-instance deployment; swap for a Redis adapter to scale horizontally.
// const roomParticipants = new Map();

// /**
//  * Builds a sorted leaderboard (rank, name, score, percentage, submission time)
//  * for a given quiz. Shared by the REST leaderboard endpoint and every
//  * socket broadcast so both stay perfectly in sync.
//  */
// const buildLeaderboard = async (quizId) => {
//   const attempts = await Attempt.find({ quiz: quizId })
//     .populate('student', 'name avatarColor')
//     .sort({ score: -1, submittedAt: 1 });

//   return attempts.map((a, index) => ({
//     rank: index + 1,
//     studentId: a.student._id,
//     studentName: a.student.name,
//     avatarColor: a.student.avatarColor,
//     score: a.score,
//     totalMarks: a.totalMarks,
//     percentage: a.percentage,
//     submittedAt: a.submittedAt,
//   }));
// };

// /**
//  * Authenticates a socket connection using the same JWT issued by the REST API.
//  */
// const authenticateSocket = async (socket, next) => {
//   try {
//     const token = socket.handshake.auth?.token;
//     if (!token) return next(new Error('Authentication required'));

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);
//     if (!user) return next(new Error('User not found'));

//     socket.user = { id: user._id.toString(), name: user.name, role: user.role };
//     next();
//   } catch (err) {
//     next(new Error('Invalid or expired token'));
//   }
// };

// const emitParticipantCount = (io, quizId) => {
//   const count = roomParticipants.get(quizId)?.size || 0;
//   io.to(`quiz:${quizId}`).emit('room:participantCount', { quizId, count });
// };

// /**
//  * Registers all Socket.io event handlers. Called once from server.js with
//  * the shared `io` instance.
//  */
// const registerSocketHandlers = (io) => {
//   io.use(authenticateSocket);

//   io.on('connection', (socket) => {
//     console.log(`[socket] connected: ${socket.user.name} (${socket.user.role}) — ${socket.id}`);

//     // Student or teacher joins a quiz's live room (lobby + during attempt)
//     socket.on('room:join', async ({ quizId }) => {
//       if (!quizId) return;
//       socket.join(`quiz:${quizId}`);

//       if (!roomParticipants.has(quizId)) roomParticipants.set(quizId, new Set());
//       roomParticipants.get(quizId).add(socket.id);
//       socket.data.quizId = quizId;

//       emitParticipantCount(io, quizId);

//       // Send the current leaderboard immediately on join so late joiners aren't blank
//       try {
//         const leaderboard = await buildLeaderboard(quizId);
//         socket.emit('leaderboard:update', leaderboard);
//       } catch (err) {
//         console.error('[socket] failed to build leaderboard on join:', err.message);
//       }
//     });

//     socket.on('room:leave', ({ quizId }) => {
//       if (!quizId) return;
//       socket.leave(`quiz:${quizId}`);
//       roomParticipants.get(quizId)?.delete(socket.id);
//       emitParticipantCount(io, quizId);
//     });

//     // Lightweight presence ping so teachers see "X students currently answering"
//     socket.on('quiz:progress', ({ quizId, answeredCount, totalQuestions }) => {
//       if (!quizId) return;
//       socket.to(`quiz:${quizId}`).emit('quiz:studentProgress', {
//         studentId: socket.user.id,
//         studentName: socket.user.name,
//         answeredCount,
//         totalQuestions,
//       });
//     });

//     // Anti-cheating: a student's browser reports a live proctoring event
//     // (tab switch, fullscreen exit, copy attempt, devtools shortcut). We
//     // relay it to everyone else in the room — i.e. the teacher watching the
//     // live results page — only students trigger this (role check keeps a
//     // teacher's own tab-switching from spamming their own alert feed).
//     const VALID_VIOLATION_TYPES = new Set(['tab_switch', 'fullscreen_exit', 'copy_attempt', 'devtools_attempt']);
//     socket.on('cheat:violation', ({ quizId, type, violationCount }) => {
//       if (!quizId || socket.user.role !== 'student' || !VALID_VIOLATION_TYPES.has(type)) return;
//       socket.to(`quiz:${quizId}`).emit('cheat:alert', {
//         studentId: socket.user.id,
//         studentName: socket.user.name,
//         type,
//         violationCount,
//         timestamp: new Date().toISOString(),
//       });
//     });

//     socket.on('disconnect', () => {
//       const quizId = socket.data.quizId;
//       if (quizId) {
//         roomParticipants.get(quizId)?.delete(socket.id);
//         emitParticipantCount(io, quizId);
//       }
//       console.log(`[socket] disconnected: ${socket.user?.name} — ${socket.id}`);
//     });
//   });
// };

// module.exports = { registerSocketHandlers, buildLeaderboard };


// new files
const jwt = require('jsonwebtoken');
const Attempt = require('../models/Attempt');
const User = require('../models/User');
const Quiz = require('../models/Quiz');

// quizId -> Map<socketId, { studentId, studentName, role }>
// Tracks who is currently in each quiz's live room, by name — not just a
// count — so the "Live Participants" panel can list students as they join
// and drop them the moment they submit. In-memory, fine for a single
// instance; swap for a Redis adapter to scale horizontally.
const roomParticipants = new Map();

/**
 * Builds a sorted leaderboard (rank, name, score, percentage, submission time)
 * for a given quiz. Shared by the REST leaderboard endpoint and every
 * socket broadcast so both stay perfectly in sync.
 */
const buildLeaderboard = async (quizId) => {
  const attempts = await Attempt.find({ quiz: quizId })
    .populate('student', 'name avatarColor')
    .sort({ score: -1, submittedAt: 1 });

  return attempts.map((a, index) => ({
    rank: index + 1,
    studentId: a.student._id,
    studentName: a.student.name,
    avatarColor: a.student.avatarColor,
    score: a.score,
    totalMarks: a.totalMarks,
    percentage: a.percentage,
    submittedAt: a.submittedAt,
  }));
};

/**
 * Authenticates a socket connection using the same JWT issued by the REST API.
 */
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return next(new Error('User not found'));

    socket.user = { id: user._id.toString(), name: user.name, role: user.role };
    next();
  } catch (err) {
    next(new Error('Invalid or expired token'));
  }
};

/** Builds the de-duplicated list of students currently in a quiz room (one entry per studentId, even if they have multiple tabs open). */
const buildParticipantsList = (quizId) => {
  const entries = roomParticipants.get(quizId);
  if (!entries) return [];

  const byStudent = new Map();
  for (const entry of entries.values()) {
    if (entry.role !== 'student') continue; // teachers watching shouldn't show up as "taking the quiz"
    byStudent.set(entry.studentId, { studentId: entry.studentId, studentName: entry.studentName });
  }
  return [...byStudent.values()];
};

const emitParticipants = (io, quizId) => {
  const participants = buildParticipantsList(quizId);
  io.to(`quiz:${quizId}`).emit('room:participants', {
    quizId,
    count: participants.length,
    participants,
  });
};

// Keep a module-level reference to `io` so REST controllers (which don't
// have direct socket access) can call notifyAttemptEnded() after saving
// an attempt to the DB.
let ioInstance = null;

/**
 * Called from the attempt-submit controller once an attempt is saved.
 * Tells every dashboard/live-results screen watching this quiz (and the
 * owning teacher's personal room) that this student's attempt is over —
 * clears any live cheating alert for them, AND removes them from the
 * "Live Participants" list since they're no longer actively taking it.
 */
const notifyAttemptEnded = async (quizId, studentId) => {
  if (!ioInstance || !quizId || !studentId) return;

  const quizIdStr = quizId.toString();
  const studentIdStr = studentId.toString();
  const payload = { quizId: quizIdStr, studentId: studentIdStr };

  ioInstance.to(`quiz:${quizIdStr}`).emit('quiz:attemptEnded', payload);

  // Drop this student from the room-participants tracking so they no
  // longer show up as "currently taking it" — even if their socket is
  // still technically connected/on the page.
  const entries = roomParticipants.get(quizIdStr);
  if (entries) {
    for (const [socketId, entry] of entries.entries()) {
      if (entry.studentId === studentIdStr) entries.delete(socketId);
    }
    emitParticipants(ioInstance, quizIdStr);
  }

  try {
    const quiz = await Quiz.findById(quizIdStr).select('createdBy');
    if (quiz) {
      const teacherId = quiz.createdBy.toString();
      const teacherAlreadyInQuizRoom = [...(roomParticipants.get(quizIdStr)?.values() || [])].some(
        (p) => p.role === 'teacher' && p.studentId === teacherId
      );
      if (!teacherAlreadyInQuizRoom) {
        ioInstance.to(`teacher:${teacherId}`).emit('quiz:attemptEnded', payload);
      }
    }
  } catch (err) {
    console.error('[socket] notifyAttemptEnded failed to resolve quiz owner:', err.message);
  }
};

/**
 * Registers all Socket.io event handlers. Called once from server.js with
 * the shared `io` instance.
 */
const registerSocketHandlers = (io) => {
  ioInstance = io;
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`[socket] connected: ${socket.user.name} (${socket.user.role}) — ${socket.id}`);

    // Teachers get a personal room so general dashboards (not tied to one
    // quiz's live room) can still receive cheating alerts / attempt-ended events.
    if (socket.user.role === 'teacher') {
      socket.join(`teacher:${socket.user.id}`);
    }

    // Student or teacher joins a quiz's live room (lobby + during attempt)
    socket.on('room:join', async ({ quizId }) => {
      if (!quizId) return;
      socket.join(`quiz:${quizId}`);

      if (!roomParticipants.has(quizId)) roomParticipants.set(quizId, new Map());
      roomParticipants.get(quizId).set(socket.id, {
        studentId: socket.user.id,
        studentName: socket.user.name,
        role: socket.user.role,
      });
      socket.data.quizId = quizId;

      emitParticipants(io, quizId);

      // Send the current leaderboard immediately on join so late joiners aren't blank
      try {
        const leaderboard = await buildLeaderboard(quizId);
        socket.emit('leaderboard:update', leaderboard);
      } catch (err) {
        console.error('[socket] failed to build leaderboard on join:', err.message);
      }
    });

    socket.on('room:leave', ({ quizId }) => {
      if (!quizId) return;
      socket.leave(`quiz:${quizId}`);
      roomParticipants.get(quizId)?.delete(socket.id);
      emitParticipants(io, quizId);
    });

    // Lightweight presence ping so teachers see "X students currently answering"
    socket.on('quiz:progress', ({ quizId, answeredCount, totalQuestions }) => {
      if (!quizId) return;
      socket.to(`quiz:${quizId}`).emit('quiz:studentProgress', {
        studentId: socket.user.id,
        studentName: socket.user.name,
        answeredCount,
        totalQuestions,
      });
    });

    // Anti-cheating: a student's browser reports a live proctoring event
    // (tab switch, fullscreen exit, copy attempt, devtools shortcut). We
    // relay it to everyone else in the room — i.e. the teacher watching the
    // live results page — only students trigger this (role check keeps a
    // teacher's own tab-switching from spamming their own alert feed).
    const VALID_VIOLATION_TYPES = new Set(['tab_switch', 'fullscreen_exit', 'copy_attempt', 'devtools_attempt']);
    socket.on('cheat:violation', async ({ quizId, type, violationCount }) => {
      if (!quizId || socket.user.role !== 'student' || !VALID_VIOLATION_TYPES.has(type)) return;

      const payload = {
        quizId,
        studentId: socket.user.id,
        studentName: socket.user.name,
        type,
        violationCount,
        timestamp: new Date().toISOString(),
      };

      socket.to(`quiz:${quizId}`).emit('quiz:cheatingDetected', payload);

      // Also push to the owning teacher's personal room — but ONLY if that
      // teacher isn't already sitting in this quiz's live room (e.g. on the
      // Results page), otherwise they'd receive the exact same event twice
      // (once per room) and see duplicate alerts/toasts.
      try {
        const quiz = await Quiz.findById(quizId).select('createdBy');
        if (quiz) {
          const teacherId = quiz.createdBy.toString();
          const teacherAlreadyInQuizRoom = [...(roomParticipants.get(quizId)?.values() || [])].some(
            (p) => p.role === 'teacher' && p.studentId === teacherId
          );
          if (!teacherAlreadyInQuizRoom) {
            io.to(`teacher:${teacherId}`).emit('quiz:cheatingDetected', payload);
          }
        }
      } catch (err) {
        console.error('[socket] cheat:violation failed to resolve quiz owner:', err.message);
      }
    });

    socket.on('disconnect', () => {
      const quizId = socket.data.quizId;
      if (quizId) {
        roomParticipants.get(quizId)?.delete(socket.id);
        emitParticipants(io, quizId);
      }
      console.log(`[socket] disconnected: ${socket.user?.name} — ${socket.id}`);
    });
  });
};

module.exports = { registerSocketHandlers, buildLeaderboard, notifyAttemptEnded };