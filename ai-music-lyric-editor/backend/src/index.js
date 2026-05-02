require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    service: 'AI Music Lyric Editor Backend'
  });
});

app.use('/api/upload', require('./routes/upload'));
app.use('/api/process', require('./routes/process'));
app.use('/api/download', require('./routes/download'));
app.use('/api/lyrics', require('./routes/lyrics'));
app.use('/api/voice', require('./routes/voice'));

app.use((err, req, res, _next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'File too large',
      message: 'The uploaded file exceeds the maximum allowed size.',
    });
  }

  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({
      error: 'Invalid file type',
      message: err.message,
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    status: err.status || 500
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET  /health');
  console.log('  POST /api/upload');
  console.log('  POST /api/process/:uploadId');
  console.log('  GET  /api/process/:processId');
  console.log('  GET  /api/download/:fileId');
  console.log('  POST /api/lyrics/generate');
  console.log('  POST /api/voice/synthesize');
  console.log('  GET  /api/voice/list');
});

module.exports = app;
