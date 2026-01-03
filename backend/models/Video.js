const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  filename: { type: String, required: true },
  status: { type: String, enum: ['pending', 'processing', 'safe', 'flagged'], default: 'pending' },
  progress: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
