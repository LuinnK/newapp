'use client';

import { useState } from 'react';
import { Music, ArrowRight } from 'lucide-react';
import UploadComponent from '@/components/UploadComponent';
import LyricEditorComponent from '@/components/LyricEditorComponent';
import { useUploadStore } from '@/lib/store';

export default function Home() {
  const [step, setStep] = useState<'home' | 'upload' | 'edit' | 'process'>('home');
  const { uploadId } = useUploadStore();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-purple-500/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => setStep('home')}
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <Music className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Music Lyric Editor
            </span>
          </button>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className={step !== 'home' ? 'text-purple-400' : ''}>1. Upload</span>
            <span>•</span>
            <span className={step === 'edit' || step === 'process' ? 'text-purple-400' : ''}>2. Edit</span>
            <span>•</span>
            <span className={step === 'process' ? 'text-purple-400' : ''}>3. Process</span>
          </div>
        </div>
      </nav>

      {/* Home Screen */}
      {step === 'home' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Rewrite Your Music <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Keep the Original Voice
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Change lyrics in seconds using AI while keeping the original vocals intact.
            Perfect for covers, remixes, and creative experiments.
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { icon: '⚡', title: 'Lightning Fast', desc: 'Process in seconds' },
              { icon: '🤖', title: 'AI Powered', desc: 'GPT-4 generation' },
              { icon: '🎤', title: 'Voice Cloning', desc: 'Premium quality' },
              { icon: '⬇️', title: 'Easy Export', desc: 'Download as MP3' },
            ].map((feature, i) => (
              <div key={i} className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 backdrop-blur hover:border-purple-500/50 transition">
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => setStep('upload')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition inline-flex items-center gap-2"
          >
            Launch App <ArrowRight className="w-5 h-5" />
          </button>
        </section>
      )}

      {/* Upload Screen */}
      {step === 'upload' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Step 1: Upload Your Music</h2>
            <p className="text-slate-400">Upload a 5-9 second audio file to get started</p>
          </div>
          
          <UploadComponent />

          {uploadId && (
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setStep('edit')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition"
              >
                Continue to Edit →
              </button>
              <button
                onClick={() => setStep('upload')}
                className="px-6 py-3 bg-slate-900/50 rounded-lg text-white font-semibold border border-slate-700 hover:border-slate-600 transition"
              >
                Upload Another File
              </button>
            </div>
          )}
        </section>
      )}

      {/* Edit Screen */}
      {step === 'edit' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Step 2: Edit Lyrics & Choose Voice</h2>
            <p className="text-slate-400">Generate new lyrics with AI or edit manually</p>
          </div>

          <LyricEditorComponent />

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => setStep('process')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition"
            >
              Process Audio →
            </button>
            <button
              onClick={() => setStep('upload')}
              className="px-6 py-3 bg-slate-900/50 rounded-lg text-white font-semibold border border-slate-700 hover:border-slate-600 transition"
            >
              Back to Upload
            </button>
          </div>
        </section>
      )}

      {/* Process Screen */}
      {step === 'process' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/50 mb-6">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-pink-500 rounded-full animate-spin" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Processing Your Audio...</h2>
          <p className="text-slate-400 mb-8">
            This usually takes 30-60 seconds. Don't close this window.
          </p>

          <div className="max-w-md mx-auto bg-slate-900/50 rounded-lg border border-slate-700 p-6 text-left space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm">Extracting vocals</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-sm">Generating speech</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-slate-500" />
              <span className="text-sm">Mixing audio</span>
            </div>
          </div>

          <button
            onClick={() => setStep('home')}
            className="mt-8 px-6 py-3 bg-slate-900/50 rounded-lg text-white font-semibold border border-slate-700 hover:border-slate-600 transition"
          >
            Back to Home
          </button>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-purple-500/20 mt-20 py-8 text-center text-slate-400">
        <p>🎵 AI Music Lyric Editor • Phase 1 MVP</p>
      </footer>
    </main>
  );
}
