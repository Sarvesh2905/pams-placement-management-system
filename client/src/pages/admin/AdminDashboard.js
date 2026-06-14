import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  CssBaseline,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  PersonAdd as PersonAddIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  Announcement as AnnouncementIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Import components
import AdminOverview from '../../components/admin/AdminOverview';
import AddStudent from '../../components/admin/AddStudent';
import ViewStudents from '../../components/admin/ViewStudents';
import AddCompany from '../../components/admin/AddCompany';
import ViewCompanies from '../../components/admin/ViewCompanies';
import AddCoordinator from '../../components/admin/AddCoordinator';
import ViewCoordinators from '../../components/admin/ViewCoordinators';
import AddAlumni from '../../components/admin/AddAlumni';
import PlacementAnnouncement from '../../components/admin/PlacementAnnouncement';
import NotificationManager from '../../components/admin/NotificationManager';

const drawerWidth = 280;

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Add Student', icon: <PersonAddIcon />, path: '/admin/add-student' },
    { text: 'View Students', icon: <PeopleIcon />, path: '/admin/view-students' },
    { text: 'Add Company', icon: <BusinessIcon />, path: '/admin/add-company' },
    { text: 'View Companies', icon: <BusinessIcon />, path: '/admin/view-companies' },
    { text: 'Add Coordinator', icon: <SchoolIcon />, path: '/admin/add-coordinator' },
    { text: 'View Coordinators', icon: <SchoolIcon />, path: '/admin/view-coordinators' },
    { text: 'Add Alumni', icon: <PeopleIcon />, path: '/admin/add-alumni' },
    { text: 'Placement Announcements', icon: <AnnouncementIcon />, path: '/admin/announcements' },
    { text: 'Notification Manager', icon: <NotificationsIcon />, path: '/admin/notifications' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: '#2d2d2d',
          borderBottom: '2px solid #FFD700',
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#FFD700', fontWeight: 'bold' }}>
            Admin Dashboard - Welcome, {user?.name}
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ color: '#FFD700' }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#2d2d2d',
            borderRight: '2px solid #FFD700',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #FFD700' }}>
          <Typography variant="h5" sx={{ color: '#FFD700', fontWeight: 'bold', textAlign: 'center' }}>
            PAMS
          </Typography>
          <Typography variant="body2" sx={{ color: '#cccccc', textAlign: 'center' }}>
            Placement Management
          </Typography>
        </Box>

        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  backgroundColor: location.pathname === item.path ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                  borderLeft: location.pathname === item.path ? '4px solid #FFD700' : '4px solid transparent',
                  '&:hover': { backgroundColor: 'rgba(255, 215, 0, 0.05)' },
                }}
              >
                <ListItemIcon sx={{ color: '#FFD700' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ color: '#ffffff' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#1a1a1a',
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
        }}
      >
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="/view-students" element={<ViewStudents />} />
          <Route path="/add-company" element={<AddCompany />} />
          <Route path="/view-companies" element={<ViewCompanies />} />
          <Route path="/add-coordinator" element={<AddCoordinator />} />
          <Route path="/view-coordinators" element={<ViewCoordinators />} />
          <Route path="/add-alumni" element={<AddAlumni />} />
          <Route path="/announcements" element={<PlacementAnnouncement />} />
          <Route path="/notifications" element={<NotificationManager />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
