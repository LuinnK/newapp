'use client';

import { useState } from 'react';
import { Wand2, Copy, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUploadStore } from '@/lib/store';
import { apiClient } from '@/lib/api-client';

export default function LyricEditorComponent() {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const {
    originalLyrics,
    newLyrics,
    voiceStyle,
    setOriginalLyrics,
    setNewLyrics,
    setVoiceStyle,
  } = useUploadStore();

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleGenerateLyrics = async () => {
    if (!originalLyrics.trim()) {
      toast.error('Please enter original lyrics first');
      return;
    }

    try {
      setIsGenerating(true);
      const loadingToast = toast.loading('Generating new lyrics with AI...');

      const response = await apiClient.generateLyrics(originalLyrics, voiceStyle);
      
      setNewLyrics(response.generatedLyrics);
      
      toast.dismiss(loadingToast);
      toast.success('✅ Lyrics generated successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate lyrics';
      console.error('Generate error:', err);
      toast.error('❌ ' + message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Original Lyrics */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Original Lyrics</label>
        <textarea
          value={originalLyrics}
          onChange={(e) => setOriginalLyrics(e.target.value)}
          placeholder="Paste the original song lyrics here..."
          className="w-full h-32 p-4 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        />
        {originalLyrics && (
          <button
            onClick={() => handleCopy(originalLyrics)}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-300 mt-2"
          >
            <Copy className="w-4 h-4" />
            Copy
          </button>
        )}
      </div>

      {/* Voice Style Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold">Voice Style</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['default', 'bold', 'soft', 'rap'].map((style) => (
            <button
              key={style}
              onClick={() => setVoiceStyle(style)}
              className={`
                p-3 rounded-lg font-medium transition capitalize
                ${voiceStyle === style
                  ? 'bg-purple-600 text-white border border-purple-500'
                  : 'bg-slate-900/50 text-slate-300 border border-slate-700 hover:border-purple-500/50'
                }
              `}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerateLyrics}
        disabled={isGenerating || !originalLyrics.trim()}
        className={`
          w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2
          transition duration-200
          ${isGenerating || !originalLyrics.trim()
            ? 'bg-purple-600/50 text-purple-200 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
          }
        `}
      >
        {isGenerating ? (
          <>
            <div className="w-5 h-5 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            Generate New Lyrics with AI
          </>
        )}
      </button>

      {/* Generated Lyrics */}
      {newLyrics && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="block text-sm font-semibold">Generated Lyrics</label>
            <CheckCircle className="w-4 h-4 text-green-400" />
          </div>
          <textarea
            value={newLyrics}
            onChange={(e) => setNewLyrics(e.target.value)}
            placeholder="AI-generated lyrics will appear here..."
            className="w-full h-32 p-4 rounded-lg bg-slate-900/50 border border-green-500/30 text-white placeholder-slate-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
          />
          <button
            onClick={() => handleCopy(newLyrics)}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-300"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
}
