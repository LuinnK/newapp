# 🎵 AI Music Lyric Editor

Edit your song lyrics while keeping the original voice & background music intact. Powered by AI.

## 🎯 Features (MVP)
- Upload MP3 files (5-9s)
- Extract vocals from music
- AI-powered lyric generation/rewriting
- Voice cloning with ElevenLabs
- Mix new vocals with original background
- Download results

## 🛠️ Tech Stack
- **Frontend**: Next.js 14 + React + Tailwind CSS
- **Backend**: Node.js + Express
- **Audio Processing**: FFmpeg + Web Audio API
- **AI Services**: OpenAI GPT-4 + ElevenLabs
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (Frontend) + Railway (Backend)

## 📁 Project Structure
```
ai-music-lyric-editor/
├── frontend/          # Next.js app
├── backend/           # Node.js Express server
├── docs/              # Documentation
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- API Keys: OpenAI, ElevenLabs

### Installation

1. **Clone repo**
```bash
cd ai-music-lyric-editor
```

2. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:3000
```

3. **Backend Setup**
```bash
cd ../backend
npm install
cp .env.example .env
# Add your API keys to .env
npm run dev
# Server runs on http://localhost:5000
```

## 🔑 Environment Variables

### Backend (.env)
```
OPENAI_API_KEY=your_key
ELEVENLABS_API_KEY=your_key
ELEVENLABS_VOICE_ID=your_voice_id
DATABASE_URL=your_supabase_url
NODE_ENV=development
PORT=5000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=AI Music Lyric Editor
```

## 📋 Phase 1 Checklist
- [ ] Setup project structure ✅
- [ ] Create frontend with Next.js
- [ ] Create backend with Express
- [ ] Setup Supabase project
- [ ] Get API keys (OpenAI, ElevenLabs)
- [ ] Create basic UI mockup
- [ ] Research audio processing

## 📚 Documentation
See `docs/` folder for detailed guides:
- Architecture overview
- API documentation
- Audio processing pipeline
- Deployment guide

## 📞 Support
Questions? Check docs or create an issue!

## 📄 License
MIT
