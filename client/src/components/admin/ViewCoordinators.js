import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
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

const ViewCoordinators = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState({ open: false, coordinator: null });
  const [editForm, setEditForm] = useState({});
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchCoordinators();
  }, []);

  const fetchCoordinators = async () => {
    try {
      const response = await adminService.getCoordinators();
      setCoordinators(response.data);
    } catch (error) {
      console.error('Error fetching coordinators:', error);
    }
    setLoading(false);
  };

  const handleEdit = (coordinator) => {
    setEditForm({ ...coordinator });
    setEditDialog({ open: true, coordinator });
  };

  const handleEditSubmit = async () => {
    try {
      await adminService.updateCoordinator(editForm._id, editForm);
      setAlert({
        open: true,
        message: 'Coordinator updated successfully!',
        severity: 'success'
      });
      setEditDialog({ open: false, coordinator: null });
      fetchCoordinators();
    } catch (error) {
      setAlert({
        open: true,
        message: 'Failed to update coordinator',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (coordinatorId) => {
    if (window.confirm('Are you sure you want to delete this coordinator?')) {
      try {
        await adminService.deleteCoordinator(coordinatorId);
        setAlert({
          open: true,
          message: 'Coordinator deleted successfully!',
          severity: 'success'
        });
        fetchCoordinators();
      } catch (error) {
        setAlert({
          open: true,
          message: 'Failed to delete coordinator',
          severity: 'error'
        });
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#FFD700', fontWeight: 'bold' }}>
        View Department Coordinators
      </Typography>

      <Paper
        elevation={6}
        sx={{
          p: 3,
          backgroundColor: '#2d2d2d',
          border: '2px solid #FFD700',
          borderRadius: '12px',
        }}
      >
        <TableContainer sx={{ border: '1px solid #FFD700' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1a1a1a' }}>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Department</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Phone</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coordinators.map((coordinator) => (
                <TableRow key={coordinator._id} sx={{ '&:hover': { backgroundColor: '#424242' } }}>
                  <TableCell sx={{ color: '#ffffff' }}>{coordinator.name}</TableCell>
                  <TableCell sx={{ color: '#ffffff' }}>{coordinator.email}</TableCell>
                  <TableCell sx={{ color: '#ffffff' }}>{coordinator.department}</TableCell>
                  <TableCell sx={{ color: '#ffffff' }}>{coordinator.phoneNo}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEdit(coordinator)}
                      sx={{
                        backgroundColor: '#FFD700',
                        color: '#000',
                        mr: 1,
                        '&:hover': { backgroundColor: '#FFA000' },
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(coordinator._id)}
                      sx={{
                        backgroundColor: '#f44336',
                        color: '#fff',
                        '&:hover': { backgroundColor: '#d32f2f' },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, coordinator: null })}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#2d2d2d',
            border: '2px solid #FFD700',
          }
        }}
      >
        <DialogTitle sx={{ color: '#FFD700' }}>Edit Coordinator</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            value={editForm.name || ''}
            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#1a1a1a',
                '& fieldset': { borderColor: '#FFD700' },
              },
              '& .MuiInputLabel-root': { color: '#cccccc' },
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            value={editForm.email || ''}
            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#1a1a1a',
                '& fieldset': { borderColor: '#FFD700' },
              },
              '& .MuiInputLabel-root': { color: '#cccccc' },
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone"
            value={editForm.phoneNo || ''}
            onChange={(e) => setEditForm(prev => ({ ...prev, phoneNo: e.target.value }))}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#1a1a1a',
                '& fieldset': { borderColor: '#FFD700' },
              },
              '& .MuiInputLabel-root': { color: '#cccccc' },
            }}
          />
          <TextField
            select
            fullWidth
            margin="normal"
            label="Department"
            value={editForm.department || ''}
            onChange={(e) => setEditForm(prev => ({ ...prev, department: e.target.value }))}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#1a1a1a',
                '& fieldset': { borderColor: '#FFD700' },
              },
              '& .MuiInputLabel-root': { color: '#cccccc' },
            }}
          >
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, coordinator: null })}>
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} sx={{ color: '#FFD700' }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

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

export default ViewCoordinators;
