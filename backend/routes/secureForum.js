import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import db from '../database.js';

const router = express.Router();

// Get all secure posts (without full content)
router.get('/', (req, res) => {
  try {
    const posts = db.prepare(`
      SELECT id, author, avatar, title, preview, timestamp, category
      FROM secure_posts
      ORDER BY timestamp DESC
    `).all();

    const formattedPosts = posts.map(post => ({
      ...post,
      isUnlocked: false,
      timestamp: formatTimestamp(post.timestamp)
    }));

    res.json(formattedPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new secure post
router.post('/', async (req, res) => {
  try {
    const { author, avatar, title, content, password, category } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({ error: 'Title, content, and author are required' });
    }

    const postId = uuidv4();
    const timestamp = new Date().toISOString();
    const preview = content.substring(0, 100) + (content.length > 100 ? '...' : '');

    // Hash password if provided
    let passwordHash = null;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    // Insert secure post
    db.prepare(`
      INSERT INTO secure_posts (id, author, avatar, title, preview, full_content, password_hash, timestamp, category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      postId,
      author,
      avatar || '🔒',
      title,
      preview,
      content,
      passwordHash,
      timestamp,
      category || 'General'
    );

    const post = db.prepare(`
      SELECT id, author, avatar, title, preview, timestamp, category
      FROM secure_posts WHERE id = ?
    `).get(postId);

    res.status(201).json({
      ...post,
      isUnlocked: !password, // If no password, it's already "unlocked"
      timestamp: formatTimestamp(post.timestamp)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unlock a secure post with password
router.post('/:id/unlock', async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const post = db.prepare(`
      SELECT * FROM secure_posts WHERE id = ?
    `).get(id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Verify password
    if (post.password_hash) {
      const isValid = await bcrypt.compare(password, post.password_hash);
      if (!isValid) {
        return res.status(401).json({ error: 'Incorrect password' });
      }
    }

    // Return full content
    res.json({
      id: post.id,
      author: post.author,
      avatar: post.avatar,
      title: post.title,
      fullContent: post.full_content,
      timestamp: formatTimestamp(post.timestamp),
      category: post.category,
      isUnlocked: true
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search secure posts
router.get('/search', (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const posts = db.prepare(`
      SELECT id, author, avatar, title, preview, timestamp, category
      FROM secure_posts
      WHERE title LIKE ? OR preview LIKE ? OR category LIKE ?
      ORDER BY timestamp DESC
    `).all(`%${q}%`, `%${q}%`, `%${q}%`);

    const formattedPosts = posts.map(post => ({
      ...post,
      isUnlocked: false,
      timestamp: formatTimestamp(post.timestamp)
    }));

    res.json(formattedPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to format timestamps
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  
  return date.toLocaleDateString();
}

export default router;
