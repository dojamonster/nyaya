import express from 'express';
import db from '../database.js';

const router = express.Router();

// Get all communities
router.get('/', (req, res) => {
  try {
    const communities = db.prepare(`
      SELECT * FROM communities ORDER BY trending DESC, members DESC
    `).all();

    const formattedCommunities = communities.map(community => ({
      ...community,
      trending: Boolean(community.trending),
      joined: false // This would check against user session in real app
    }));

    res.json(formattedCommunities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific community
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const community = db.prepare('SELECT * FROM communities WHERE id = ?').get(id);

    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    res.json({
      ...community,
      trending: Boolean(community.trending),
      joined: false
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Join a community
router.post('/:id/join', (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check if community exists
    const community = db.prepare('SELECT * FROM communities WHERE id = ?').get(id);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    // Check if already joined
    const existing = db.prepare(`
      SELECT * FROM user_communities WHERE user_id = ? AND community_id = ?
    `).get(user_id, id);

    if (existing) {
      return res.status(400).json({ error: 'Already joined this community' });
    }

    // Join community
    db.prepare(`
      INSERT INTO user_communities (user_id, community_id) VALUES (?, ?)
    `).run(user_id, id);

    // Increment member count
    db.prepare('UPDATE communities SET members = members + 1 WHERE id = ?').run(id);

    res.json({ message: 'Successfully joined community', joined: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Leave a community
router.post('/:id/leave', (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Remove membership
    const result = db.prepare(`
      DELETE FROM user_communities WHERE user_id = ? AND community_id = ?
    `).run(user_id, id);

    if (result.changes === 0) {
      return res.status(400).json({ error: 'Not a member of this community' });
    }

    // Decrement member count
    db.prepare('UPDATE communities SET members = members - 1 WHERE id = ?').run(id);

    res.json({ message: 'Successfully left community', joined: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's joined communities
router.get('/user/:user_id', (req, res) => {
  try {
    const { user_id } = req.params;

    const communities = db.prepare(`
      SELECT c.*, uc.role, uc.join_date
      FROM communities c
      INNER JOIN user_communities uc ON c.id = uc.community_id
      WHERE uc.user_id = ?
      ORDER BY uc.join_date DESC
    `).all(user_id);

    const formattedCommunities = communities.map(community => ({
      ...community,
      trending: Boolean(community.trending),
      joined: true,
      joinDate: formatDate(community.join_date)
    }));

    res.json(formattedCommunities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to format dates
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default router;
