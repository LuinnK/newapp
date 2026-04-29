// OpenAI Integration
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate new lyrics based on original
 * @param {string} originalLyrics - Original song lyrics
 * @param {string} context - Context for lyrics (mood, style, theme)
 * @returns {Promise<string>} Generated new lyrics
 */
async function generateLyrics(originalLyrics, context = '') {
  try {
    const prompt = `You are a professional lyric writer. 
Given the following original lyrics, generate new lyrics that:
1. Keep the same structure and rhythm
2. Maintain the same melody/syllable count per line
3. Preserve the overall mood and emotion
4. Use modern, engaging language
${context ? `5. Reflect this context: ${context}` : ''}

Original Lyrics:
${originalLyrics}

Generate only the new lyrics without any explanation.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert lyric writer who maintains song structure and rhythm.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating lyrics:', error);
    throw new Error('Failed to generate lyrics');
  }
}

/**
 * Analyze sentiment of lyrics
 * @param {string} lyrics - Lyrics to analyze
 * @returns {Promise<Object>} Sentiment analysis
 */
async function analyzeSentiment(lyrics) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Analyze the sentiment of these lyrics and return JSON format:
{
  "sentiment": "positive|negative|neutral|mixed",
  "mood": "happy|sad|energetic|calm|angry",
  "themes": ["theme1", "theme2"],
  "tone": "formal|casual|poetic|rap"
}

Lyrics:
${lyrics}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    try {
      return JSON.parse(response.choices[0].message.content);
    } catch {
      console.warn('Could not parse sentiment response as JSON');
      return {};
    }
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return {};
  }
}

module.exports = {
  generateLyrics,
  analyzeSentiment,
};
