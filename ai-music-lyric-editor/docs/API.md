# API Documentation

## Base URL
- Development: `http://localhost:5000`
- Production: `https://api.musiclyriceditor.com`

## Endpoints

### 1. Health Check
```
GET /health
```
**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-04-29T10:00:00Z",
  "service": "AI Music Lyric Editor Backend"
}
```

### 2. Upload Audio File (Coming Soon)
```
POST /api/upload
Content-Type: multipart/form-data

Parameters:
- file: MP3 file (required, max 10MB)
- originalLyrics: string (optional, extracted from metadata if not provided)
```

**Response:**
```json
{
  "uploadId": "uuid",
  "fileName": "song.mp3",
  "duration": 8.5,
  "status": "processing",
  "createdAt": "2024-04-29T10:00:00Z"
}
```

### 3. Process Audio (Coming Soon)
```
POST /api/process/:uploadId
Content-Type: application/json

{
  "originalLyrics": "Your song lyrics here",
  "newLyrics": "Edited lyrics here",
  "voiceStyle": "bold" | "soft" | "rap" | "default"
}
```

**Response:**
```json
{
  "processId": "uuid",
  "uploadId": "uuid",
  "status": "processing",
  "progress": 0,
  "steps": [
    {
      "name": "vocal_extraction",
      "status": "pending",
      "progress": 0
    },
    {
      "name": "lyric_generation",
      "status": "pending",
      "progress": 0
    },
    {
      "name": "voice_synthesis",
      "status": "pending",
      "progress": 0
    },
    {
      "name": "audio_mixing",
      "status": "pending",
      "progress": 0
    }
  ]
}
```

### 4. Get Processing Status (Coming Soon)
```
GET /api/process/:processId
```

**Response:**
```json
{
  "processId": "uuid",
  "status": "completed",
  "progress": 100,
  "resultUrl": "/api/download/result-uuid.mp3",
  "completedAt": "2024-04-29T10:05:00Z"
}
```

### 5. Download Result (Coming Soon)
```
GET /api/download/:resultId
```

**Response:**
Audio file (MP3)

## Error Responses

```json
{
  "error": "Error message description",
  "status": 400,
  "errorCode": "INVALID_FILE_SIZE"
}
```

## Error Codes
- `INVALID_FILE_SIZE` - File exceeds 10MB limit
- `INVALID_FILE_FORMAT` - File is not MP3
- `UPLOAD_FAILED` - Server error during upload
- `PROCESSING_FAILED` - Error during audio processing
- `INVALID_API_KEY` - Missing or invalid API key
- `RATE_LIMIT_EXCEEDED` - Too many requests

## Rate Limiting

- 10 requests per minute per IP
- 100 requests per hour per user

## Authentication (Coming Soon)

Add API key to header:
```
Authorization: Bearer your-api-key
```
