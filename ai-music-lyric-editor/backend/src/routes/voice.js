// API route for voice synthesis using ElevenLabs
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { synthesizeSpeech, getVoices } = require('../services/elevenlabs-service');

const router = express.Router();

// Create uploads directory if needed
const uploadsDir = process.env.PROCESSED_DIR || 'processed/';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * POST /api/voice/synthesize
 * Synthesize speech from text using ElevenLabs
 */
router.post('/synthesize', async (req, res) => {
  try {
    const {
      text,
      voiceId = process.env.ELEVENLABS_VOICE_ID,
      stability = 0.5,
      similarityBoost = 0.75,
    } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        error: 'Text is required',
        code: 'MISSING_TEXT',
      });
    }

    if (!voiceId) {
      return res.status(400).json({
        error: 'Voice ID not configured',
        code: 'NO_VOICE_ID',
      });
    }

    console.log(`🎤 Synthesizing speech with ElevenLabs (voice: ${voiceId})...`);

    // Synthesize speech
    const audioBuffer = await synthesizeSpeech(text, voiceId, {
      stability,
      similarityBoost,
    });

    // Save to file
    const fileName = `${crypto.randomUUID()}.mp3`;
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, audioBuffer);

    res.json({
      success: true,
      audioFile: fileName,
      audioPath: `${uploadsDir}${fileName}`,
      textLength: text.length,
      synthesizedAt: new Date(),
      voiceSettings: {
        stability,
        similarityBoost,
      },
    });
  } catch (err) {
    console.error('Voice synthesis error:', err);
    res.status(500).json({
      error: 'Failed to synthesize voice',
      message: err.message,
      code: 'SYNTHESIS_ERROR',
    });
  }
});

/**
 * GET /api/voice/list
 * Get available voices
 */
router.get('/list', async (req, res) => {
  try {
    console.log('📋 Fetching available voices...');
    const voices = await getVoices();

    res.json({
      success: true,
      voices,
      count: voices.length,
    });
  } catch (err) {
    console.error('Error fetching voices:', err);
    res.status(500).json({
      error: 'Failed to fetch voices',
      message: err.message,
    });
  }
});

module.exports = router;
