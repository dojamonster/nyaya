import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DATABASE_PATH || './database.sqlite';
const db = new Database(path.join(__dirname, dbPath));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database tables
function initDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      avatar TEXT DEFAULT '🌸',
      join_date TEXT DEFAULT (datetime('now')),
      last_active TEXT DEFAULT (datetime('now')),
      posts_count INTEGER DEFAULT 0,
      likes_received INTEGER DEFAULT 0,
      communities_joined INTEGER DEFAULT 0,
      support_given INTEGER DEFAULT 0
    )
  `);

  // Communities table
  db.exec(`
    CREATE TABLE IF NOT EXISTS communities (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      members INTEGER DEFAULT 0,
      posts INTEGER DEFAULT 0,
      icon TEXT,
      color TEXT,
      trending INTEGER DEFAULT 0
    )
  `);

  // User Communities (membership)
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_communities (
      user_id TEXT,
      community_id TEXT,
      role TEXT DEFAULT 'Member',
      join_date TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (user_id, community_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE
    )
  `);

  // Posts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      author_id TEXT NOT NULL,
      author TEXT NOT NULL,
      avatar TEXT,
      content TEXT NOT NULL,
      timestamp TEXT DEFAULT (datetime('now')),
      likes INTEGER DEFAULT 0,
      comments INTEGER DEFAULT 0,
      community_id TEXT,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE SET NULL
    )
  `);

  // Post tags
  db.exec(`
    CREATE TABLE IF NOT EXISTS post_tags (
      post_id TEXT,
      tag TEXT,
      PRIMARY KEY (post_id, tag),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    )
  `);

  // Post likes
  db.exec(`
    CREATE TABLE IF NOT EXISTS post_likes (
      post_id TEXT,
      user_id TEXT,
      timestamp TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (post_id, user_id),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Secure posts (encrypted/password-protected)
  db.exec(`
    CREATE TABLE IF NOT EXISTS secure_posts (
      id TEXT PRIMARY KEY,
      author TEXT NOT NULL,
      avatar TEXT,
      title TEXT NOT NULL,
      preview TEXT NOT NULL,
      full_content TEXT NOT NULL,
      password_hash TEXT,
      timestamp TEXT DEFAULT (datetime('now')),
      category TEXT,
      unlocked_by TEXT DEFAULT '[]'
    )
  `);

  // Comments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL,
      author_id TEXT NOT NULL,
      author TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Seed initial communities
  const communities = [
    {
      id: 'workplace',
      name: 'Workplace Harassment',
      description: 'Support and guidance for workplace-related issues, discrimination, and harassment.',
      members: 1247,
      posts: 342,
      icon: 'Briefcase',
      color: 'bg-community-workplace',
      trending: 1
    },
    {
      id: 'domestic',
      name: 'Domestic Violence Support',
      description: 'A safe space for survivors and those seeking help with domestic violence situations.',
      members: 892,
      posts: 156,
      icon: 'HomeIcon',
      color: 'bg-community-domestic',
      trending: 1
    },
    {
      id: 'legal',
      name: 'Legal Help & Rights',
      description: 'Legal advice, know your rights, and connect with legal professionals.',
      members: 634,
      posts: 89,
      icon: 'Scale',
      color: 'bg-community-legal',
      trending: 0
    },
    {
      id: 'college',
      name: 'College & Campus Issues',
      description: 'Support for students facing harassment, discrimination, or unsafe situations on campus.',
      members: 543,
      posts: 67,
      icon: 'GraduationCap',
      color: 'bg-community-college',
      trending: 0
    }
  ];

  const insertCommunity = db.prepare(`
    INSERT OR IGNORE INTO communities (id, name, description, members, posts, icon, color, trending)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((communities) => {
    for (const community of communities) {
      insertCommunity.run(
        community.id,
        community.name,
        community.description,
        community.members,
        community.posts,
        community.icon,
        community.color,
        community.trending
      );
    }
  });

  insertMany(communities);

  console.log('Database initialized successfully');
}

initDatabase();

export default db;
