const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

//  Socket.IO
const io = new Server(server, { 
  cors: { 
    origin: "*", 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
  } 
});
global.io = io;

// CORS
app.use(cors({ 
  origin: "*", 
  credentials: true 
}));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/videos', require('./routes/videos'));


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});


app.get('/', (req, res) => {
  res.json({ message: 'Video Processing API - Backend is running' });
});


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err));


io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);
  socket.on('disconnect', () => console.log('👤 User disconnected:', socket.id));
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Backend URL: http://localhost:${PORT}`);
});