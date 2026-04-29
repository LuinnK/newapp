// ElevenLabs Voice Synthesis Service
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';
const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

/**
 * Synthesize speech from text using ElevenLabs
 * @param {string} text - Text to synthesize
 * @param {string} voiceId - Voice ID to use (defaults to env variable)
 * @param {Object} options - Additional options
 * @returns {Promise<Buffer>} Audio buffer (MP3)
 */
async function synthesizeSpeech(text, voiceId = VOICE_ID, options = {}) {
  try {
    const {
      stability = 0.5,
      similarityBoost = 0.75,
      voiceStyle = 'default',
    } = options;

    const response = await axios.post(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
      {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
        },
      },
      {
        headers: {
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    return Buffer.from(response.data);
  } catch (error) {
    console.error('Error synthesizing speech:', error.message);
    throw new Error('Failed to synthesize speech');
  }
}

/**
 * Clone a voice for synthesis
 * @param {string} audioPath - Path to sample audio
 * @param {string} voiceName - Name for the cloned voice
 * @returns {Promise<string>} New voice ID
 */
async function cloneVoice(audioPath, voiceName) {
  try {
    const audioBuffer = fs.readFileSync(audioPath);
    const formData = new FormData();
    formData.append('files', new Blob([audioBuffer]), path.basename(audioPath));
    formData.append('name', voiceName);

    const response = await axios.post(
      `${ELEVENLABS_API_URL}/voices/add`,
      formData,
      {
        headers: {
          'xi-api-key': API_KEY,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.voice_id;
  } catch (error) {
    console.error('Error cloning voice:', error.message);
    throw new Error('Failed to clone voice');
  }
}

/**
 * Get available voices
 * @returns {Promise<Array>} List of available voices
 */
async function getVoices() {
  try {
    const response = await axios.get(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        'xi-api-key': API_KEY,
      },
    });

    return response.data.voices;
  } catch (error) {
    console.error('Error fetching voices:', error.message);
    throw new Error('Failed to fetch voices');
  }
}

module.exports = {
  synthesizeSpeech,
  cloneVoice,
  getVoices,
};
