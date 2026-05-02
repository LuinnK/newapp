'use client';

import { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUploadStore } from '@/lib/store';
import { apiClient } from '@/lib/api-client';

const MAX_FILE_SIZE = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760');
const ALLOWED_TYPES = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/flac', 'audio/ogg', 'audio/x-m4a', 'audio/mp4', 'audio/aac'];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function UploadComponent() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [audioPreview, setAudioPreview] = useState<string>('');

  const {
    fileName,
    duration,
    isLoading,
    error,
    setFileName,
    setDuration,
    setUploadId,
    setIsLoading,
    setError,
  } = useUploadStore();

  const validateFile = (file: File): string | null => {
    if (!file.type.includes('audio') && !ALLOWED_TYPES.includes(file.type)) {
      return 'Please select an audio file (MP3, WAV, M4A, FLAC, etc.)';
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large (${formatFileSize(file.size)}). Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`;
    }
    if (file.size === 0) {
      return 'File is empty. Please select a valid audio file.';
    }
    return null;
  };

  const handleFileSelect = async (file: File) => {
    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      setIsLoading(true);
      setFileName(file.name);

      const url = URL.createObjectURL(file);
      setAudioPreview(url);

      const audio = new Audio();
      audio.src = url;
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };

      const response = await apiClient.uploadAudio(file);

      if (response.uploadId) {
        setUploadId(response.uploadId);
        toast.success('File uploaded successfully!');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={handleClick}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition duration-200
          ${isDragOver
            ? 'border-purple-400 bg-purple-500/10'
            : 'border-purple-500/30 bg-purple-500/5'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,.mp3,.wav,.m4a,.flac,.ogg,.aac"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="hidden"
          disabled={isLoading}
        />

        <div className="space-y-3">
          {isLoading ? (
            <>
              <Loader className="w-12 h-12 mx-auto text-purple-400 animate-spin" />
              <p className="text-lg font-semibold">Uploading...</p>
              <p className="text-sm text-slate-400">Please wait</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 mx-auto text-purple-400" />
              <div>
                <p className="text-lg font-semibold">Drag & drop your music</p>
                <p className="text-sm text-slate-400">or click to browse</p>
              </div>
              <p className="text-xs text-slate-500">
                Supports MP3, WAV, M4A, FLAC, AAC (max {formatFileSize(MAX_FILE_SIZE)})
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      {fileName && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div className="flex-1">
                <p className="font-semibold">{fileName}</p>
                {duration && (
                  <p className="text-sm text-slate-400">
                    Duration: {Math.floor(duration)}s
                  </p>
                )}
              </div>
            </div>

            {audioPreview && (
              <audio
                src={audioPreview}
                controls
                className="w-full mt-3 bg-slate-900/50 rounded"
              />
            )}
          </div>

          {duration !== null && duration <= 9 && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-sm text-green-200">
                Perfect! Your audio is within the 5-9 second range.
              </p>
            </div>
          )}

          {duration !== null && duration > 9 && (
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <p className="text-sm text-yellow-200">
                Your audio is longer than recommended (9s). It may still work, but shorter clips produce better results.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
