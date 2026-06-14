import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
} from '@mui/material';
import { coordinatorService } from '../../services/coordinatorService';

const PlacementAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await coordinatorService.getPlacementAnnouncements();
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#FFD700', fontWeight: 'bold' }}>
        Placement Announcements
      </Typography>

      {loading ? (
        <Typography sx={{ color: '#ffffff', textAlign: 'center' }}>
          Loading announcements...
        </Typography>
      ) : announcements.length === 0 ? (
        <Paper
          elevation={6}
          sx={{
            p: 4,
            backgroundColor: '#2d2d2d',
            border: '1px solid #FFD700',
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" sx={{ color: '#cccccc' }}>
            No placement announcements available for your department
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {announcements.map((announcement) => (
            <Grid item xs={12} key={announcement._id}>
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  backgroundColor: '#2d2d2d',
                  border: '1px solid #FFD700',
                  borderRadius: '12px',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h5" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                    {announcement.companyName}
                  </Typography>
                  <Chip
                    label="New"
                    sx={{
                      backgroundColor: '#4CAF50',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ color: '#ffffff', mb: 1 }}>
                      <strong>Role:</strong> {announcement.role}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#ffffff', mb: 1 }}>
                      <strong>Package:</strong> {announcement.package} LPA
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#ffffff', mb: 1 }}>
                      <strong>Batch:</strong> {announcement.batch}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ color: '#ffffff', mb: 1 }}>
                      <strong>Departments:</strong>
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {announcement.departments.map((dept, index) => (
                        <Chip
                          key={index}
                          label={dept}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(255, 215, 0, 0.2)',
                            color: '#FFD700',
                            border: '1px solid #FFD700',
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>
                </Grid>

                <Typography variant="body1" sx={{ color: '#ffffff', mb: 2 }}>
                  <strong>Placed Students:</strong>
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {announcement.students.map((student, index) => (
                    <Chip
                      key={index}
                      label={student}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(76, 175, 80, 0.2)',
                        color: '#4CAF50',
                        border: '1px solid #4CAF50',
                      }}
                    />
                  ))}
                </Box>

                <Typography variant="body2" sx={{ color: '#cccccc', mt: 2 }}>
                  Announced on: {formatDate(announcement.createdAt)}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PlacementAnnouncements;
