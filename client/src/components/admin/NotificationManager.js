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
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
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

const NotificationManager = () => {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    targetAudience: 'students',
    targetDepartments: [],
    targetYear: '',
    scheduledAt: dayjs(),
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
      targetDepartments: selectedDepts
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminService.sendNotification({
        ...formData,
        scheduledAt: formData.scheduledAt.toISOString()
      });
      setAlert({
        open: true,
        message: 'Notification sent successfully!',
        severity: 'success'
      });
      setFormData({
        title: '',
        body: '',
        targetAudience: 'students',
        targetDepartments: [],
        targetYear: '',
        scheduledAt: dayjs(),
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.response?.data?.message || 'Failed to send notification',
        severity: 'error'
      });
    }
    setLoading(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, color: '#FFD700', fontWeight: 'bold' }}>
          Notification Manager
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
              Send Notification
            </Typography>

            <form onSubmit={handleSubmit}>
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
                <InputLabel>Target Audience</InputLabel>
                <Select
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  label="Target Audience"
                >
                  <MenuItem value="students">Students</MenuItem>
                  <MenuItem value="coordinators">Coordinators</MenuItem>
                  <MenuItem value="all">All</MenuItem>
                </Select>
              </FormControl>

              {formData.targetAudience === 'students' && (
                <TextField
                  fullWidth
                  margin="normal"
                  name="targetYear"
                  type="number"
                  label="Target Year (optional)"
                  value={formData.targetYear}
                  onChange={handleChange}
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
              )}

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
                <InputLabel>Departments (optional)</InputLabel>
                <Select
                  multiple
                  name="targetDepartments"
                  value={formData.targetDepartments}
                  onChange={handleDepartmentChange}
                  input={<OutlinedInput label="Departments (optional)" />}
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
                name="title"
                label="Notification Title"
                value={formData.title}
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
                name="body"
                label="Notification Body"
                multiline
                rows={4}
                value={formData.body}
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

              <DateTimePicker
                label="Schedule Time"
                value={formData.scheduledAt}
                onChange={(newValue) => setFormData(prev => ({ ...prev, scheduledAt: newValue }))}
                sx={{
                  width: '100%',
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
                {loading ? 'Sending...' : 'Send Notification'}
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
    </LocalizationProvider>
  );
};

export default NotificationManager;
