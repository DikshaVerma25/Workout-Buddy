const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  friendId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted'],
    default: 'accepted'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Ensure unique friendships (no duplicates)
friendshipSchema.index({ userId: 1, friendId: 1 }, { unique: true });

// Prevent self-friendship
friendshipSchema.pre('save', function(next) {
  if (this.userId.toString() === this.friendId.toString()) {
    return next(new Error('Cannot be friends with yourself'));
  }
  next();
});

module.exports = mongoose.model('Friendship', friendshipSchema);

