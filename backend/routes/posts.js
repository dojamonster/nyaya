import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database.js';

const router = express.Router();

// Get all posts
router.get('/', (req, res) => {
  try {
    const posts = db.prepare(`
      SELECT p.*, GROUP_CONCAT(pt.tag) as tags
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      GROUP BY p.id
      ORDER BY p.timestamp DESC
    `).all();

    // Parse tags and check if user liked
    const formattedPosts = posts.map(post => ({
      ...post,
      tags: post.tags ? post.tags.split(',') : [],
      liked: false, // This would check against user session in real app
      timestamp: formatTimestamp(post.timestamp)
    }));

    res.json(formattedPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new post
router.post('/', (req, res) => {
  try {
    const { author, author_id, avatar, content, tags, community_id } = req.body;

    if (!content || !author) {
      return res.status(400).json({ error: 'Content and author are required' });
    }

    const postId = uuidv4();
    const timestamp = new Date().toISOString();

    // Insert post
    const insertPost = db.prepare(`
      INSERT INTO posts (id, author_id, author, avatar, content, timestamp, community_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertPost.run(
      postId,
      author_id || uuidv4(),
      author,
      avatar || '🌸',
      content,
      timestamp,
      community_id || null
    );

    // Insert tags if provided
    if (tags && tags.length > 0) {
      const insertTag = db.prepare(`
        INSERT INTO post_tags (post_id, tag) VALUES (?, ?)
      `);

      const insertTags = db.transaction((tags) => {
        for (const tag of tags) {
          insertTag.run(postId, tag.replace('#', ''));
        }
      });

      insertTags(tags);
    }

    // Get the created post
    const post = db.prepare(`
      SELECT p.*, GROUP_CONCAT(pt.tag) as tags
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      WHERE p.id = ?
      GROUP BY p.id
    `).get(postId);

    const formattedPost = {
      ...post,
      tags: post.tags ? post.tags.split(',').map(t => `#${t}`) : [],
      liked: false,
      timestamp: formatTimestamp(post.timestamp)
    };

    res.status(201).json(formattedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like/unlike a post
router.post('/:id/like', (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check if already liked
    const existingLike = db.prepare(`
      SELECT * FROM post_likes WHERE post_id = ? AND user_id = ?
    `).get(id, user_id);

    if (existingLike) {
      // Unlike
      db.prepare('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?').run(id, user_id);
      db.prepare('UPDATE posts SET likes = likes - 1 WHERE id = ?').run(id);
    } else {
      // Like
      db.prepare('INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)').run(id, user_id);
      db.prepare('UPDATE posts SET likes = likes + 1 WHERE id = ?').run(id);
    }

    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
    res.json({ ...post, liked: !existingLike });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get comments for a post
router.get('/:id/comments', (req, res) => {
  try {
    const { id } = req.params;
    const comments = db.prepare(`
      SELECT * FROM comments WHERE post_id = ? ORDER BY timestamp DESC
    `).all(id);

    const formattedComments = comments.map(comment => ({
      ...comment,
      timestamp: formatTimestamp(comment.timestamp)
    }));

    res.json(formattedComments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a comment to a post
router.post('/:id/comments', (req, res) => {
  try {
    const { id } = req.params;
    const { author, author_id, content } = req.body;

    if (!content || !author) {
      return res.status(400).json({ error: 'Content and author are required' });
    }

    const commentId = uuidv4();
    const timestamp = new Date().toISOString();

    db.prepare(`
      INSERT INTO comments (id, post_id, author_id, author, content, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(commentId, id, author_id || uuidv4(), author, content, timestamp);

    // Increment comment count
    db.prepare('UPDATE posts SET comments = comments + 1 WHERE id = ?').run(id);

    const comment = db.prepare('SELECT * FROM comments WHERE id = ?').get(commentId);
    res.status(201).json({
      ...comment,
      timestamp: formatTimestamp(comment.timestamp)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to format timestamps
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // difference in seconds

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  
  return date.toLocaleDateString();
}

export default router;
