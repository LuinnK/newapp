const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type ApiErrorPayload = {
  error?: string;
  message?: string;
};

async function getErrorMessage(response: Response, fallback: string) {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      const body = (await response.json()) as ApiErrorPayload;
      return body.message || body.error || fallback;
    } catch {
      return fallback;
    }
  }

  return response.statusText || fallback;
}

export const apiClient = {
  async checkHealth() {
    const response = await fetch(`${API_URL}/health`);
    return response.json();
  },

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
      throw new Error(await getErrorMessage(response, 'Upload failed'));
    }

    return response.json();
  },

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
      throw new Error(await getErrorMessage(response, 'Failed to generate lyrics'));
    }

    return response.json();
  },

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
      throw new Error(await getErrorMessage(response, 'Processing failed'));
    }

    return response.json();
  },

  async getStatus(processId: string) {
    const response = await fetch(`${API_URL}/api/process/${processId}`);
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Status check failed'));
    }
    return response.json();
  },

  async pollUntilComplete(processId: string, maxAttempts = 60) {
    for (let i = 0; i < maxAttempts; i++) {
      const status = await this.getStatus(processId);
      if (status.status === 'completed' || status.status === 'failed') {
        return status;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    throw new Error('Processing timeout');
  },

  getDownloadUrl(resultId: string) {
    return `${API_URL}/api/download/${resultId}`;
  },

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
      throw new Error(await getErrorMessage(response, 'Failed to synthesize voice'));
    }

    return response.json();
  },

  async getAvailableVoices() {
    const response = await fetch(`${API_URL}/api/voice/list`);
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Failed to fetch voices'));
    }
    return response.json();
  },
};
