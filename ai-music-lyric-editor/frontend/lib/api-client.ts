const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const REQUEST_TIMEOUT = 30000;

class ApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', status: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = REQUEST_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(
        'Request timed out. Please try again.',
        'TIMEOUT',
        408
      );
    }
    if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('network'))) {
      throw new ApiError(
        'Cannot connect to the server. Please make sure the backend is running on ' + API_URL,
        'CONNECTION_ERROR',
        0
      );
    }
    throw new ApiError(
      'Cannot connect to the server. Please check your network connection and make sure the backend is running.',
      'NETWORK_ERROR',
      0
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Request failed (${response.status})`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // response body is not JSON
    }
    throw new ApiError(errorMessage, 'API_ERROR', response.status);
  }
  return response.json();
}

export const apiClient = {
  async checkHealth() {
    const response = await fetchWithTimeout(`${API_URL}/health`, {}, 5000);
    return handleResponse(response);
  },

  async uploadAudio(file: File, originalLyrics?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (originalLyrics) {
      formData.append('originalLyrics', originalLyrics);
    }

    const response = await fetchWithTimeout(
      `${API_URL}/api/upload`,
      { method: 'POST', body: formData },
      60000
    );
    return handleResponse<{
      uploadId: string;
      fileName: string;
      fileId: string;
      duration: number;
      size: number;
      mimeType: string;
      uploadedAt: string;
      status: string;
    }>(response);
  },

  async generateLyrics(originalLyrics: string, context?: string) {
    const response = await fetchWithTimeout(
      `${API_URL}/api/lyrics/generate`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalLyrics, context: context || '' }),
      },
      60000
    );
    return handleResponse<{
      success: boolean;
      originalLyrics: string;
      generatedLyrics: string;
      sentiment: Record<string, unknown>;
      generatedAt: string;
    }>(response);
  },

  async processAudio(uploadId: string, payload: {
    originalLyrics: string;
    newLyrics: string;
    voiceStyle?: string;
  }) {
    const response = await fetchWithTimeout(
      `${API_URL}/api/process/${uploadId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      60000
    );
    return handleResponse<{
      processId: string;
      uploadId: string;
      status: string;
      progress: number;
      message: string;
    }>(response);
  },

  async getStatus(processId: string) {
    const response = await fetchWithTimeout(`${API_URL}/api/process/${processId}`);
    return handleResponse<{
      processId: string;
      status: string;
      progress: number;
      resultUrl?: string;
    }>(response);
  },

  async pollUntilComplete(processId: string, maxAttempts = 60) {
    for (let i = 0; i < maxAttempts; i++) {
      const status = await this.getStatus(processId);
      if (status.status === 'completed' || status.status === 'failed') {
        return status;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    throw new ApiError('Processing timed out. Please try again.', 'POLL_TIMEOUT', 408);
  },

  getDownloadUrl(resultId: string) {
    return `${API_URL}/api/download/${resultId}`;
  },

  async synthesizeVoice(text: string, voiceId?: string) {
    const response = await fetchWithTimeout(
      `${API_URL}/api/voice/synthesize`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId: voiceId || undefined }),
      },
      60000
    );
    return handleResponse<{
      success: boolean;
      audioFile: string;
      audioPath: string;
      textLength: number;
      synthesizedAt: string;
    }>(response);
  },

  async getAvailableVoices() {
    const response = await fetchWithTimeout(`${API_URL}/api/voice/list`);
    return handleResponse<{
      success: boolean;
      voices: Array<{ voice_id: string; name: string }>;
      count: number;
    }>(response);
  },
};
