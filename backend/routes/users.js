import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database.js';

const router = express.Router();

// Get user profile
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's communities
    const communities = db.prepare(`
      SELECT c.name, uc.role, uc.join_date
      FROM communities c
      INNER JOIN user_communities uc ON c.id = uc.community_id
      WHERE uc.user_id = ?
    `).all(id);

    // Get recent activity
    const recentPosts = db.prepare(`
      SELECT 'Posted in ' || COALESCE(c.name, 'Forum') as action, p.timestamp as time
      FROM posts p
      LEFT JOIN communities c ON p.community_id = c.id
      WHERE p.author_id = ?
      ORDER BY p.timestamp DESC
      LIMIT 5
    `).all(id);

    res.json({
      ...user,
      joinDate: formatDate(user.join_date),
      lastActive: formatTimestamp(user.last_active),
      communityMemberships: communities.map(c => ({
        name: c.name,
        role: c.role,
        joinDate: formatDate(c.join_date)
      })),
      recentActivity: recentPosts.map(p => ({
        action: p.action,
        time: formatTimestamp(p.time)
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new user
router.post('/', (req, res) => {
  try {
    const { username, avatar } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const userId = uuidv4();
    const timestamp = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, username, avatar, join_date, last_active)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, username, avatar || '🌸', timestamp, timestamp);

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    
    res.status(201).json({
      ...user,
      joinDate: formatDate(user.join_date),
      lastActive: formatTimestamp(user.last_active)
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { username, avatar } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updates = [];
    const values = [];

    if (username) {
      updates.push('username = ?');
      values.push(username);
    }
    if (avatar) {
      updates.push('avatar = ?');
      values.push(avatar);
    }

    // Update last_active
    updates.push('last_active = ?');
    values.push(new Date().toISOString());

    if (updates.length > 0) {
      values.push(id);
      db.prepare(`
        UPDATE users SET ${updates.join(', ')} WHERE id = ?
      `).run(...values);
    }

    const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    
    res.json({
      ...updatedUser,
      joinDate: formatDate(updatedUser.join_date),
      lastActive: formatTimestamp(updatedUser.last_active)
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Get user statistics
router.get('/:id/stats', (req, res) => {
  try {
    const { id } = req.params;

    const stats = {
      postsCount: db.prepare('SELECT COUNT(*) as count FROM posts WHERE author_id = ?').get(id).count,
      commentsCount: db.prepare('SELECT COUNT(*) as count FROM comments WHERE author_id = ?').get(id).count,
      likesReceived: db.prepare('SELECT SUM(likes) as total FROM posts WHERE author_id = ?').get(id).total || 0,
      communitiesJoined: db.prepare('SELECT COUNT(*) as count FROM user_communities WHERE user_id = ?').get(id).count
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  
  return date.toLocaleDateString();
}

export default router;
