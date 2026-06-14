import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import { adminService } from '../../services/adminService';

const departments = [
  'Artificial Intelligence & Data Science',
  'Biomedical Engineering',
  'Civil Engineering',
  'Computer Science & Engineering',
  'Computer Science & Engineering (Cyber Security Specialization)',
  'Computer Science and Business Systems',
  'Electrical & Electronics Engineering',
  'Electronics & Communication Engineering',
  'Information Technology',
  'Mechanical Engineering',
];

const AddCoordinator = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNo: '',
    department: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminService.addCoordinator(formData);
      setAlert({
        open: true,
        message: 'Coordinator added successfully!',
        severity: 'success'
      });
      setFormData({
        name: '',
        email: '',
        phoneNo: '',
        department: '',
        password: '',
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.response?.data?.message || 'Failed to add coordinator',
        severity: 'error'
      });
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#FFD700', fontWeight: 'bold' }}>
        Add Department Coordinator
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            maxWidth: 600,
            width: '100%',
            backgroundColor: '#2d2d2d',
            border: '2px solid #FFD700',
            borderRadius: '12px',
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, color: '#FFD700', textAlign: 'center' }}>
            Coordinator Information
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#1a1a1a',
                  '& fieldset': { borderColor: '#FFD700' },
                  '&:hover fieldset': { borderColor: '#FFD700' },
                  '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                },
                '& .MuiInputLabel-root': { color: '#cccccc' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#FFD700' },
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#1a1a1a',
                  '& fieldset': { borderColor: '#FFD700' },
                  '&:hover fieldset': { borderColor: '#FFD700' },
                  '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                },
                '& .MuiInputLabel-root': { color: '#cccccc' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#FFD700' },
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              name="phoneNo"
              label="Phone Number"
              value={formData.phoneNo}
              onChange={handleChange}
              required
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#1a1a1a',
                  '& fieldset': { borderColor: '#FFD700' },
                  '&:hover fieldset': { borderColor: '#FFD700' },
                  '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                },
                '& .MuiInputLabel-root': { color: '#cccccc' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#FFD700' },
              }}
            />

            <TextField
              select
              fullWidth
              margin="normal"
              name="department"
              label="Department"
              value={formData.department}
              onChange={handleChange}
              required
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#1a1a1a',
                  '& fieldset': { borderColor: '#FFD700' },
                  '&:hover fieldset': { borderColor: '#FFD700' },
                  '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                },
                '& .MuiInputLabel-root': { color: '#cccccc' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#FFD700' },
              }}
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              margin="normal"
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Leave empty to use email prefix as password"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#1a1a1a',
                  '& fieldset': { borderColor: '#FFD700' },
                  '&:hover fieldset': { borderColor: '#FFD700' },
                  '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                },
                '& .MuiInputLabel-root': { color: '#cccccc' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#FFD700' },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: '#FFD700',
                color: '#000',
                fontSize: '16px',
                fontWeight: 'bold',
                py: 1.5,
                '&:hover': { backgroundColor: '#FFA000' },
                '&:disabled': { backgroundColor: '#666' },
              }}
            >
              {loading ? 'Adding Coordinator...' : 'Add Coordinator'}
            </Button>
          </form>
        </Paper>
      </Box>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setAlert(prev => ({ ...prev, open: false }))}
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddCoordinator;
