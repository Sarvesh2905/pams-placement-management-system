import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Alert,
  Snackbar,
} from '@mui/material';
import { adminService } from '../../services/adminService';

const departments = [
  'All Departments',
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

const PlacementAnnouncement = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    departments: [],
    students: '',
    role: '',
    package: '',
    batch: '',
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleDepartmentChange = (event) => {
    const value = event.target.value;
    let selectedDepts = typeof value === 'string' ? value.split(',') : value;
    
    // If "All Departments" is selected, select all departments except "All Departments" itself
    if (selectedDepts.includes('All Departments')) {
      selectedDepts = departments.filter(dept => dept !== 'All Departments');
    }
    
    setFormData(prev => ({
      ...prev,
      departments: selectedDepts
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const announcementData = {
        ...formData,
        students: formData.students.split(',').map(s => s.trim()),
        package: parseFloat(formData.package)
      };

      await adminService.announcePlacement(announcementData);
      setAlert({
        open: true,
        message: 'Placement announced successfully!',
        severity: 'success'
      });
      setFormData({
        companyName: '',
        departments: [],
        students: '',
        role: '',
        package: '',
        batch: '',
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.response?.data?.message || 'Failed to announce placement',
        severity: 'error'
      });
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#FFD700', fontWeight: 'bold' }}>
        Announce Placements
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
            Placement Announcement
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              name="companyName"
              label="Company Name"
              value={formData.companyName}
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

            <FormControl
              fullWidth
              margin="normal"
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
              <InputLabel>Departments</InputLabel>
              <Select
                multiple
                name="departments"
                value={formData.departments}
                onChange={handleDepartmentChange}
                input={<OutlinedInput label="Departments" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.length === departments.length - 1 ? (
                      <Chip
                        label="All Departments"
                        sx={{ backgroundColor: '#FFD700', color: '#000' }}
                      />
                    ) : (
                      selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          sx={{ backgroundColor: '#FFD700', color: '#000' }}
                        />
                      ))
                    )}
                  </Box>
                )}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              name="students"
              label="Students (comma separated)"
              value={formData.students}
              onChange={handleChange}
              required
              placeholder="John Doe, Jane Smith, Bob Johnson"
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
              name="role"
              label="Role/Position"
              value={formData.role}
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
              name="package"
              type="number"
              label="Package (LPA)"
              value={formData.package}
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
              name="batch"
              label="Batch"
              value={formData.batch}
              onChange={handleChange}
              required
              placeholder="2023-2027"
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
              {loading ? 'Announcing...' : 'Announce Placement'}
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

export default PlacementAnnouncement;
