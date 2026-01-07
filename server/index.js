const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { connectDB } = require('./db');
const User = require('./models/User');
const Workout = require('./models/Workout');
const Friendship = require('./models/Friendship');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Helper function to validate and convert user ID to ObjectId
function toObjectId(id) {
  if (!id) {
    return null;
  }
  // Check if it's already a valid ObjectId string (24 hex characters)
  if (mongoose.Types.ObjectId.isValid(id)) {
    return mongoose.Types.ObjectId(id);
  }
  return null;
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
    
    // Validate that user.id is a valid MongoDB ObjectId
    const userId = toObjectId(user.id);
    if (!userId) {
      return res.status(401).json({ 
        error: 'Invalid token format. Please log in again.' 
      });
    }
    
    // Store both original and ObjectId version
    req.user = {
      ...user,
      id: userId.toString(), // Keep as string for consistency
      _id: userId // Store ObjectId for queries
    };
    
    next();
  });
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Workout Buddy API Server',
    status: 'running',
    database: 'MongoDB',
    endpoints: {
      health: '/api/health',
      register: '/api/auth/register',
      login: '/api/auth/login'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running', database: 'MongoDB' });
});

// Stats endpoint (public - shows basic stats)
app.get('/api/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalWorkouts = await Workout.countDocuments();
    const totalFriendships = await Friendship.countDocuments();
    const users = await User.find().select('username email createdAt').sort({ createdAt: -1 });

    res.json({
      totalUsers,
      totalWorkouts,
      totalFriendships,
      users: users.map(u => ({
        id: u._id.toString(),
        username: u.username,
        email: u.email,
        createdAt: u.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      error: 'Error fetching stats',
      details: error.message
    });
  }
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Normalize email to lowercase for consistency
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.trim();

    // Check if user already exists (check both email and username separately for better error messages)
    const existingUserByEmail = await User.findOne({ email: normalizedEmail });
    if (existingUserByEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const existingUserByUsername = await User.findOne({ username: normalizedUsername });
    if (existingUserByUsername) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword
    });

    await newUser.save();

    const token = jwt.sign({ 
      id: newUser._id.toString(), 
      username: newUser.username 
    }, JWT_SECRET);

    res.status(201).json({
      token,
      user: {
        id: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    // Handle MongoDB duplicate key error (race condition fallback)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      if (field === 'email') {
        return res.status(400).json({ error: 'Email already registered' });
      }
      if (field === 'username') {
        return res.status(400).json({ error: 'Username already taken' });
      }
      return res.status(400).json({ 
        error: `${field} already exists` 
      });
    }
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

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ 
      id: user._id.toString(), 
      username: user.username 
    }, JWT_SECRET);

    res.json({
      token,
      user: {
        id: user._id.toString(),
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
    const workouts = await Workout.find({ userId: req.user._id })
      .sort({ date: -1, createdAt: -1 });
    
    // Convert to format expected by frontend
    const formattedWorkouts = workouts.map(w => ({
      id: w._id.toString(),
      userId: w.userId.toString(),
      exercise: w.exercise,
      type: w.type,
      sets: w.sets,
      reps: w.reps,
      weight: w.weight,
      duration: w.duration,
      durationUnit: w.durationUnit,
      date: w.date,
      notes: w.notes,
      createdAt: w.createdAt
    }));

    res.json(formattedWorkouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ error: 'Error fetching workouts' });
  }
});

app.post('/api/workouts', authenticateToken, async (req, res) => {
  try {
    console.log('=== WORKOUT CREATION REQUEST ===');
    console.log('User object:', req.user);
    console.log('User ID:', req.user?._id);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    // Validate user is authenticated
    if (!req.user || !req.user._id) {
      console.error('Authentication error: User ID not found');
      return res.status(401).json({ error: 'User authentication failed' });
    }
    
    const { exercise, type, sets, reps, weight, duration, durationUnit, date, notes } = req.body;

    // Basic validation
    if (!exercise || !exercise.trim()) {
      console.error('Validation error: Exercise is required');
      return res.status(400).json({ error: 'Exercise is required' });
    }

    if (!date) {
      console.error('Validation error: Date is required');
      return res.status(400).json({ error: 'Date is required' });
    }

    const workoutType = type || 'strength training';

    // Parse date safely - handle YYYY-MM-DD format
    let workoutDate;
    if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // Date is in YYYY-MM-DD format, parse it to avoid timezone issues
      const [year, month, day] = date.split('-').map(Number);
      workoutDate = new Date(year, month - 1, day);
    } else {
      workoutDate = new Date(date);
    }

    // Validate date
    if (isNaN(workoutDate.getTime())) {
      console.error('Validation error: Invalid date format', date);
      return res.status(400).json({ error: 'Invalid date format' });
    }

    console.log('Creating workout with:', {
      userId: req.user._id,
      exercise: exercise.trim(),
      type: workoutType,
      date: workoutDate,
      duration,
      durationUnit
    });

    const newWorkout = new Workout({
      userId: req.user._id,
      exercise: exercise.trim(),
      type: workoutType,
      sets: sets ? parseFloat(sets) : null,
      reps: reps ? parseFloat(reps) : null,
      weight: weight ? parseFloat(weight) : null,
      duration: duration ? parseFloat(duration) : null,
      durationUnit: duration ? (durationUnit || 'minutes') : null,
      date: workoutDate,
      notes: notes || ''
    });

    await newWorkout.save();
    console.log('Workout saved successfully:', newWorkout._id);

    // Format response for frontend
    // Format date as YYYY-MM-DD string for consistency
    let dateStr;
    if (newWorkout.date instanceof Date) {
      dateStr = newWorkout.date.toISOString().split('T')[0];
    } else if (typeof newWorkout.date === 'string') {
      dateStr = newWorkout.date.split('T')[0];
    } else {
      // Fallback: use the original date string from request
      dateStr = date.split('T')[0];
    }
    
    const formattedWorkout = {
      id: newWorkout._id.toString(),
      userId: newWorkout.userId.toString(),
      exercise: newWorkout.exercise,
      type: newWorkout.type,
      sets: newWorkout.sets,
      reps: newWorkout.reps,
      weight: newWorkout.weight,
      duration: newWorkout.duration,
      durationUnit: newWorkout.durationUnit,
      date: dateStr,
      notes: newWorkout.notes || '',
      createdAt: newWorkout.createdAt
    };
    
    console.log('Formatted workout response:', JSON.stringify(formattedWorkout, null, 2));

    res.status(201).json(formattedWorkout);
  } catch (error) {
    console.error('=== ERROR CREATING WORKOUT ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error:', error);
    
    // Provide more detailed error information
    let errorMessage = 'Error creating workout';
    if (error.name === 'ValidationError') {
      errorMessage = `Validation error: ${error.message}`;
    } else if (error.name === 'CastError') {
      errorMessage = `Invalid data format: ${error.message}`;
    } else {
      errorMessage = error.message || 'Error creating workout';
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: error.message, // Include error message for debugging
      errorName: error.name
    });
  }
});

app.delete('/api/workouts/:id', authenticateToken, async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    await Workout.deleteOne({ _id: req.params.id });

    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Error deleting workout:', error);
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

    // Get all friendships (pending, accepted, rejected) to exclude from search
    const allFriendships = await Friendship.find({
      $or: [
        { userId: req.user._id },
        { friendId: req.user._id }
      ]
    });

    const excludedIds = new Set();
    allFriendships.forEach(f => {
      if (f.userId.toString() === req.user.id) {
        excludedIds.add(f.friendId.toString());
      }
      if (f.friendId.toString() === req.user.id) {
        excludedIds.add(f.userId.toString());
      }
    });

    const excludedObjectIds = Array.from(excludedIds).filter(id => mongoose.Types.ObjectId.isValid(id)).map(id => mongoose.Types.ObjectId(id));
    const currentUserId = req.user._id;

    const searchQuery = {
      _id: { 
        $ne: currentUserId,
        $nin: excludedObjectIds
      },
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    };

    const users = await User.find(searchQuery)
      .select('username email')
      .limit(10);

    res.json(users.map(u => ({
      id: u._id.toString(),
      username: u.username,
      email: u.email
    })));
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Error searching users' });
  }
});

// Get accepted friends only
app.get('/api/friends', authenticateToken, async (req, res) => {
  try {
    const friendships = await Friendship.find({
      status: 'accepted',
      $or: [
        { userId: req.user._id },
        { friendId: req.user._id }
      ]
    }).populate('userId', 'username email').populate('friendId', 'username email');

    const friends = friendships.map(f => {
      const friend = f.userId._id.toString() === req.user.id ? f.friendId : f.userId;
      return {
        id: friend._id.toString(),
        username: friend.username,
        email: friend.email,
        friendshipId: f._id.toString(),
        createdAt: f.createdAt
      };
    });

    res.json(friends);
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ error: 'Error fetching friends' });
  }
});

// Get pending friend requests (sent and received)
app.get('/api/friends/requests', authenticateToken, async (req, res) => {
  try {
    const pendingRequests = await Friendship.find({
      status: 'pending',
      $or: [
        { userId: req.user._id },
        { friendId: req.user._id }
      ]
    }).populate('userId', 'username email').populate('friendId', 'username email');

    const sentRequests = [];
    const receivedRequests = [];

    pendingRequests.forEach(f => {
      const isSender = f.userId._id.toString() === req.user.id;
      const otherUser = isSender ? f.friendId : f.userId;
      
      const requestData = {
        id: f._id.toString(),
        userId: otherUser._id.toString(),
        username: otherUser.username,
        email: otherUser.email,
        createdAt: f.createdAt
      };

      if (isSender) {
        sentRequests.push(requestData);
      } else {
        receivedRequests.push(requestData);
      }
    });

    res.json({
      sent: sentRequests,
      received: receivedRequests
    });
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    res.status(500).json({ error: 'Error fetching friend requests' });
  }
});

// Send friend request (creates with status: pending)
app.post('/api/friends', authenticateToken, async (req, res) => {
  try {
    const { friendId } = req.body;

    if (!friendId) {
      return res.status(400).json({ error: 'Friend ID is required' });
    }

    if (friendId.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot add yourself as a friend' });
    }

    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if any friendship already exists (pending, accepted, or rejected)
    const existingFriendship = await Friendship.findOne({
      $or: [
        { userId: req.user._id, friendId },
        { userId: friendId, friendId: req.user._id }
      ]
    });

    if (existingFriendship) {
      if (existingFriendship.status === 'pending') {
        return res.status(400).json({ error: 'Friend request already sent' });
      }
      if (existingFriendship.status === 'accepted') {
        return res.status(400).json({ error: 'Already friends' });
      }
      // If rejected, allow sending a new request by deleting the old one
      await Friendship.deleteOne({ _id: existingFriendship._id });
    }

    const newFriendship = new Friendship({
      userId: req.user._id,
      friendId,
      status: 'pending'
    });

    await newFriendship.save();

    res.status(201).json({
      id: friend._id.toString(),
      username: friend.username,
      email: friend.email,
      requestId: newFriendship._id.toString(),
      status: 'pending'
    });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ error: 'Error sending friend request' });
  }
});

// Accept friend request
app.put('/api/friends/requests/:requestId/accept', authenticateToken, async (req, res) => {
  try {
    const friendship = await Friendship.findOne({
      _id: req.params.requestId,
      friendId: req.user._id, // Only the recipient can accept
      status: 'pending'
    }).populate('userId', 'username email');

    if (!friendship) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    friendship.status = 'accepted';
    await friendship.save();

    res.json({
      id: friendship.userId._id.toString(),
      username: friendship.userId.username,
      email: friendship.userId.email,
      friendshipId: friendship._id.toString(),
      message: 'Friend request accepted'
    });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ error: 'Error accepting friend request' });
  }
});

// Reject or cancel friend request
app.delete('/api/friends/requests/:requestId', authenticateToken, async (req, res) => {
  try {
    const friendship = await Friendship.findOne({
      _id: req.params.requestId,
      status: 'pending',
      $or: [
        { userId: req.user._id }, // Can cancel sent request
        { friendId: req.user._id } // Can reject received request
      ]
    });

    if (!friendship) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    await Friendship.deleteOne({ _id: req.params.requestId });

    res.json({ message: 'Friend request removed' });
  } catch (error) {
    console.error('Error removing friend request:', error);
    res.status(500).json({ error: 'Error removing friend request' });
  }
});

app.delete('/api/friends/:friendshipId', authenticateToken, async (req, res) => {
  try {
    const friendship = await Friendship.findOne({
      _id: req.params.friendshipId,
      $or: [
        { userId: req.user._id },
        { friendId: req.user._id }
      ]
    });

    if (!friendship) {
      return res.status(404).json({ error: 'Friendship not found' });
    }

    await Friendship.deleteOne({ _id: req.params.friendshipId });

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Error removing friend:', error);
    res.status(500).json({ error: 'Error removing friend' });
  }
});

// Social Feed Routes - Only show accepted friends' workouts
app.get('/api/feed', authenticateToken, async (req, res) => {
  try {
    const friendships = await Friendship.find({
      status: 'accepted',
      $or: [
        { userId: req.user._id },
        { friendId: req.user._id }
      ]
    });

    const friendIds = new Set([req.user._id.toString()]); // Include own workouts
    friendships.forEach(f => {
      if (f.userId.toString() === req.user.id) {
        friendIds.add(f.friendId.toString());
      }
      if (f.friendId.toString() === req.user.id) {
        friendIds.add(f.userId.toString());
      }
    });

    const workouts = await Workout.find({
      userId: { $in: Array.from(friendIds).map(id => mongoose.Types.ObjectId(id)) }
    })
      .populate('userId', 'username')
      .sort({ date: -1, createdAt: -1 })
      .limit(50);

    const feed = workouts.map(w => ({
      workout: {
        id: w._id.toString(),
        userId: w.userId._id.toString(),
        exercise: w.exercise,
        type: w.type,
        sets: w.sets,
        reps: w.reps,
        weight: w.weight,
        duration: w.duration,
        durationUnit: w.durationUnit,
        date: w.date,
        notes: w.notes,
        createdAt: w.createdAt
      },
      user: {
        id: w.userId._id.toString(),
        username: w.userId.username
      }
    }));

    res.json(feed);
  } catch (error) {
    console.error('Error fetching feed:', error);
    res.status(500).json({ error: 'Error fetching feed' });
  }
});

// Leaderboard Route - Only show accepted friends
app.get('/api/leaderboard', authenticateToken, async (req, res) => {
  try {
    const { period = 'week' } = req.query;

    const friendships = await Friendship.find({
      status: 'accepted',
      $or: [
        { userId: req.user._id },
        { friendId: req.user._id }
      ]
    });

    const friendIds = new Set([req.user._id.toString()]);
    friendships.forEach(f => {
      if (f.userId.toString() === req.user.id) {
        friendIds.add(f.friendId.toString());
      }
      if (f.friendId.toString() === req.user.id) {
        friendIds.add(f.userId.toString());
      }
    });

    const now = new Date();
    let cutoffDate = new Date(0);
    if (period === 'week') {
      cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === 'month') {
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const userIds = Array.from(friendIds).map(id => mongoose.Types.ObjectId(id));
    const users = await User.find({ _id: { $in: userIds } });

    const leaderboard = await Promise.all(users.map(async (user) => {
      const workoutQuery = { userId: user._id };
      if (period !== 'all') {
        workoutQuery.date = { $gte: cutoffDate };
      }

      const userWorkouts = await Workout.find(workoutQuery);
      const totalWorkouts = userWorkouts.length;

      return {
        userId: user._id.toString(),
        username: user.username,
        totalWorkouts,
        isCurrentUser: user._id.toString() === req.user.id
      };
    }));

    leaderboard.sort((a, b) => b.totalWorkouts - a.totalWorkouts);

    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Error fetching leaderboard' });
  }
});

// Global error handler middleware (must be after all routes)
app.use((err, req, res, next) => {
  console.error('=== UNHANDLED ERROR ===');
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
});

// Initialize server
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`MongoDB connected`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
}

startServer();
