const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// ✅ FIXED: Proper io initialization
const io = new Server(server, { 
  cors: { origin: "*", credentials: true } 
});
global.io = io;

// ✅ FIXED: Production CORS
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/videos', require('./routes/videos'));

// ✅ FIXED: Correct env var
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err));

// Socket.io
io.on('connection', (socket) => {
  console.log('👤 User connected');
  socket.on('disconnect', () => console.log('👤 User disconnected'));
});

// ✅ FIXED: Correct listen
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
