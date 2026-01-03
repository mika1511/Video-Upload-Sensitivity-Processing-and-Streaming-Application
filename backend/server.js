const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();


const app = express();
const server = http.createServer(app);
global.io = new Server(server, { 
  cors: { origin: ["http://localhost:5173", "http://localhost:5174"] } 
});

global.io = io;
// Global io reference


// Middleware
app.use(cors({ 
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true 
}));


app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use('/uploads', express.static('uploads'));


// Routes

app.use('/api/auth', require('./routes/auth'));
app.use('/api/videos', require('./routes/videos'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err));

// Socket.io
// Socket.io
io.on('connection', (socket) => {
  console.log('👤 User connected');
  socket.on('disconnect', () => console.log('👤 User disconnected'));
});


server.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`);
});

module.exports = { io };

