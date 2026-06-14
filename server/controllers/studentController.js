const User = require('../models/User');
const Alumni = require('../models/Alumni');
const PlacementAnnouncement = require('../models/PlacementAnnouncement');
const Notification = require('../models/Notification');

exports.getProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user._id).select('-password');
    
    if (!student) {
      return res.status(404).json({
        message: 'Student not found'
      });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      message: 'Failed to fetch profile',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { skills } = req.body;
    
    const student = await User.findByIdAndUpdate(
      req.user._id,
      { skills },
      { new: true, select: '-password' }
    );

    if (!student) {
      return res.status(404).json({
        message: 'Student not found'
      });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      student
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

exports.getAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.find()
      .populate('addedBy', 'name email')
      .sort({ year: -1 });

    res.status(200).json(alumni);
  } catch (error) {
    console.error('Get alumni error:', error);
    res.status(500).json({
      message: 'Failed to fetch alumni',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

exports.getPlacementAnnouncements = async (req, res) => {
  try {
    const student = req.user;
    
    const announcements = await PlacementAnnouncement.find({
      $or: [
        { departments: student.department },
        { departments: { $size: 0 } }
      ]
    })
      .populate('announcedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(announcements);
  } catch (error) {
    console.error('Get placement announcements error:', error);
    res.status(500).json({
      message: 'Failed to fetch placement announcements',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const student = req.user;
    
    const notifications = await Notification.find({
      $or: [
        { targetAudience: 'all' },
        { 
          targetAudience: 'students',
          $or: [
            { targetDepartments: { $size: 0 } },
            { targetDepartments: student.department },
            { targetYear: { $exists: false } },
            { targetYear: student.year }
          ]
        }
      ]
    })
      .populate('sentBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      message: 'Failed to fetch notifications',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};
