import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  Group as GroupIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Announcement as AnnouncementIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { adminService } from '../../services/adminService';

const StatCard = ({ title, value, icon, color, loading = false }) => (
  <Card
    sx={{
      backgroundColor: '#2d2d2d',
      border: '1px solid #FFD700',
      borderRadius: '12px',
      height: '140px',
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" sx={{ color: '#FFD700', mb: 1 }}>
            {title}
          </Typography>
          {loading ? (
            <CircularProgress size={24} sx={{ color: '#FFD700' }} />
          ) : (
            <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
              {value}
            </Typography>
          )}
        </Box>
        <Box sx={{ color: color || '#FFD700', fontSize: '48px' }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    totalCoordinators: 0,
    totalAlumni: 0,
    totalAnnouncements: 0,
    totalNotifications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    
    // Refresh stats every 30 seconds for real-time updates
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Safely fetch data with fallbacks
      const studentsRes = await adminService.getStudents().catch(() => ({ data: [] }));
      const companiesRes = await adminService.getCompanies().catch(() => ({ data: [] }));
      const coordinatorsRes = await adminService.getCoordinators().catch(() => ({ data: [] }));
      const alumniRes = await adminService.getAlumni().catch(() => ({ data: [] }));
      const announcementsRes = await adminService.getPlacementAnnouncements().catch(() => ({ data: [] }));
      const notificationsRes = await adminService.getNotifications().catch(() => ({ data: [] }));
      
      // Set real-time stats from database
      setStats({
        totalStudents: studentsRes.data?.length || 0,
        totalCompanies: companiesRes.data?.length || 0,
        totalCoordinators: coordinatorsRes.data?.length || 0,
        totalAlumni: alumniRes.data?.length || 0,
        totalAnnouncements: announcementsRes.data?.length || 0,
        totalNotifications: notificationsRes.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Keep default values if error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: '#cccccc' }}>
          Last updated: {new Date().toLocaleTimeString()}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={<GroupIcon fontSize="inherit" />}
            color="#4CAF50"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Companies"
            value={stats.totalCompanies}
            icon={<BusinessIcon fontSize="inherit" />}
            color="#2196F3"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Coordinators"
            value={stats.totalCoordinators}
            icon={<SchoolIcon fontSize="inherit" />}
            color="#FF9800"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Alumni"
            value={stats.totalAlumni}
            icon={<PeopleIcon fontSize="inherit" />}
            color="#9C27B0"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Announcements"
            value={stats.totalAnnouncements}
            icon={<AnnouncementIcon fontSize="inherit" />}
            color="#F44336"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Notifications"
            value={stats.totalNotifications}
            icon={<NotificationsIcon fontSize="inherit" />}
            color="#00BCD4"
            loading={loading}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminOverview;
