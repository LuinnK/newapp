// Audio Processing Service (FFmpeg wrapper)
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

/**
 * Extract vocal and instrumental tracks from audio
 * @param {string} inputPath - Path to input audio file
 * @param {Object} outputPaths - Output paths {vocal, instrumental}
 * @returns {Promise<void>}
 */
async function separateVocalsAndInstrumentals(inputPath, outputPaths) {
  return new Promise((resolve, reject) => {
    // Note: This requires Spleeter to be installed
    // For production, consider using Audio Separator library

    ffmpeg(inputPath)
      .output(outputPaths.vocal)
      .output(outputPaths.instrumental)
      .on('end', () => {
        console.log('Vocal separation completed');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error separating vocals:', err);
        reject(err);
      })
      .run();
  });
}

/**
 * Get audio duration
 * @param {string} filePath - Path to audio file
 * @returns {Promise<number>} Duration in seconds
 */
async function getAudioDuration(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata.format.duration);
      }
    });
  });
}

/**
 * Merge audio tracks
 * @param {Object} inputs - Input paths {vocal, instrumental}
 * @param {string} outputPath - Output file path
 * @param {Object} options - Mixing options {vocalGain, instrumentalGain}
 * @returns {Promise<void>}
 */
async function mergeAudioTracks(inputs, outputPath, options = {}) {
  const {
    vocalGain = 0,
    instrumentalGain = -3,
  } = options;

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputs.instrumental)
      .input(inputs.vocal)
      .complexFilter([
        `[0]volume=${Math.pow(10, instrumentalGain / 20)}[a]`,
        `[1]volume=${Math.pow(10, vocalGain / 20)}[b]`,
        '[a][b]amix=inputs=2:duration=first[out]',
      ])
      .map('[out]')
      .output(outputPath)
      .on('end', () => {
        console.log('Audio merging completed');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error merging audio:', err);
        reject(err);
      })
      .run();
  });
}

/**
 * Convert audio to MP3
 * @param {string} inputPath - Path to input audio
 * @param {string} outputPath - Path to output MP3
 * @param {Object} options - Encoding options
 * @returns {Promise<void>}
 */
async function convertToMP3(inputPath, outputPath, options = {}) {
  const {
    bitrate = '192k',
    sampleRate = 44100,
  } = options;

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioBitrate(bitrate)
      .audioFrequency(sampleRate)
      .output(outputPath)
      .on('end', () => {
        console.log('Audio conversion to MP3 completed');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error converting to MP3:', err);
        reject(err);
      })
      .run();
  });
}

/**
 * Normalize audio levels
 * @param {string} inputPath - Path to input audio
 * @param {string} outputPath - Path to output audio
 * @returns {Promise<void>}
 */
async function normalizeAudio(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioFilters('loudnorm')
      .output(outputPath)
      .on('end', () => {
        console.log('Audio normalization completed');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error normalizing audio:', err);
        reject(err);
      })
      .run();
  });
}

module.exports = {
  separateVocalsAndInstrumentals,
  getAudioDuration,
  mergeAudioTracks,
  convertToMP3,
  normalizeAudio,
};
