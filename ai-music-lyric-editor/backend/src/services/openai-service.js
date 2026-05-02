const { OpenAI } = require('openai');

let openai = null;

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured. Please add it to your .env file.');
  }
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

async function generateLyrics(originalLyrics, context = '') {
  const client = getOpenAIClient();

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

  try {
    const response = await client.chat.completions.create({
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
    console.error('OpenAI API error:', error.message);
    if (error.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your OPENAI_API_KEY in .env');
    }
    if (error.status === 429) {
      throw new Error('OpenAI rate limit exceeded. Please try again later.');
    }
    throw new Error('Failed to generate lyrics: ' + error.message);
  }
}

async function analyzeSentiment(lyrics) {
  try {
    const client = getOpenAIClient();

    const response = await client.chat.completions.create({
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
    console.error('Sentiment analysis error:', error.message);
    return {};
  }
}

module.exports = {
  generateLyrics,
  analyzeSentiment,
};
