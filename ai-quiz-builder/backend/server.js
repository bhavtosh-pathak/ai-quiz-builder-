require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { registerSocketHandlers } = require('./sockets/socketHandler');

const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const aiRoutes = require('./routes/aiRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// Make io available to controllers via req.app.get('io')
app.set('io', io);
registerSocketHandlers(io);

// --- Core middleware ---
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'AI Quiz Builder API is running', timestamp: new Date().toISOString() });
});

// --- API routes ---
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/dashboard', dashboardRoutes);

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[server] AI Quiz Builder API listening on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
});

// Graceful shutdown
process.on('unhandledRejection', (err) => {
  console.error('[server] Unhandled rejection:', err.message);
});

module.exports = { app, server, io };
