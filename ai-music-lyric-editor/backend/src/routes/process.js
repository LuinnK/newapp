// Processing route handler
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// In-memory store for processing status (replace with database in production)
const processingStore = new Map();

/**
 * POST /api/process/:uploadId
 * Start processing audio with new lyrics
 */
router.post('/:uploadId', async (req, res) => {
  try {
    const { uploadId } = req.params;
    const { originalLyrics, newLyrics, voiceStyle = 'default' } = req.body;

    if (!originalLyrics || !newLyrics) {
      return res.status(400).json({
        error: 'Missing required fields: originalLyrics, newLyrics',
      });
    }

    const processId = uuidv4();

    // Store processing status
    processingStore.set(processId, {
      processId,
      uploadId,
      status: 'processing',
      progress: 0,
      startedAt: new Date(),
      steps: [
        { name: 'vocal_extraction', status: 'pending', progress: 0 },
        { name: 'lyric_generation', status: 'pending', progress: 0 },
        { name: 'voice_synthesis', status: 'pending', progress: 0 },
        { name: 'audio_mixing', status: 'pending', progress: 0 },
      ],
      input: {
        originalLyrics,
        newLyrics,
        voiceStyle,
      },
    });

    // Start async processing (in real implementation, this would be a job queue)
    simulateProcessing(processId);

    res.json({
      processId,
      uploadId,
      status: 'processing',
      progress: 0,
      message: 'Processing started',
    });
  } catch (err) {
    console.error('Process error:', err);
    res.status(500).json({ error: 'Processing failed', message: err.message });
  }
});

/**
 * GET /api/process/:processId
 * Get processing status
 */
router.get('/:processId', async (req, res) => {
  try {
    const { processId } = req.params;
    const status = processingStore.get(processId);

    if (!status) {
      return res.status(404).json({ error: 'Process not found' });
    }

    res.json(status);
  } catch (err) {
    console.error('Status error:', err);
    res.status(500).json({ error: 'Failed to get status', message: err.message });
  }
});

/**
 * Simulate audio processing pipeline
 * In production, this would be replaced with actual processing
 */
function simulateProcessing(processId) {
  const status = processingStore.get(processId);
  if (!status) return;

  const steps = status.steps;
  let currentStep = 0;
  let currentStepProgress = 0;

  const processInterval = setInterval(() => {
    const step = steps[currentStep];

    // Update current step
    currentStepProgress += Math.random() * 30;
    if (currentStepProgress > 100) {
      currentStepProgress = 100;
      step.status = 'completed';
      step.progress = 100;

      currentStep++;
      currentStepProgress = 0;

      if (currentStep >= steps.length) {
        // All steps completed
        status.status = 'completed';
        status.progress = 100;
        status.completedAt = new Date();
        status.resultUrl = `/api/download/${processId}.mp3`;

        clearInterval(processInterval);
        console.log(`✅ Processing complete: ${processId}`);
        return;
      }

      steps[currentStep].status = 'processing';
    } else {
      step.status = 'processing';
      step.progress = currentStepProgress;
    }

    // Update overall progress
    const totalProgress = steps.reduce((sum, s) => sum + s.progress, 0);
    status.progress = Math.round(totalProgress / steps.length);
  }, 1000);
}

module.exports = router;
