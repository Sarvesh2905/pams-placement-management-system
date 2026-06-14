const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 2000,
    max: new Date().getFullYear()
  },
  department: {
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
  },
  currentRole: {
    type: String,
    required: true,
    trim: true
  },
  linkedinProfile: {
    type: String,
    required: true,
    trim: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Alumni', alumniSchema);
