const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true,
    trim: true
  },
  targetAudience: {
    type: String,
    required: true,
    enum: ['students', 'coordinators', 'all']
  },
  targetDepartments: [{
    type: String,
    enum: [
      'Artificial Intelligence & Data Science',
      'Biomedical Engineering',
      'Civil Engineering',
      'Computer Science & Engineering',
      'Computer Science & Engineering (Cyber Security Specialization)',
      'Computer Science and Business Systems',
      'Electrical & Electronics Engineering',
      'Electronics & Communication Engineering',
      'Information Technology',
      'Mechanical Engineering'
    ]
  }],
  targetYear: {
    type: Number,
    min: 2023,
    max: 2030
  },
  scheduledAt: {
    type: Date,
    default: Date.now
  },
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isRead: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
