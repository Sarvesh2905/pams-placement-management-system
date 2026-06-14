import React from 'react';
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
  Person as PersonIcon,
  People as PeopleIcon,
  Announcement as AnnouncementIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Import components
import ViewProfile from '../../components/student/ViewProfile';
import ViewAlumni from '../../components/student/ViewAlumni';
import PlacementAnnouncements from '../../components/student/PlacementAnnouncements';
import Notifications from '../../components/student/Notifications';

const drawerWidth = 280;

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'View Profile', icon: <PersonIcon />, path: '/student' },
    { text: 'View Alumni', icon: <PeopleIcon />, path: '/student/alumni' },
    { text: 'Placement Announcements', icon: <AnnouncementIcon />, path: '/student/announcements' },
    { text: 'Notifications', icon: <NotificationsIcon />, path: '/student/notifications' },
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
            Student Dashboard - {user?.name} ({user?.department})
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
            Student Panel
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
          <Route path="/" element={<ViewProfile />} />
          <Route path="/alumni" element={<ViewAlumni />} />
          <Route path="/announcements" element={<PlacementAnnouncements />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default StudentDashboard;
