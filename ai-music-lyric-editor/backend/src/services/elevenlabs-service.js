const axios = require('axios');
const fs = require('fs');
const path = require('path');

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

function getApiKey() {
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY is not configured. Please add it to your .env file.');
  }
  return process.env.ELEVENLABS_API_KEY;
}

async function synthesizeSpeech(text, voiceId, options = {}) {
  const apiKey = getApiKey();
  const resolvedVoiceId = voiceId || process.env.ELEVENLABS_VOICE_ID;

  if (!resolvedVoiceId) {
    throw new Error('Voice ID not configured. Set ELEVENLABS_VOICE_ID in .env or pass a voiceId.');
  }

  const {
    stability = 0.5,
    similarityBoost = 0.75,
  } = options;

  try {
    const response = await axios.post(
      `${ELEVENLABS_API_URL}/text-to-speech/${resolvedVoiceId}`,
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
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
        timeout: 30000,
      }
    );

    return Buffer.from(response.data);
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error('Invalid ElevenLabs API key. Please check your ELEVENLABS_API_KEY in .env');
      }
      if (error.response.status === 429) {
        throw new Error('ElevenLabs rate limit exceeded. Please try again later.');
      }
    }
    throw new Error('Failed to synthesize speech: ' + error.message);
  }
}

async function cloneVoice(audioPath, voiceName) {
  const apiKey = getApiKey();

  if (!fs.existsSync(audioPath)) {
    throw new Error('Audio file not found: ' + audioPath);
  }

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
          'xi-api-key': apiKey,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
      }
    );

    return response.data.voice_id;
  } catch (error) {
    throw new Error('Failed to clone voice: ' + error.message);
  }
}

async function getVoices() {
  const apiKey = getApiKey();

  try {
    const response = await axios.get(`${ELEVENLABS_API_URL}/voices`, {
      headers: { 'xi-api-key': apiKey },
      timeout: 10000,
    });

    return response.data.voices;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('Invalid ElevenLabs API key. Please check your ELEVENLABS_API_KEY in .env');
    }
    throw new Error('Failed to fetch voices: ' + error.message);
  }
}

module.exports = {
  synthesizeSpeech,
  cloneVoice,
  getVoices,
};
