'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle, Loader, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUploadStore } from '@/lib/store';
import { apiClient } from '@/lib/api-client';

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

  const MAX_FILE_SIZE = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760');
  const MIN_DURATION = 5;
  const MAX_DURATION = 9;

  useEffect(() => {
    return () => {
      if (audioPreview) {
        URL.revokeObjectURL(audioPreview);
      }
    };
  }, [audioPreview]);

  const resetInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = async (file: File) => {
    setError(null);

    if (!file.type.includes('audio')) {
      setError('❌ Please select an audio file (MP3, WAV, etc.)');
      resetInput();
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`❌ File too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`);
      resetInput();
      return;
    }

    try {
      setIsLoading(true);
      setFileName(file.name);

      const url = URL.createObjectURL(file);

      const selectedDuration = await new Promise<number>((resolve, reject) => {
        const audio = new Audio();
        audio.preload = 'metadata';
        audio.onloadedmetadata = () => resolve(audio.duration);
        audio.onerror = () => reject(new Error('Could not read audio metadata'));
        audio.src = url;
      });

      if (selectedDuration < MIN_DURATION || selectedDuration > MAX_DURATION) {
        URL.revokeObjectURL(url);
        setDuration(selectedDuration);
        setError(`❌ Audio must be ${MIN_DURATION}-${MAX_DURATION} seconds long`);
        resetInput();
        return;
      }

      setAudioPreview((previousUrl) => {
        if (previousUrl) {
          URL.revokeObjectURL(previousUrl);
        }
        return url;
      });
      setDuration(selectedDuration);

      const response = await apiClient.uploadAudio(file);

      if (response.uploadId) {
        setUploadId(response.uploadId);
        toast.success('✅ File uploaded successfully!');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
      toast.error('❌ ' + message);
      resetInput();
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
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Upload Zone */}
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
          accept="audio/*"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="hidden"
          disabled={isLoading}
        />

        <div className="space-y-3">
          {isLoading ? (
            <>
              <Loader className="w-12 h-12 mx-auto text-purple-400 animate-spin" />
              <p className="text-lg font-semibold">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 mx-auto text-purple-400" />
              <div>
                <p className="text-lg font-semibold">Drag & drop your music</p>
                <p className="text-sm text-slate-400">or click to browse</p>
              </div>
              <p className="text-xs text-slate-500">
                Supports MP3, WAV, FLAC ({MIN_DURATION}-{MAX_DURATION}s, max {MAX_FILE_SIZE / 1024 / 1024}MB)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      {/* File Info */}
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

            {/* Audio Player */}
            {audioPreview && (
              <audio
                src={audioPreview}
                controls
                className="w-full mt-3 bg-slate-900/50 rounded"
              />
            )}
          </div>

          {/* Next Steps */}
          {duration && duration >= MIN_DURATION && duration <= MAX_DURATION && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-sm text-green-200">
                ✅ Perfect! Your audio is within the {MIN_DURATION}-{MAX_DURATION} second range.
              </p>
            </div>
          )}

          {duration && (duration < MIN_DURATION || duration > MAX_DURATION) && (
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <p className="text-sm text-yellow-200">
                ⚠️ Your audio must be {MIN_DURATION}-{MAX_DURATION} seconds before upload.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
