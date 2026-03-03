require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const { verifySocketToken } = require('./middleware/auth');
const { startTransactionStream } = require('./services/transactionGenerator');

const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://localhost:27017/ecommerce_fraud_dashboard';

async function start() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const app = express();
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: FRONTEND_ORIGIN,
      methods: ['GET', 'POST'],
    },
  });

  io.of('/transactions').use((socket, next) => {
    const token = socket.handshake.auth?.token;
    const user = verifySocketToken(token);
    if (!user) {
      return next(new Error('Unauthorized'));
    }
    socket.user = user;
    next();
  });

  io.of('/transactions').on('connection', (socket) => {
    console.log('Client connected to /transactions namespace:', socket.user.email);

    socket.on('disconnect', () => {
      console.log('Client disconnected from /transactions');
    });
  });

  app.use(
    cors({
      origin: FRONTEND_ORIGIN,
      credentials: false,
    })
  );
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/auth', authRoutes);
  app.use('/transactions', transactionRoutes);

  server.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}`);
  });

  startTransactionStream(io);
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

