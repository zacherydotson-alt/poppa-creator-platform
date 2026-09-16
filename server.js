const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const validator = require('validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '.')));

// Database setup
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) console.error('Database error:', err);
  else console.log('✓ Database connected');
});

// Create tables
const initDB = () => {
  db.serialize(() => {
    // Creators table
    db.run(`
      CREATE TABLE IF NOT EXISTS creators (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        image TEXT,
        portfolio_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Contact messages table
    db.run(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        ip_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Users table (for future auth)
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        profile_data JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert sample creators
    const sampleCreators = [
      ['Built From Fire', 'Metal / Sculpture', 'Rough-cut steel, copper, reclaimed pieces, and art made to outlast the room.', 'https://via.placeholder.com/400x300?text=Built+From+Fire', null],
      ['One of One', 'Original Works', 'Pieces that are not copied, polished into sameness, or made for everybody.', 'https://via.placeholder.com/400x300?text=One+of+One', null],
      ['Make It Yours', 'The People', 'Creators and supporters meet here to trade stories, share work, and build something real.', 'https://via.placeholder.com/400x300?text=Make+It+Yours', null]
    ];

    sampleCreators.forEach(creator => {
      db.run(`INSERT OR IGNORE INTO creators (name, category, description, image, portfolio_url) VALUES (?, ?, ?, ?, ?)`, creator);
    });
  });
};

initDB();

// API Routes

// Get all creators
app.get('/api/creators', (req, res) => {
  db.all('SELECT * FROM creators ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch creators' });
      return;
    }
    res.json(rows || []);
  });
});

// Get creator by ID
app.get('/api/creators/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM creators WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch creator' });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Creator not found' });
      return;
    }
    res.json(row);
  });
});

// Add new creator (protected - add auth in production)
app.post('/api/creators', (req, res) => {
  const { name, category, description, image, portfolio_url } = req.body;

  if (!name || !category) {
    res.status(400).json({ error: 'Name and category are required' });
    return;
  }

  db.run(
    'INSERT INTO creators (name, category, description, image, portfolio_url) VALUES (?, ?, ?, ?, ?)',
    [name, category, description || null, image || null, portfolio_url || null],
    function(err) {
      if (err) {
        res.status(500).json({ error: 'Failed to create creator' });
        return;
      }
      res.json({ id: this.lastID, name, category });
    }
  );
});

// Handle contact form submission
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  const ip = req.ip || req.connection.remoteAddress;

  // Validation
  if (!name || !email || !subject || !message) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  if (!validator.isEmail(email)) {
    res.status(400).json({ error: 'Invalid email address' });
    return;
  }

  if (message.length < 10) {
    res.status(400).json({ error: 'Message must be at least 10 characters' });
    return;
  }

  // Save to database
  db.run(
    'INSERT INTO contact_messages (name, email, subject, message, ip_address) VALUES (?, ?, ?, ?, ?)',
    [name, email, subject, message, ip],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Failed to send message' });
        return;
      }

      // TODO: Send email notification to admin
      // TODO: Send confirmation email to user

      res.json({ success: true, message: 'Message received. We\'ll be in touch.' });
    }
  );
});

// Get contact messages (admin only - add auth)
app.get('/api/contact/messages', (req, res) => {
  // Add authentication check here
  db.all('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 100', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch messages' });
      return;
    }
    res.json(rows || []);
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 POPPA server running on http://localhost:${PORT}`);
  console.log(`📚 API docs available at http://localhost:${PORT}/api`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET    /api/creators`);
  console.log(`  GET    /api/creators/:id`);
  console.log(`  POST   /api/creators`);
  console.log(`  POST   /api/contact`);
  console.log(`  GET    /health\n`);
});

module.exports = app;