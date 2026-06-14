import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';

const ViewProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await studentService.getProfile();
      setProfile(response.data);
      setSkills(response.data.skills || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
      setAlert({
        open: true,
        message: 'Failed to load profile',
        severity: 'error'
      });
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await studentService.updateProfile({ skills });
      
      // Update local profile state
      setProfile(prev => ({ ...prev, skills }));
      
      setAlert({
        open: true,
        message: 'Skills updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setAlert({
        open: true,
        message: error.response?.data?.message || 'Failed to update skills',
        severity: 'error'
      });
    }
    setSubmitting(false);
  };

  if (loading || !profile) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography sx={{ color: '#ffffff' }}>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#FFD700', fontWeight: 'bold' }}>
        View Profile
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
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ color: '#ffffff', mb: 1 }}>
              <strong>Name:</strong> {profile.name}
            </Typography>
            <Typography variant="body1" sx={{ color: '#ffffff', mb: 1 }}>
              <strong>Register No:</strong> {profile.registerNumber}
            </Typography>
            <Typography variant="body1" sx={{ color: '#ffffff', mb: 1 }}>
              <strong>Roll No:</strong> {profile.rollNo}
            </Typography>
            <Typography variant="body1" sx={{ color: '#ffffff', mb: 1 }}>
              <strong>Email:</strong> {profile.email}
            </Typography>
            <Typography variant="body1" sx={{ color: '#ffffff', mb: 1 }}>
              <strong>Phone:</strong> {profile.phoneNo}
            </Typography>
            <Typography variant="body1" sx={{ color: '#ffffff', mb: 1 }}>
              <strong>Department:</strong> {profile.department}
            </Typography>
            <Typography variant="body1" sx={{ color: '#ffffff', mb: 1 }}>
              <strong>Batch:</strong> {profile.batch}
            </Typography>
            <Typography variant="body1" sx={{ color: '#ffffff', mb: 3 }}>
              <strong>CGPA:</strong> {profile.cgpa}
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Skills"
              placeholder="html, css, javascript, react, nodejs, python"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              multiline
              rows={3}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#1a1a1a',
                  '& fieldset': { borderColor: '#FFD700' },
                  '&:hover fieldset': { borderColor: '#FFD700' },
                  '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                },
                '& .MuiInputBase-input': { color: '#ffffff' },
                '& .MuiInputBase-input::placeholder': { color: '#cccccc', opacity: 1 },
                '& .MuiInputLabel-root': { color: '#cccccc' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#FFD700' },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={submitting}
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
              {submitting ? 'Updating...' : 'Submit'}
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

export default ViewProfile;
