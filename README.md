# Fyvio Unified - Movie & Series Streaming Platform

A unified deployment of the Fyvio frontend and backend for seamless deployment on Render.

## Features

- **Frontend**: React-based streaming platform with movie/series browsing, search, and viewing
- **Backend**: FastAPI server with Telegram integration for media streaming
- **Database**: MongoDB integration for media metadata
- **Authentication**: Firebase Auth integration
- **Unified Deployment**: Single Docker service for both frontend and backend

## Architecture

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: FastAPI + Python
- **Database**: MongoDB (via motor)
- **Storage**: Telegram Bot API for media streaming
- **Authentication**: Firebase Auth
- **Deployment**: Docker container for Render

## Prerequisites

Before deploying to Render, ensure you have:

1. **Telegram Bot Credentials**:
   - Bot Token from [@BotFather](https://t.me/BotFather)
   - API ID and Hash from [my.telegram.org](https://my.telegram.org)
   - Authorization Channel ID

2. **Database**: MongoDB connection string

3. **API Keys**:
   - TMDB API key for movie/series data
   - IMDB API key (optional)

4. **Firebase Project**: For authentication

## Deployment to Render

### Option 1: Render Web Service (Recommended)

1. **Create a new Web Service** on [Render](https://render.com)

2. **Connect your repository** or upload the code directly

3. **Configure Build Settings**:
   - **Build Command**: `pip install -r requirements.txt && cd frontend && npm install && npm run build`
   - **Start Command**: `uvicorn backend.fastapi.main:app --host 0.0.0.0 --port $PORT`

4. **Set Environment Variables** in Render Dashboard:
   ```bash
   API_ID=your_telegram_api_id
   API_HASH=your_telegram_api_hash
   BOT_TOKEN=your_bot_token
   AUTH_CHANNEL=your_auth_channel_id
   DATABASE=your_mongodb_connection_string
   TMDB_API=your_tmdb_api_key
   IMDB_API=your_imdb_api_key
   PORT=8000
   NODE_ENV=production
   ```

5. **Deploy**: Render will automatically build and deploy your service

### Option 2: Docker Deployment

1. **Build the Docker image**:
   ```bash
   docker build -t fyvio-unified .
   ```

2. **Run the container**:
   ```bash
   docker run -p 8000:8000 \
     -e API_ID=your_api_id \
     -e API_HASH=your_api_hash \
     -e BOT_TOKEN=your_bot_token \
     -e DATABASE=your_db_string \
     -e TMDB_API=your_tmdb_key \
     fyvio-unified
   ```

## Local Development

1. **Install dependencies**:
   ```bash
   # Install all dependencies
   npm run install-all
   
   # Or install separately
   cd frontend && npm install
   pip install -r requirements.txt
   ```

2. **Set up environment**:
   ```bash
   cp config.env.example config.env
   # Edit config.env with your credentials
   ```

3. **Build frontend**:
   ```bash
   npm run build-frontend
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

## API Endpoints

### Public Endpoints
- `GET /` - Server status and bot workload
- `GET /app` - Frontend application
- `GET /api/movies` - Get movies with sorting and pagination
- `GET /api/tvshows` - Get TV shows with sorting and pagination
- `GET /api/search/` - Search movies and TV shows
- `GET /api/id/{tmdb_id}` - Get specific media details
- `GET /api/similar/` - Get similar media
- `GET /dl/{id}/{name}` - Stream media files
- `GET /watch/{tmdb_id}` - Watch page for movies/episodes

### Protected Endpoints
- `GET /is_member` - Check if user is member of auth channel

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `API_ID` | Telegram API ID | Yes |
| `API_HASH` | Telegram API Hash | Yes |
| `BOT_TOKEN` | Telegram Bot Token | Yes |
| `AUTH_CHANNEL` | Authorization Channel ID(s) | Yes |
| `DATABASE` | MongoDB Connection String | Yes |
| `TMDB_API` | TMDB API Key | Yes |
| `IMDB_API` | IMDB API Key | No |
| `PORT` | Server Port | No (default: 8000) |
| `BASE_URL` | Base URL for the service | No |

### Firebase Configuration

Update `frontend/src/firebase.jsx` with your Firebase project credentials:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

## Project Structure

```
fyvio-unified/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   └── assets/         # Static assets
│   ├── public/             # Public assets
│   └── package.json        # Frontend dependencies
├── backend/                 # FastAPI backend
│   ├── fastapi/
│   │   ├── main.py         # Main application
│   │   └── templates/      # HTML templates
│   ├── helper/             # Helper modules
│   ├── pyrofork/           # Telegram integration
│   └── config.py           # Configuration
├── static/                 # Built frontend files (generated)
├── requirements.txt        # Python dependencies
├── package.json           # Root package.json
├── Dockerfile             # Docker configuration
└── config.env             # Environment configuration
```

## Troubleshooting

### Common Issues

1. **Frontend not loading**:
   - Ensure `npm run build-frontend` completed successfully
   - Check that static files are in the `static/` directory
   - Verify the base URL configuration in Vite

2. **API endpoints returning 404**:
   - Ensure the backend is running on the correct port
   - Check that the frontend is making requests to the correct API base URL

3. **Telegram streaming issues**:
   - Verify bot token and API credentials
   - Ensure the bot has access to the media files
   - Check channel authorization settings

4. **Database connection issues**:
   - Verify MongoDB connection string
   - Ensure database is accessible from Render

### Logs

Check Render logs for detailed error messages:
- Build logs: Show compilation errors
- Runtime logs: Show application errors
- Access logs: Show HTTP request details

## Support

For issues and questions:
1. Check the logs first
2. Verify all environment variables are set correctly
3. Ensure all required services (MongoDB, Telegram Bot) are properly configured
4. Check the GitHub issues page for known problems

## License

MIT License - see LICENSE file for details