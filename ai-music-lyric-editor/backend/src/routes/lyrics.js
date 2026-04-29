// API route for lyric generation using OpenAI
const express = require('express');
const { generateLyrics, analyzeSentiment } = require('../services/openai-service');

const router = express.Router();

/**
 * POST /api/lyrics/generate
 * Generate new lyrics based on original lyrics
 */
router.post('/generate', async (req, res) => {
  try {
    const { originalLyrics, context = '' } = req.body;

    if (!originalLyrics || originalLyrics.trim().length === 0) {
      return res.status(400).json({
        error: 'Original lyrics are required',
        code: 'MISSING_LYRICS',
      });
    }

    console.log('🎵 Generating lyrics with OpenAI...');
    
    // Generate lyrics
    const newLyrics = await generateLyrics(originalLyrics, context);

    // Analyze sentiment (optional)
    const sentiment = await analyzeSentiment(newLyrics);

    res.json({
      success: true,
      originalLyrics,
      generatedLyrics: newLyrics,
      sentiment,
      generatedAt: new Date(),
    });
  } catch (err) {
    console.error('Lyric generation error:', err);
    res.status(500).json({
      error: 'Failed to generate lyrics',
      message: err.message,
      code: 'GENERATION_ERROR',
    });
  }
});

/**
 * POST /api/lyrics/analyze
 * Analyze lyrics sentiment and characteristics
 */
router.post('/analyze', async (req, res) => {
  try {
    const { lyrics } = req.body;

    if (!lyrics || lyrics.trim().length === 0) {
      return res.status(400).json({
        error: 'Lyrics are required',
      });
    }

    const sentiment = await analyzeSentiment(lyrics);

    res.json({
      success: true,
      sentiment,
      analyzedAt: new Date(),
    });
  } catch (err) {
    console.error('Sentiment analysis error:', err);
    res.status(500).json({
      error: 'Failed to analyze lyrics',
      message: err.message,
    });
  }
});

module.exports = router;
