# Setup & Installation Guide

## Prerequisites

Before starting, make sure you have:

- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **FFmpeg** ([Download](https://ffmpeg.org/download.html))
- **Git** ([Download](https://git-scm.com/))

## Step 1: Clone Repository

```bash
cd f:\appnew
cd ai-music-lyric-editor
```

## Step 2: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
copy .env.example .env

# Edit .env with your API keys
notepad .env
```

### Get API Keys

1. **OpenAI API Key**
   - Go to https://platform.openai.com/api-keys
   - Create new API key
   - Copy and paste in `.env`

2. **ElevenLabs API Key**
   - Go to https://elevenlabs.io/
   - Sign up / Login
   - Get API key from account settings
   - Get Voice ID from your profile

3. **Supabase (Optional for MVP)**
   - Go to https://supabase.com/
   - Create new project
   - Get `SUPABASE_URL` and `SUPABASE_KEY`

### Start Backend

```bash
npm run dev
```

Expected output:
```
🎵 Backend running on http://localhost:5000
Environment: development
```

## Step 3: Setup Frontend

In a **new terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Copy environment template
copy .env.local.example .env.local

# Start dev server
npm run dev
```

Expected output:
```
▲ Next.js 14.0.0
- Local:        http://localhost:3000
- Environments: .env.local
```

## Step 4: Access Application

Open your browser and go to:
```
http://localhost:3000
```

You should see the landing page! 🎉

## Verify Installation

### Check Backend
```bash
curl http://localhost:5000/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "...",
  "service": "AI Music Lyric Editor Backend"
}
```

### Check Frontend
- Homepage loads at http://localhost:3000
- No errors in browser console

## Troubleshooting

### FFmpeg not found
```bash
# Windows - Install via Chocolatey
choco install ffmpeg

# Or download from https://ffmpeg.org/download.html
```

### Port already in use
```bash
# Backend using different port
set PORT=5001 && npm run dev

# Frontend using different port
npm run dev -- -p 3001
```

### Node modules issues
```bash
# Clear cache and reinstall
rm -r node_modules
rm package-lock.json
npm install
```

### API key errors
- Double-check keys in `.env` files
- No extra spaces or quotes
- Ensure keys are valid (test in API dashboards)

## Next Steps

1. ✅ Backend and Frontend running
2. 📝 Next: Build upload component
3. 🎵 Then: Implement audio processing
4. 🤖 Then: Integrate AI services

See [Phase 1 Checklist](../README.md#phase-1-checklist) for more!
