const User = require('../models/User');
const PlacementAnnouncement = require('../models/PlacementAnnouncement');
const Notification = require('../models/Notification');

exports.getStudents = async (req, res) => {
  try {
    const coordinator = req.user;
    const { year } = req.query;
    
    let filter = { 
      role: 'student',
      department: coordinator.department
    };

    // Add year filter if provided
    if (year && year !== 'all') {
      filter.year = parseInt(year);
    }
    
    const students = await User.find(filter)
      .select('-password')
      .sort({ year: -1, rollNo: 1 });

    res.status(200).json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      message: 'Failed to fetch students',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

exports.updateStudentCGPA = async (req, res) => {
  try {
    const { id } = req.params;
    const { cgpa } = req.body;
    const coordinator = req.user;

    // Validate CGPA
    if (cgpa < 0 || cgpa > 10) {
      return res.status(400).json({
        message: 'CGPA must be between 0 and 10'
      });
    }

    // Check if student belongs to coordinator's department
    const student = await User.findOne({
      _id: id,
      role: 'student',
      department: coordinator.department
    });

    if (!student) {
      return res.status(404).json({
        message: 'Student not found or not in your department'
      });
    }

    // Update CGPA
    student.cgpa = parseFloat(cgpa);
    await student.save();

    res.status(200).json({
      message: 'Student CGPA updated successfully',
      student: student.toJSON()
    });
  } catch (error) {
    console.error('Update student CGPA error:', error);
    res.status(500).json({
      message: 'Failed to update student CGPA',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

exports.getPlacementAnnouncements = async (req, res) => {
  try {
    const coordinator = req.user;
    
    const announcements = await PlacementAnnouncement.find({
      departments: coordinator.department
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
    const coordinator = req.user;
    
    const notifications = await Notification.find({
      $or: [
        { targetAudience: 'all' },
        { 
          targetAudience: 'coordinators',
          $or: [
            { targetDepartments: { $size: 0 } },
            { targetDepartments: coordinator.department }
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
