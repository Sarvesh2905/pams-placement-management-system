const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pams')
.then(async () => {
  console.log('✅ MongoDB connected successfully');
  
  // Auto-create admin user on startup
  await createAdminUser();
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Auto-create admin user function
const createAdminUser = async () => {
  try {
    const User = require('./models/User');
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (!existingAdmin) {
      const admin = new User({
        name: 'System Administrator',
        email: process.env.ADMIN_EMAIL || 'admin@college.edu',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin'
      });
      
      await admin.save();
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email:', admin.email);
      console.log('🔑 Password:', process.env.ADMIN_PASSWORD || 'admin123');
    } else {
      console.log('✅ Admin user already exists');
      console.log('📧 Admin Email:', existingAdmin.email);
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
};

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const coordinatorRoutes = require('./routes/coordinator');
const studentRoutes = require('./routes/student');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/coordinator', coordinatorRoutes);
app.use('/api/student', studentRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'PAMS API Server Running Successfully! 🚀',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API health check
app.get('/api', (req, res) => {
  res.json({ 
    message: 'PAMS API is working! ✅',
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin',
      coordinator: '/api/coordinator',
      student: '/api/student'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler - FIXED VERSION
app.use((req, res) => {
  res.status(404).json({ 
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /',
      'GET /api',
      'POST /api/auth/login',
      'POST /api/auth/create-admin',
      'GET /api/auth/verify'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Server running on port', PORT);
  console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
  console.log('🔗 Frontend URL:', process.env.CLIENT_URL || 'http://localhost:3000');
  console.log('📊 API Endpoints available at: http://localhost:' + PORT + '/api');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down server gracefully...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});

module.exports = app;
