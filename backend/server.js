import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import postsRouter from './routes/posts.js';
import communitiesRouter from './routes/communities.js';
import secureForumRouter from './routes/secureForum.js';
import usersRouter from './routes/users.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/posts', postsRouter);
app.use('/api/communities', communitiesRouter);
app.use('/api/secure-forum', secureForumRouter);
app.use('/api/users', usersRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Nyaya backend is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Nyaya Backend API',
    version: '1.0.0',
    endpoints: {
      posts: '/api/posts',
      communities: '/api/communities',
      secureForum: '/api/secure-forum',
      users: '/api/users',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Nyaya Backend Server                 ║
║   Port: ${PORT}                       ║
║   Environment: ${process.env.NODE_ENV || 'development'}           ║
║   Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}  ║
╚════════════════════════════════════════╝
  `);
  console.log('Available endpoints:');
  console.log('  - GET  /api/health');
  console.log('  - GET  /api/posts');
  console.log('  - POST /api/posts');
  console.log('  - GET  /api/communities');
  console.log('  - GET  /api/secure-forum');
  console.log('  - GET  /api/users/:id');
  console.log('\\nServer is ready to accept requests!\\n');
});

export default app;
