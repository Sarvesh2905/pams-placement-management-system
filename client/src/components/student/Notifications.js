import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
} from '@mui/material';
import { studentService } from '../../services/studentService';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await studentService.getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
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
        Notifications
      </Typography>

      {loading ? (
        <Typography sx={{ color: '#ffffff', textAlign: 'center' }}>
          Loading notifications...
        </Typography>
      ) : notifications.length === 0 ? (
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
            No notifications available
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {notifications.map((notification) => (
            <Grid item xs={12} key={notification._id}>
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
                    {notification.title}
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

                <Typography variant="body1" sx={{ color: '#ffffff', mb: 2, lineHeight: 1.6 }}>
                  {notification.body}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    label={`Target: ${notification.targetAudience}`}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(33, 150, 243, 0.2)',
                      color: '#2196F3',
                      border: '1px solid #2196F3',
                    }}
                  />
                  {notification.targetDepartments && notification.targetDepartments.length > 0 && (
                    <Chip
                      label={`Departments: ${notification.targetDepartments.length}`}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255, 152, 0, 0.2)',
                        color: '#FF9800',
                        border: '1px solid #FF9800',
                      }}
                    />
                  )}
                  {notification.targetYear && (
                    <Chip
                      label={`Year: ${notification.targetYear}`}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(156, 39, 176, 0.2)',
                        color: '#9C27B0',
                        border: '1px solid #9C27B0',
                      }}
                    />
                  )}
                </Box>

                <Typography variant="body2" sx={{ color: '#cccccc' }}>
                  Sent on: {formatDate(notification.createdAt)}
                </Typography>
                {notification.sentBy && (
                  <Typography variant="body2" sx={{ color: '#cccccc' }}>
                    By: {notification.sentBy.name}
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Notifications;
