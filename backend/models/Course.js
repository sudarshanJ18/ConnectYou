const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Web Development', 'Data Science', 'Cloud Computing', 'Mobile Development', 'DevOps', 'Career Skills', 'Industry Insights', 'Personal Development']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  content: [{
    type: {
      type: String,
      enum: ['video', 'pdf', 'presentation', 'quiz'],
      required: true
    },
    title: String,
    url: String,
    duration: Number,
    order: Number
  }],
  quizzes: [{
    title: String,
    questions: [{
      question: String,
      options: [String],
      correctAnswer: Number
    }]
  }],
  enrolled: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    progress: Number,
    completedContent: [String],
    quizScores: [{
      quizId: String,
      score: Number
    }],
    startDate: Date,
    lastAccessed: Date
  }],
  rating: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [String],
  thumbnail: String,
  isPublished: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Course', courseSchema);