# Nyaya - Backend Setup Guide

## Quick Start

Your Nyaya project now has a fully functional backend! Here's how to get started:

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Start the Backend Server

```bash
# Development mode (auto-reload)
npm run dev

# OR Production mode
npm start
```

The backend will start at: **http://localhost:3001**

### 3. Test the Backend

Open your browser or use curl:
```bash
curl http://localhost:3001/api/health
```

You should see:
```json
{
  "status": "ok",
  "message": "Nyaya backend is running"
}
```

### 4. Run the Frontend

In a new terminal:
```bash
# From project root
npm run dev
```

The frontend will start at: **http://localhost:5173**

## Backend Features

✅ **Posts API** - Create, read, like, and comment on posts
✅ **Communities API** - Join/leave communities, browse available communities
✅ **Secure Forum API** - Password-protected posts for sensitive information
✅ **User Profiles API** - User management and profile tracking
✅ **SQLite Database** - Lightweight data persistence
✅ **CORS Enabled** - Ready for frontend integration

## API Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/posts` | Get all posts |
| POST | `/api/posts` | Create a new post |
| GET | `/api/communities` | Get all communities |
| POST | `/api/communities/:id/join` | Join a community |
| GET | `/api/secure-forum` | Get secure posts |
| POST | `/api/secure-forum` | Create secure post |
| GET | `/api/users/:id` | Get user profile |

**Full API documentation:** See `backend/README.md`

## Environment Configuration

Default settings (in `backend/.env`):
- **Port:** 3001
- **Frontend URL:** http://localhost:5173
- **Database:** SQLite (auto-created)

## Database

The SQLite database is automatically created on first run with:
- 4 pre-seeded communities (Workplace, Domestic Violence, Legal, College)
- All necessary tables (users, posts, communities, etc.)
- No additional setup required!

## Next Steps

### Integrate with Frontend

To connect your frontend to the backend:

1. Update your frontend components to use the API:
```javascript
// Example: Fetch posts
const response = await fetch('http://localhost:3001/api/posts');
const posts = await response.json();
```

2. Create posts:
```javascript
const response = await fetch('http://localhost:3001/api/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    author: 'SafeVoice47',
    content: 'My story...',
    tags: ['#WorkplaceHarassment']
  })
});
```

### Sample Data

The backend comes with:
- 4 seeded communities ready to use
- Empty posts/users tables (add your own data)
- Full CRUD operations available

## Troubleshooting

**Backend won't start:**
- Check if Node.js is installed: `node --version`
- Ensure port 3001 is not in use
- Check for errors in terminal output

**Cannot connect from frontend:**
- Verify backend is running on port 3001
- Check CORS settings in `backend/.env`
- Ensure `FRONTEND_URL` matches your frontend URL

**Database issues:**
- Delete `backend/database.sqlite` to reset
- Restart the backend to recreate the database

## Development Tips

- Use browser DevTools Network tab to debug API calls
- Check backend terminal for request logs
- API returns JSON for easy debugging
- Test endpoints with curl or Postman before frontend integration

## Project Structure

```
nyaya/
├── backend/              # Backend API (NEW!)
│   ├── routes/          # API endpoints
│   ├── database.js      # Database setup
│   ├── server.js        # Main server
│   └── README.md        # Detailed API docs
├── src/                 # Frontend React app
├── public/              # Static assets
└── package.json         # Frontend dependencies
```

## Support

- Backend Documentation: `backend/README.md`
- API Examples: See backend README for curl examples
- Issues: Check terminal logs for detailed error messages

---

🎉 **Your Nyaya backend is ready to use!**

Start both servers and begin building your full-stack application.
