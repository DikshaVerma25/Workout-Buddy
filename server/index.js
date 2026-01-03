const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Allow all origins in development, set specific URL in production
  credentials: true
}));
app.use(express.json());

// Data storage (using JSON files - can be upgraded to a real database)
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const WORKOUTS_FILE = path.join(DATA_DIR, 'workouts.json');
const FRIENDSHIPS_FILE = path.join(DATA_DIR, 'friendships.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    // Initialize files if they don't exist
    try {
      await fs.access(USERS_FILE);
    } catch {
      await fs.writeFile(USERS_FILE, JSON.stringify([]));
    }
    try {
      await fs.access(WORKOUTS_FILE);
    } catch {
      await fs.writeFile(WORKOUTS_FILE, JSON.stringify([]));
    }
    try {
      await fs.access(FRIENDSHIPS_FILE);
    } catch {
      await fs.writeFile(FRIENDSHIPS_FILE, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Error setting up data directory:', error);
  }
}

// Helper functions for data operations
async function readData(file) {
  try {
    const data = await fs.readFile(file, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeData(file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Workout Buddy API Server',
    status: 'running',
    endpoints: {
      health: '/api/health',
      register: '/api/auth/register',
      login: '/api/auth/login'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const users = await readData(USERS_FILE);

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    if (users.find(u => u.username === username)) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await writeData(USERS_FILE, users);

    const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET);

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Server error during registration',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const users = await readData(USERS_FILE);
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Server error during login',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Workout Routes
app.get('/api/workouts', authenticateToken, async (req, res) => {
  try {
    const workouts = await readData(WORKOUTS_FILE);
    const userWorkouts = workouts.filter(w => w.userId === req.user.id);
    res.json(userWorkouts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching workouts' });
  }
});

app.post('/api/workouts', authenticateToken, async (req, res) => {
  try {
    console.log('=== WORKOUT POST REQUEST ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Exercise:', req.body.exercise);
    console.log('Type:', req.body.type);
    console.log('Date:', req.body.date);
    console.log('Duration:', req.body.duration);
    console.log('Sets:', req.body.sets);
    console.log('Reps:', req.body.reps);
    
    const { exercise, type, sets, reps, weight, duration, durationUnit, date, notes } = req.body;

    // Basic validation
    if (!exercise || !exercise.trim()) {
      console.log('❌ Validation failed: Exercise is missing');
      return res.status(400).json({ error: 'Exercise is required' });
    }

    if (!date) {
      console.log('❌ Validation failed: Date is missing');
      return res.status(400).json({ error: 'Date is required' });
    }

    // Validate based on workout type
    const workoutType = type || 'strength training'; // Default for backward compatibility
    
    // Sets and reps are no longer used - removed from form
    // Duration is optional for all workout types
    // Only exercise and date are required
    
    console.log('✅ All validations passed, creating workout...');

    const workouts = await readData(WORKOUTS_FILE);
    const newWorkout = {
      id: uuidv4(),
      userId: req.user.id,
      exercise: exercise.trim(),
      type: workoutType,
      sets: null, // Sets/reps removed from form
      reps: null, // Sets/reps removed from form
      weight: null, // Weight removed from form
      // Duration is optional
      duration: duration ? parseFloat(duration) : null,
      durationUnit: duration ? (durationUnit || 'minutes') : null,
      date,
      notes: notes || '',
      createdAt: new Date().toISOString()
    };
    
    console.log('Creating workout:', JSON.stringify(newWorkout, null, 2));

    workouts.push(newWorkout);
    await writeData(WORKOUTS_FILE, workouts);

    res.status(201).json(newWorkout);
  } catch (error) {
    console.error('Error creating workout:', error);
    res.status(500).json({ error: 'Error creating workout' });
  }
});

app.delete('/api/workouts/:id', authenticateToken, async (req, res) => {
  try {
    const workouts = await readData(WORKOUTS_FILE);
    const workoutIndex = workouts.findIndex(w => w.id === req.params.id && w.userId === req.user.id);

    if (workoutIndex === -1) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    workouts.splice(workoutIndex, 1);
    await writeData(WORKOUTS_FILE, workouts);

    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting workout' });
  }
});

// Friends Routes
app.get('/api/users/search', authenticateToken, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.json([]);
    }

    const users = await readData(USERS_FILE);
    const friendships = await readData(FRIENDSHIPS_FILE);
    const userFriendships = friendships.filter(
      f => f.userId === req.user.id || f.friendId === req.user.id
    );

    const friendIds = new Set();
    userFriendships.forEach(f => {
      if (f.userId === req.user.id) friendIds.add(f.friendId);
      if (f.friendId === req.user.id) friendIds.add(f.userId);
    });

    const searchResults = users
      .filter(u => 
        u.id !== req.user.id &&
        !friendIds.has(u.id) &&
        (u.username.toLowerCase().includes(query.toLowerCase()) ||
         u.email.toLowerCase().includes(query.toLowerCase()))
      )
      .map(u => ({
        id: u.id,
        username: u.username,
        email: u.email
      }))
      .slice(0, 10);

    res.json(searchResults);
  } catch (error) {
    res.status(500).json({ error: 'Error searching users' });
  }
});

app.get('/api/friends', authenticateToken, async (req, res) => {
  try {
    const friendships = await readData(FRIENDSHIPS_FILE);
    const users = await readData(USERS_FILE);

    const userFriendships = friendships.filter(
      f => f.userId === req.user.id || f.friendId === req.user.id
    );

    const friends = userFriendships.map(f => {
      const friendId = f.userId === req.user.id ? f.friendId : f.userId;
      const friend = users.find(u => u.id === friendId);
      return friend ? {
        id: friend.id,
        username: friend.username,
        email: friend.email,
        friendshipId: f.id,
        createdAt: f.createdAt
      } : null;
    }).filter(Boolean);

    res.json(friends);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching friends' });
  }
});

app.post('/api/friends', authenticateToken, async (req, res) => {
  try {
    const { friendId } = req.body;

    if (!friendId) {
      return res.status(400).json({ error: 'Friend ID is required' });
    }

    if (friendId === req.user.id) {
      return res.status(400).json({ error: 'Cannot add yourself as a friend' });
    }

    const friendships = await readData(FRIENDSHIPS_FILE);
    const users = await readData(USERS_FILE);

    if (!users.find(u => u.id === friendId)) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingFriendship = friendships.find(
      f => (f.userId === req.user.id && f.friendId === friendId) ||
           (f.userId === friendId && f.friendId === req.user.id)
    );

    if (existingFriendship) {
      return res.status(400).json({ error: 'Friendship already exists' });
    }

    const newFriendship = {
      id: uuidv4(),
      userId: req.user.id,
      friendId,
      createdAt: new Date().toISOString()
    };

    friendships.push(newFriendship);
    await writeData(FRIENDSHIPS_FILE, friendships);

    const friend = users.find(u => u.id === friendId);
    res.status(201).json({
      id: friend.id,
      username: friend.username,
      email: friend.email,
      friendshipId: newFriendship.id
    });
  } catch (error) {
    res.status(500).json({ error: 'Error adding friend' });
  }
});

app.delete('/api/friends/:friendshipId', authenticateToken, async (req, res) => {
  try {
    const friendships = await readData(FRIENDSHIPS_FILE);
    const friendshipIndex = friendships.findIndex(
      f => f.id === req.params.friendshipId &&
           (f.userId === req.user.id || f.friendId === req.user.id)
    );

    if (friendshipIndex === -1) {
      return res.status(404).json({ error: 'Friendship not found' });
    }

    friendships.splice(friendshipIndex, 1);
    await writeData(FRIENDSHIPS_FILE, friendships);

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error removing friend' });
  }
});

// Social Feed Routes
app.get('/api/feed', authenticateToken, async (req, res) => {
  try {
    const friendships = await readData(FRIENDSHIPS_FILE);
    const workouts = await readData(WORKOUTS_FILE);
    const users = await readData(USERS_FILE);

    const userFriendships = friendships.filter(
      f => f.userId === req.user.id || f.friendId === req.user.id
    );

    const friendIds = new Set();
    userFriendships.forEach(f => {
      if (f.userId === req.user.id) friendIds.add(f.friendId);
      if (f.friendId === req.user.id) friendIds.add(f.userId);
    });

    const feedWorkouts = workouts
      .filter(w => friendIds.has(w.userId))
      .map(w => {
        const user = users.find(u => u.id === w.userId);
        return {
          ...w,
          username: user ? user.username : 'Unknown'
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 50);

    res.json(feedWorkouts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching feed' });
  }
});

// Leaderboard Route
app.get('/api/leaderboard', authenticateToken, async (req, res) => {
  try {
    const { period = 'week' } = req.query; // week, month, all
    const friendships = await readData(FRIENDSHIPS_FILE);
    const workouts = await readData(WORKOUTS_FILE);
    const users = await readData(USERS_FILE);

    const userFriendships = friendships.filter(
      f => f.userId === req.user.id || f.friendId === req.user.id
    );

    const friendIds = new Set([req.user.id]); // Include self
    userFriendships.forEach(f => {
      if (f.userId === req.user.id) friendIds.add(f.friendId);
      if (f.friendId === req.user.id) friendIds.add(f.userId);
    });

    const now = new Date();
    let cutoffDate = new Date(0);
    if (period === 'week') {
      cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === 'month') {
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const leaderboard = Array.from(friendIds).map(userId => {
      const user = users.find(u => u.id === userId);
      const userWorkouts = workouts.filter(w => {
        if (w.userId !== userId) return false;
        if (period === 'all') return true;
        return new Date(w.date) >= cutoffDate;
      });

      const totalWorkouts = userWorkouts.length;
      const totalVolume = userWorkouts.reduce((sum, w) => {
        return sum + (w.sets * w.reps * (w.weight || 0));
      }, 0);

      return {
        userId,
        username: user ? user.username : 'Unknown',
        totalWorkouts,
        totalVolume,
        isCurrentUser: userId === req.user.id
      };
    })
    .sort((a, b) => b.totalWorkouts - a.totalWorkouts || b.totalVolume - a.totalVolume);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching leaderboard' });
  }
});

// Initialize server
ensureDataDir()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  });

