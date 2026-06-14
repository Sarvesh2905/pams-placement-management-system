const User = require('../models/User');
const Company = require('../models/Company');
const Alumni = require('../models/Alumni');
const PlacementAnnouncement = require('../models/PlacementAnnouncement');
const Notification = require('../models/Notification');

exports.addStudent = async (req, res) => {
  try {
    const {
      year,
      name,
      registerNumber,
      rollNo,
      email,
      phoneNo,
      department,
      batch,
      cgpa
    } = req.body;

    // Check if student already exists
    const existingStudent = await User.findOne({
      $or: [
        { email },
        { registerNumber },
        { rollNo }
      ]
    });

    if (existingStudent) {
      return res.status(400).json({
        message: 'Student with this email, register number, or roll number already exists'
      });
    }

    // Create student with rollNo as password
    const student = new User({
      name,
      email,
      password: rollNo,
      role: 'student',
      registerNumber,
      rollNo,
      phoneNo,
      department,
      batch,
      year: parseInt(year),
      cgpa: parseFloat(cgpa)
    });

    await student.save();

    res.status(201).json({
      message: 'Student added successfully',
      student: student.toJSON()
    });
  } catch (error) {
    console.error('Add student error:', error);
    res.status(500).json({
      message: 'Failed to add student',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

exports.addCompany = async (req, res) => {
  try {
    const {
      name,
      location,
      hrName,
      hrContact,
      hrEmail,
      website
    } = req.body;

    const company = new Company({
      name,
      location,
      hrName,
      hrContact,
      hrEmail,
      website,
      addedBy: req.user._id
    });

    await company.save();

    res.status(201).json({
      message: 'Company added successfully',
      company
    });
  } catch (error) {
    console.error('Add company error:', error);
    res.status(500).json({
      message: 'Failed to add company',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

exports.addCoordinator = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNo,
      department,
      password
    } = req.body;

    // Check if coordinator already exists
    const existingCoordinator = await User.findOne({ email });
    if (existingCoordinator) {
      return res.status(400).json({
        message: 'Coordinator with this email already exists'
      });
    }

    const coordinator = new User({
      name,
      email,
      password: password || email.split('@')[0],
      role: 'coordinator',
      phoneNo,
      department
    });

    await coordinator.save();

    res.status(201).json({
      message: 'Coordinator added successfully',
      coordinator: coordinator.toJSON()
    });
  } catch (error) {
    console.error('Add coordinator error:', error);
    res.status(500).json({
      message: 'Failed to add coordinator',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

exports.addAlumni = async (req, res) => {
  try {
    const {
      year,
      department,
      name,
      currentRole,
      linkedinProfile
    } = req.body;

    const alumni = new Alumni({
      name,
      year: parseInt(year),
      department,
      currentRole,
      linkedinProfile,
      addedBy: req.user._id
    });

    await alumni.save();

    res.status(201).json({
      message: 'Alumni added successfully',
      alumni
    });
  } catch (error) {
    console.error('Add alumni error:', error);
    res.status(500).json({
      message: 'Failed to add alumni',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      message: 'Failed to fetch students',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(companies);
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({
      message: 'Failed to fetch companies',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

exports.getCoordinators = async (req, res) => {
  try {
    const coordinators = await User.find({ role: 'coordinator' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json(coordinators);
  } catch (error) {
    console.error('Get coordinators error:', error);
    res.status(500).json({
      message: 'Failed to fetch coordinators',
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
    const announcements = await PlacementAnnouncement.find()
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
    const notifications = await Notification.find()
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

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const student = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      message: 'Student updated successfully',
      student
    });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({
      message: 'Failed to update student',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const company = await Company.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({
      message: 'Company updated successfully',
      company
    });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({
      message: 'Failed to update company',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

exports.updateCoordinator = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const coordinator = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    
    if (!coordinator) {
      return res.status(404).json({ message: 'Coordinator not found' });
    }

    res.status(200).json({
      message: 'Coordinator updated successfully',
      coordinator
    });
  } catch (error) {
    console.error('Update coordinator error:', error);
    res.status(500).json({
      message: 'Failed to update coordinator',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedStudent = await User.findByIdAndDelete(id);
    if (!deletedStudent) {
      return res.status(404).json({
        message: 'Student not found'
      });
    }

    res.status(200).json({
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      message: 'Failed to delete student',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    
    const company = await Company.findByIdAndDelete(id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({
      message: 'Company deleted successfully'
    });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({
      message: 'Failed to delete company',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

exports.deleteCoordinator = async (req, res) => {
  try {
    const { id } = req.params;
    
    const coordinator = await User.findByIdAndDelete(id);
    if (!coordinator) {
      return res.status(404).json({ message: 'Coordinator not found' });
    }

    res.status(200).json({
      message: 'Coordinator deleted successfully'
    });
  } catch (error) {
    console.error('Delete coordinator error:', error);
    res.status(500).json({
      message: 'Failed to delete coordinator',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

exports.announcePlacement = async (req, res) => {
  try {
    const {
      companyName,
      departments,
      students,
      role,
      package: packageAmount,
      batch
    } = req.body;

    const announcement = new PlacementAnnouncement({
      companyName,
      departments,
      students,
      role,
      package: packageAmount,
      batch,
      announcedBy: req.user._id
    });

    await announcement.save();

    res.status(201).json({
      message: 'Placement announced successfully',
      announcement
    });
  } catch (error) {
    console.error('Announce placement error:', error);
    res.status(500).json({
      message: 'Failed to announce placement',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

exports.sendNotification = async (req, res) => {
  try {
    const {
      title,
      body,
      targetAudience,
      targetDepartments,
      targetYear,
      scheduledAt
    } = req.body;

    const notification = new Notification({
      title,
      body,
      targetAudience,
      targetDepartments,
      targetYear,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : Date.now(),
      sentBy: req.user._id
    });

    await notification.save();

    res.status(201).json({
      message: 'Notification sent successfully',
      notification
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({
      message: 'Failed to send notification',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalCompanies,
      totalCoordinators,
      totalAlumni,
      totalAnnouncements,
      totalNotifications
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Company.countDocuments(),
      User.countDocuments({ role: 'coordinator' }),
      Alumni.countDocuments(),
      PlacementAnnouncement.countDocuments(),
      Notification.countDocuments()
    ]);

    res.status(200).json({
      totalStudents,
      totalCompanies,
      totalCoordinators,
      totalAlumni,
      totalAnnouncements,
      totalNotifications
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      message: 'Failed to fetch dashboard statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};
