// API client for frontend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const apiClient = {
  // Health check
  async checkHealth() {
    const response = await fetch(`${API_URL}/health`);
    return response.json();
  },

  // Upload audio file
  async uploadAudio(file: File, originalLyrics?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (originalLyrics) {
      formData.append('originalLyrics', originalLyrics);
    }

    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  },

  // Generate lyrics with OpenAI
  async generateLyrics(originalLyrics: string, context?: string) {
    const response = await fetch(`${API_URL}/api/lyrics/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        originalLyrics,
        context: context || '',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate lyrics');
    }

    return response.json();
  },

  // Process audio with new lyrics
  async processAudio(uploadId: string, payload: {
    originalLyrics: string;
    newLyrics: string;
    voiceStyle?: string;
  }) {
    const response = await fetch(`${API_URL}/api/process/${uploadId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Processing failed: ${response.statusText}`);
    }

    return response.json();
  },

  // Get processing status
  async getStatus(processId: string) {
    const response = await fetch(`${API_URL}/api/process/${processId}`);
    if (!response.ok) {
      throw new Error(`Status check failed: ${response.statusText}`);
    }
    return response.json();
  },

  // Poll for completion
  async pollUntilComplete(processId: string, maxAttempts = 60) {
    for (let i = 0; i < maxAttempts; i++) {
      const status = await this.getStatus(processId);
      if (status.status === 'completed' || status.status === 'failed') {
        return status;
      }
      // Wait 2 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    throw new Error('Processing timeout');
  },

  // Get download URL
  getDownloadUrl(resultId: string) {
    return `${API_URL}/api/download/${resultId}`;
  },

  // Synthesize voice with ElevenLabs
  async synthesizeVoice(text: string, voiceId?: string) {
    const response = await fetch(`${API_URL}/api/voice/synthesize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        voiceId: voiceId || undefined,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to synthesize voice');
    }

    return response.json();
  },

  // Get available voices
  async getAvailableVoices() {
    const response = await fetch(`${API_URL}/api/voice/list`);
    if (!response.ok) {
      throw new Error('Failed to fetch voices');
    }
    return response.json();
  },
};
