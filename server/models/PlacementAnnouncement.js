const mongoose = require('mongoose');

const placementAnnouncementSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  departments: [{
    type: String,
    required: true,
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
  students: [{
    type: String,
    required: true,
    trim: true
  }],
  role: {
    type: String,
    required: true,
    trim: true
  },
  package: {
    type: Number,
    required: true,
    min: 0
  },
  batch: {
    type: String,
    required: true
  },
  announcedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PlacementAnnouncement', placementAnnouncementSchema);
