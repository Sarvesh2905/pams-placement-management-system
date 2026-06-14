import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';
import { adminService } from '../../services/adminService';

const AddCompany = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    hrName: '',
    hrContact: '',
    hrEmail: '',
    website: '',
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
      await adminService.addCompany(formData);
      setAlert({
        open: true,
        message: 'Company added successfully!',
        severity: 'success'
      });
      setFormData({
        name: '',
        location: '',
        hrName: '',
        hrContact: '',
        hrEmail: '',
        website: '',
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.response?.data?.message || 'Failed to add company',
        severity: 'error'
      });
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#FFD700', fontWeight: 'bold' }}>
        Add New Company
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
            Company Information
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              name="name"
              label="Company Name"
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
              name="location"
              label="Location"
              value={formData.location}
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
              name="hrName"
              label="HR Name"
              value={formData.hrName}
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
              name="hrContact"
              label="HR Contact"
              value={formData.hrContact}
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
              name="hrEmail"
              label="HR Email"
              type="email"
              value={formData.hrEmail}
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
              name="website"
              label="Website"
              placeholder="https://company.com"
              value={formData.website}
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
              {loading ? 'Adding Company...' : 'Add Company'}
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

export default AddCompany;
