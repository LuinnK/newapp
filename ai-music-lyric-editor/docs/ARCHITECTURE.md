# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                      │
│  - Upload UI                                                 │
│  - Audio Player & Visualizer                                 │
│  - Lyric Editor                                              │
│  - Results Display                                           │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/REST
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                Backend (Node.js + Express)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Upload Handler (Multer)                             │   │
│  └──────────────┬───────────────────────────────────────┘   │
│                 │                                             │
│  ┌──────────────▼───────────────────────────────────────┐   │
│  │  Audio Processing Pipeline                           │   │
│  │  - Vocal Extraction (FFmpeg + Spleeter)             │   │
│  │  - Background Isolation                             │   │
│  └──────────────┬───────────────────────────────────────┘   │
│                 │                                             │
│  ┌──────────────▼───────────────────────────────────────┐   │
│  │  AI Processing                                       │   │
│  │  - Lyric Generation (OpenAI GPT-4)                  │   │
│  │  - Sentiment Analysis                               │   │
│  └──────────────┬───────────────────────────────────────┘   │
│                 │                                             │
│  ┌──────────────▼───────────────────────────────────────┐   │
│  │  Voice Synthesis                                     │   │
│  │  - Text-to-Speech (ElevenLabs)                      │   │
│  │  - Voice Cloning                                     │   │
│  └──────────────┬───────────────────────────────────────┘   │
│                 │                                             │
│  ┌──────────────▼───────────────────────────────────────┐   │
│  │  Audio Mixing                                        │   │
│  │  - Combine new vocals + background                   │   │
│  │  - Normalize levels                                  │   │
│  └──────────────┬───────────────────────────────────────┘   │
│                 │                                             │
└─────────────────┼───────────────────────────────────────────┘
                  │ File Storage / API
                  ▼
        ┌──────────────────────┐
        │   External Services  │
        │ - OpenAI (GPT-4)     │
        │ - ElevenLabs (TTS)   │
        │ - Supabase (DB)      │
        └──────────────────────┘
```

## Data Flow

1. **Upload**: User uploads MP3 file (5-9s max)
2. **Extract**: Backend extracts vocals using FFmpeg + AI
3. **Generate**: OpenAI generates new lyrics based on original
4. **Synthesize**: ElevenLabs generates vocals with cloned voice
5. **Mix**: Combine new vocals with original background
6. **Download**: User downloads final MP3

## Technology Choices

| Component | Technology | Why |
|-----------|-----------|-----|
| Frontend Framework | Next.js 14 | SSR, built-in API, Vercel deploy |
| Backend Framework | Express.js | Lightweight, async-friendly |
| Audio Processing | FFmpeg | Industry standard, powerful |
| Vocal Extraction | Spleeter | High-quality source separation |
| LLM | OpenAI GPT-4 | Best lyric generation quality |
| Voice AI | ElevenLabs | Best voice cloning available |
| Database | Supabase | PostgreSQL + free tier |
| Real-time | WebSockets | For long processing updates |

## Key Components

### Frontend
- `components/Upload.tsx` - File upload form
- `components/Editor.tsx` - Lyric editor interface
- `components/Player.tsx` - Audio player with visualizer
- `hooks/useAudioUpload.ts` - Upload logic
- `services/api.ts` - API client

### Backend
- `routes/upload.js` - File upload handler
- `routes/process.js` - Audio processing pipeline
- `services/audio.js` - FFmpeg wrapper
- `services/openai.js` - GPT-4 integration
- `services/elevenlabs.js` - Voice synthesis
- `utils/mixer.js` - Audio mixing

## Security Considerations

- ✅ File size limits (10MB max)
- ✅ Virus scanning for uploads
- ✅ Rate limiting on API endpoints
- ✅ API key encryption
- ✅ CORS enabled only for frontend
- ✅ Input validation & sanitization

## Performance Optimization

- 🚀 Parallel processing of audio tracks
- 🚀 Caching of generated audio
- 🚀 Streaming responses for large files
- 🚀 CDN for static assets
- 🚀 Database indexing for queries
