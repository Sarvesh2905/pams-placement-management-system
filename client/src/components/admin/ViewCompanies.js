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
  Alert,
  Snackbar,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { adminService } from '../../services/adminService';

const ViewCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState({ open: false, company: null });
  const [editForm, setEditForm] = useState({});
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await adminService.getCompanies();
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
    setLoading(false);
  };

  const handleEdit = (company) => {
    setEditForm({ ...company });
    setEditDialog({ open: true, company });
  };

  const handleEditSubmit = async () => {
    try {
      await adminService.updateCompany(editForm._id, editForm);
      setAlert({
        open: true,
        message: 'Company updated successfully!',
        severity: 'success'
      });
      setEditDialog({ open: false, company: null });
      fetchCompanies();
    } catch (error) {
      setAlert({
        open: true,
        message: 'Failed to update company',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await adminService.deleteCompany(companyId);
        setAlert({
          open: true,
          message: 'Company deleted successfully!',
          severity: 'success'
        });
        fetchCompanies();
      } catch (error) {
        setAlert({
          open: true,
          message: 'Failed to delete company',
          severity: 'error'
        });
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#FFD700', fontWeight: 'bold' }}>
        View Companies
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
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Company Name</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Location</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>HR Name</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>HR Email</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company._id} sx={{ '&:hover': { backgroundColor: '#424242' } }}>
                  <TableCell sx={{ color: '#ffffff' }}>{company.name}</TableCell>
                  <TableCell sx={{ color: '#ffffff' }}>{company.location}</TableCell>
                  <TableCell sx={{ color: '#ffffff' }}>{company.hrName}</TableCell>
                  <TableCell sx={{ color: '#ffffff' }}>{company.hrEmail}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEdit(company)}
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
                      onClick={() => handleDelete(company._id)}
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
        onClose={() => setEditDialog({ open: false, company: null })}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#2d2d2d',
            border: '2px solid #FFD700',
          }
        }}
      >
        <DialogTitle sx={{ color: '#FFD700' }}>Edit Company</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Company Name"
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
            label="Location"
            value={editForm.location || ''}
            onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
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
            label="HR Name"
            value={editForm.hrName || ''}
            onChange={(e) => setEditForm(prev => ({ ...prev, hrName: e.target.value }))}
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
            label="HR Contact"
            value={editForm.hrContact || ''}
            onChange={(e) => setEditForm(prev => ({ ...prev, hrContact: e.target.value }))}
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
            label="HR Email"
            value={editForm.hrEmail || ''}
            onChange={(e) => setEditForm(prev => ({ ...prev, hrEmail: e.target.value }))}
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
            label="Website"
            value={editForm.website || ''}
            onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#1a1a1a',
                '& fieldset': { borderColor: '#FFD700' },
              },
              '& .MuiInputLabel-root': { color: '#cccccc' },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, company: null })}>
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

export default ViewCompanies;
