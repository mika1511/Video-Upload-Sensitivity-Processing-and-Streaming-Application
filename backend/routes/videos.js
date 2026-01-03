const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Video = require('../models/Video');
const auth = require('../middleware/auth');


const router = express.Router();


const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, `${req.userId}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only video files allowed!'), false);
        }
    }
});


router.post('/upload', auth, upload.single('video'), async (req, res) => {
    try {
        const video = new Video({
            userId: req.userId,
            title: req.body.title || 'Untitled',
            filename: req.file.filename
        });
        await video.save();


        processVideo(video._id.toString());

        res.json({
            message: 'Video uploaded and processing started!',
            videoId: video._id
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get user's videos
router.get('/', auth, async (req, res) => {
    try {
        const videos = await Video.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(videos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/:id/stream', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ error: 'Video not found' });

        const videoPath = path.join(__dirname, '..', 'uploads', video.filename);

        if (!fs.existsSync(videoPath)) {
            return res.status(404).json({ error: 'Video file not found' });
        }

        const stat = fs.statSync(videoPath);
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
            const chunkSize = (end - start) + 1;

            const file = fs.createReadStream(videoPath, { start, end });
            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${stat.size}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': 'video/mp4',
            });
            file.pipe(res);
        } else {
            res.writeHead(200, {
                'Content-Length': stat.size,
                'Content-Type': 'video/mp4'
            });
            fs.createReadStream(videoPath).pipe(res);
        }
    } catch (err) {
        res.status(500).json({ error: 'Streaming error' });
    }
});


async function processVideo(videoId) {
    console.log(`🎬 Processing video: ${videoId}`);
    const updates = [10, 30, 60, 90, 100];

    for (let i = 0; i < updates.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const status = updates[i] === 100 ? 'safe' : 'processing';
        await Video.findByIdAndUpdate(videoId, {
            progress: updates[i],
            status
        });


        if (global.io) {
            global.io.emit('progress', {
                videoId: videoId,
                progress: updates[i],
                status: status
            });
        }

        console.log(`📈 Progress: ${updates[i]}%`);
    }

    console.log(`✅ Video ${videoId} finished: safe`);
}



module.exports = router;
