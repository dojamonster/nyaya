# Nyaya Backend API

A simple, functional backend API for the Nyaya women's safety and support platform.

## Features

- **Posts Management**: Create, read, like, and comment on community posts
- **Communities**: Join/leave communities, view community information
- **Secure Forum**: Password-protected posts for sensitive information
- **User Profiles**: User management and profile tracking
- **SQLite Database**: Lightweight, serverless database for data persistence
- **CORS Enabled**: Ready for frontend integration

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite3** (better-sqlite3) - Database
- **bcrypt** - Password hashing for secure posts
- **UUID** - Unique ID generation
- **dotenv** - Environment variable management

## Installation

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Setup Steps

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (optional, defaults are provided):
```bash
# The .env file is already created with default values
# Modify if needed:
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DATABASE_PATH=./database.sqlite
```

4. Start the server:
```bash
# Development mode (with auto-reload on Node 18+)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
- **GET** `/api/health` - Check if the server is running

### Posts
- **GET** `/api/posts` - Get all posts
- **POST** `/api/posts` - Create a new post
  - Body: `{ author, author_id, avatar, content, tags, community_id }`
- **POST** `/api/posts/:id/like` - Like/unlike a post
  - Body: `{ user_id }`
- **GET** `/api/posts/:id/comments` - Get comments for a post
- **POST** `/api/posts/:id/comments` - Add a comment
  - Body: `{ author, author_id, content }`

### Communities
- **GET** `/api/communities` - Get all communities
- **GET** `/api/communities/:id` - Get a specific community
- **POST** `/api/communities/:id/join` - Join a community
  - Body: `{ user_id }`
- **POST** `/api/communities/:id/leave` - Leave a community
  - Body: `{ user_id }`
- **GET** `/api/communities/user/:user_id` - Get user's joined communities

### Secure Forum
- **GET** `/api/secure-forum` - Get all secure posts (previews only)
- **POST** `/api/secure-forum` - Create a secure post
  - Body: `{ author, avatar, title, content, password, category }`
- **POST** `/api/secure-forum/:id/unlock` - Unlock a secure post
  - Body: `{ password }`
- **GET** `/api/secure-forum/search?q=query` - Search secure posts

### Users
- **GET** `/api/users/:id` - Get user profile
- **POST** `/api/users` - Create a new user
  - Body: `{ username, avatar }`
- **PUT** `/api/users/:id` - Update user profile
  - Body: `{ username, avatar }`
- **GET** `/api/users/:id/stats` - Get user statistics

## Database Schema

### Tables

**users**
- id (TEXT, PRIMARY KEY)
- username (TEXT, UNIQUE)
- avatar (TEXT)
- join_date (TEXT)
- last_active (TEXT)
- posts_count (INTEGER)
- likes_received (INTEGER)
- communities_joined (INTEGER)
- support_given (INTEGER)

**communities**
- id (TEXT, PRIMARY KEY)
- name (TEXT)
- description (TEXT)
- members (INTEGER)
- posts (INTEGER)
- icon (TEXT)
- color (TEXT)
- trending (INTEGER)

**posts**
- id (TEXT, PRIMARY KEY)
- author_id (TEXT)
- author (TEXT)
- avatar (TEXT)
- content (TEXT)
- timestamp (TEXT)
- likes (INTEGER)
- comments (INTEGER)
- community_id (TEXT)

**secure_posts**
- id (TEXT, PRIMARY KEY)
- author (TEXT)
- avatar (TEXT)
- title (TEXT)
- preview (TEXT)
- full_content (TEXT)
- password_hash (TEXT)
- timestamp (TEXT)
- category (TEXT)

## Example Usage

### Create a Post
```bash
curl -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "author": "SafeVoice47",
    "content": "Sharing my experience and hoping to help others...",
    "tags": ["#WorkplaceHarassment", "#Support"]
  }'
```

### Join a Community
```bash
curl -X POST http://localhost:3001/api/communities/workplace/join \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-uuid-here"
  }'
```

### Create a Secure Post
```bash
curl -X POST http://localhost:3001/api/secure-forum \
  -H "Content-Type: application/json" \
  -d '{
    "author": "Anonymous_Legal",
    "title": "Important Evidence",
    "content": "Detailed information...",
    "password": "secure123",
    "category": "Legal"
  }'
```

## Development

### Project Structure
```
backend/
├── routes/
│   ├── posts.js          # Post-related endpoints
│   ├── communities.js    # Community endpoints
│   ├── secureForum.js    # Secure forum endpoints
│   └── users.js          # User management endpoints
├── database.js           # Database initialization and connection
├── server.js             # Main server file
├── .env                  # Environment configuration
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

### Adding New Endpoints

1. Create or modify a route file in `routes/`
2. Import and use the router in `server.js`
3. Update this README with the new endpoint documentation

## Testing

Test the API using:
- **curl** (see examples above)
- **Postman** or **Insomnia**
- **Browser** for GET endpoints

## Security Notes

- This is a development/demo backend - implement proper authentication before production use
- Passwords for secure posts are hashed using bcrypt
- CORS is configured for the frontend URL
- Input validation is basic - add more comprehensive validation for production

## Troubleshooting

**Port already in use:**
```bash
# Change PORT in .env file or:
PORT=3002 npm start
```

**Database errors:**
```bash
# Delete and recreate database:
rm database.sqlite
npm start
```

**CORS errors:**
```bash
# Update FRONTEND_URL in .env to match your frontend URL
```

## License

MIT

## Support

For issues or questions, please refer to the main Nyaya repository.
