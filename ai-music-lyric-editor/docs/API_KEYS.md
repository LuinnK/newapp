# 🔑 API Keys Setup Guide

## 1️⃣ OpenAI API Key

### Get Your Key:
1. Go to https://platform.openai.com/api-keys
2. Click **"Create new secret key"**
3. Name it: `AI Music Lyric Editor`
4. Copy the key

### Important:
- Save it somewhere safe (you can only see it once!)
- Free tier includes $5 credit
- Pricing: ~$0.03 per 1K tokens for GPT-4

### Update .env:
```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxx
```

---

## 2️⃣ ElevenLabs API Key

### Get Your Key:
1. Go to https://elevenlabs.io/
2. Click **Sign Up** (free account)
3. Go to **Settings** → **API Keys**
4. Copy your API key
5. Go to **Voices** to find a `VOICE_ID` you like

### Find Voice ID:
- https://elevenlabs.io/app/voices
- Click any voice and copy its ID
- Example: `21m00Tcm4TlvDq8ikWAM` (Rachel)

### Pricing:
- Free tier: 10,000 characters/month
- Paid: $5-99/month depending on usage

### Update .env:
```
ELEVENLABS_API_KEY=xxxxxxxxxxxxxe1xfxxx
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

---

## 3️⃣ Supabase (Optional for MVP)

If you want database storage:
1. Go to https://supabase.com/
2. Click **Start your project**
3. Create account
4. Create new project
5. Get keys from **Settings** → **API**

### Update .env:
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhb...
```

---

## ✅ Verify Your Keys

### Test Backend with health check:
```bash
curl http://localhost:5000/health
```

Should return:
```json
{"status":"ok","timestamp":"...","service":"..."}
```

---

## 🚨 IMPORTANT SECURITY TIPS

✅ **DO:**
- Add `.env` to `.gitignore` (already done)
- Rotate keys regularly
- Use separate keys for dev/production
- Delete unused keys

❌ **DON'T:**
- Commit `.env` files to Git
- Share keys with anyone
- Use the same key for multiple projects
- Post keys in public GitHub issues

---

## 🔧 Using the Keys

Once you add your keys to `.env`, the backend can:
1. ✅ Generate lyrics with GPT-4
2. ✅ Synthesize speech with voice cloning
3. ✅ Store/retrieve files (if using Supabase)

**Next Step:** Start the servers! 🚀
