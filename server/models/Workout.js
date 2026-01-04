const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exercise: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  sets: {
    type: Number,
    default: null
  },
  reps: {
    type: Number,
    default: null
  },
  weight: {
    type: Number,
    default: null
  },
  duration: {
    type: Number,
    default: null // Duration in minutes
  },
  durationUnit: {
    type: String,
    default: null // 'minutes' or 'hours'
  },
  date: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for faster queries
workoutSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Workout', workoutSchema);

