// Upload route handler
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { getAudioDuration } = require('../services/audio-service');

const router = express.Router();

// Create upload directory if it doesn't exist
const uploadDir = process.env.UPLOAD_DIR || 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${crypto.randomUUID()}${ext}`;
    cb(null, name);
  },
});

// File filter to only accept audio files
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/flac', 'audio/ogg'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only audio files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
  },
});

/**
 * POST /api/upload
 * Upload an audio file
 */
router.post('/', upload.single('file'), async (req, res) => {
  const deleteUploadedFile = () => {
    if (!req.file) {
      return;
    }

    fs.unlink(req.file.path, (error) => {
      if (error) {
        console.error('Failed to delete upload:', error.message);
      }
    });
  };

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const uploadId = crypto.randomUUID();
    const duration = await getAudioDuration(req.file.path);

    if (duration < 5 || duration > 9) {
      deleteUploadedFile();

      return res.status(400).json({
        error: 'Audio duration must be between 5 and 9 seconds',
        duration,
      });
    }

    res.json({
      uploadId,
      fileName: req.file.originalname,
      fileId: req.file.filename,
      duration,
      size: req.file.size,
      mimeType: req.file.mimetype,
      uploadedAt: new Date(),
      status: 'processing',
    });
  } catch (err) {
    deleteUploadedFile();
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed', message: err.message });
  }
});

module.exports = router;
