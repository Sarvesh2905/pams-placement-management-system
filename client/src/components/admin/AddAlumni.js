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

const AddAlumni = () => {
  const [formData, setFormData] = useState({
    year: '',
    department: '',
    name: '',
    currentRole: '',
    linkedinProfile: '',
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
      await adminService.addAlumni(formData);
      setAlert({
        open: true,
        message: 'Alumni added successfully!',
        severity: 'success'
      });
      setFormData({
        year: '',
        department: '',
        name: '',
        currentRole: '',
        linkedinProfile: '',
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.response?.data?.message || 'Failed to add alumni',
        severity: 'error'
      });
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#FFD700', fontWeight: 'bold' }}>
        Add Alumni
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
            Alumni Information
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
              <TextField
                name="year"
                label="Graduation Year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                required
                sx={{
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
                name="department"
                label="Department"
                value={formData.department}
                onChange={handleChange}
                required
                sx={{
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
            </Box>

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
              name="currentRole"
              label="Current Role"
              placeholder="Software Engineer at Google"
              value={formData.currentRole}
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
              name="linkedinProfile"
              label="LinkedIn Profile"
              placeholder="https://linkedin.com/in/username"
              value={formData.linkedinProfile}
              onChange={handleChange}
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
              {loading ? 'Adding Alumni...' : 'Add Alumni'}
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

export default AddAlumni;
