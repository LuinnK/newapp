# 🔑 Hướng Dẫn Lấy API Keys (Chi Tiết)

## ✅ OpenAI API Key

### Lấy Key:
1. Vào https://platform.openai.com/api-keys
2. Đăng nhập hoặc tạo tài khoản (dùng Gmail được)
3. Click **"Create new secret key"**
4. Đặt tên: `AI Music Lyric Editor`
5. Copy key (chỉ hiện 1 lần!)

### Ví Dụ Key:
```
sk-proj-1a2b3c4d5e6f7g8h9i0j...
```

### Add vào .env:
```bash
# backend/.env
OPENAI_API_KEY=sk-proj-1a2b3c4d5e6f7g8h9i0j...
```

### Kiểm Tra:
```bash
# Sẽ gọi OpenAI API khi bạn click "Generate Lyrics"
```

---

## ✅ ElevenLabs API Key + Voice ID

### Lấy API Key:
1. Vào https://elevenlabs.io/
2. Click **"Sign Up"** (miễn phí)
3. Verify email
4. Vào **Settings** → **API Keys**
5. Copy API key

### Ví Dụ Key:
```
xxxxxxxxxxxxxe1xfxxx1234567890abcdef
```

### Lấy Voice ID:
1. Vào **Voices** → chọn voice nào đó
2. Click vào voice, copy **Voice ID**

### Ví Dụ Voice IDs (sẵn có):
```
21m00Tcm4TlvDq8ikWAM - Rachel (nữ, tự nhiên)
EXAVITQu4EsNXj1Z0GrH - Premm (nam, tự nhiên)
MF3mGyEYCHltNiPm4XZb - Elli (nữ trẻ)
TxGEqnHWrfWFTfGW9XjX - Josh (nam)
```

### Add vào .env:
```bash
# backend/.env
ELEVENLABS_API_KEY=xxxxxxxxxxxxxe1xfxxx...
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

---

## 📝 Demo .env File (đã setup)

```bash
# backend/.env

# OpenAI - LẤY TỪ https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE

# ElevenLabs - LẤY TỪ https://elevenlabs.io/
ELEVENLABS_API_KEY=your_key_here
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM

# Server
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

---

## ⏱️ Thời Gian:
- OpenAI: 2-3 phút
- ElevenLabs: 2-3 phút
- Total: 5 phút ✅

---

## ⚠️ IMPORTANT - SECURITY

❌ **KHÔNG**:
- Commit `.env` lên GitHub (đã có .gitignore)
- Share keys với ai
- Dùng key cùng cho production

✅ **LÀM**:
- Giữ key ở chỗ an toàn
- Rotate key định kỳ
- Dùng environment variables
