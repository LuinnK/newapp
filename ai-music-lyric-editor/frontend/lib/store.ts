import { create } from 'zustand';

interface UploadState {
  uploadId: string | null;
  fileName: string | null;
  duration: number | null;
  originalLyrics: string;
  newLyrics: string;
  voiceStyle: string;
  isLoading: boolean;
  error: string | null;

  setUploadId: (id: string) => void;
  setFileName: (name: string) => void;
  setDuration: (duration: number) => void;
  setOriginalLyrics: (lyrics: string) => void;
  setNewLyrics: (lyrics: string) => void;
  setVoiceStyle: (style: string) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  uploadId: null,
  fileName: null,
  duration: null,
  originalLyrics: '',
  newLyrics: '',
  voiceStyle: 'default',
  isLoading: false,
  error: null,

  setUploadId: (id) => set({ uploadId: id }),
  setFileName: (name) => set({ fileName: name }),
  setDuration: (duration) => set({ duration }),
  setOriginalLyrics: (lyrics) => set({ originalLyrics: lyrics }),
  setNewLyrics: (lyrics) => set({ newLyrics: lyrics }),
  setVoiceStyle: (style) => set({ voiceStyle: style }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () => set({
    uploadId: null,
    fileName: null,
    duration: null,
    originalLyrics: '',
    newLyrics: '',
    voiceStyle: 'default',
    isLoading: false,
    error: null,
  }),
}));
