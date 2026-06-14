import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
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

const years = ['All Years', '2021', '2022', '2023', '2024', '2025'];

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filters, setFilters] = useState({
    searchName: '',
    year: 'All Years',
    department: 'Information Technology',
  });
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState({ open: false, student: null });
  const [editForm, setEditForm] = useState({});
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, filters]);

  const fetchStudents = async () => {
    try {
      const response = await adminService.getStudents();
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
    setLoading(false);
  };

  const filterStudents = () => {
    let filtered = [...students];

    if (filters.searchName) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(filters.searchName.toLowerCase())
      );
    }

    if (filters.year !== 'All Years') {
      filtered = filtered.filter(student => student.year === parseInt(filters.year));
    }

    if (filters.department !== 'All Departments') {
      filtered = filtered.filter(student => student.department === filters.department);
    }

    setFilteredStudents(filtered);
  };

  const handleEdit = (student) => {
    setEditForm({ ...student });
    setEditDialog({ open: true, student });
  };

  const handleEditSubmit = async () => {
    try {
      await adminService.updateStudent(editForm._id, editForm);
      setAlert({
        open: true,
        message: 'Student updated successfully!',
        severity: 'success'
      });
      setEditDialog({ open: false, student: null });
      fetchStudents();
    } catch (error) {
      setAlert({
        open: true,
        message: 'Failed to update student',
        severity: 'error'
      });
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await adminService.deleteStudent(studentId);
        setAlert({
          open: true,
          message: 'Student deleted successfully!',
          severity: 'success'
        });
        fetchStudents();
      } catch (error) {
        setAlert({
          open: true,
          message: 'Failed to delete student',
          severity: 'error'
        });
      }
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Name', 'Roll No', 'Department', 'Email', 'Phone', 'CGPA'].join(','),
      ...filteredStudents.map(student =>
        [student.name, student.rollNo, student.department, student.email, student.phoneNo, student.cgpa].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#FFD700', fontWeight: 'bold' }}>
        View Students
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
        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search by Name"
            value={filters.searchName}
            onChange={(e) => setFilters(prev => ({ ...prev, searchName: e.target.value }))}
            sx={{
              minWidth: 250,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#1a1a1a',
                '& fieldset': { borderColor: '#FFD700' },
                '&:hover fieldset': { borderColor: '#FFD700' },
                '&.Mui-focused fieldset': { borderColor: '#FFD700' },
              },
              '& .MuiInputBase-input': { color: '#ffffff' },
              '& .MuiInputBase-input::placeholder': { color: '#cccccc', opacity: 1 },
            }}
          />

          <TextField
            select
            value={filters.year}
            onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
            sx={{
              minWidth: 150,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#1a1a1a',
                '& fieldset': { borderColor: '#FFD700' },
                '&:hover fieldset': { borderColor: '#FFD700' },
                '&.Mui-focused fieldset': { borderColor: '#FFD700' },
              },
            }}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            value={filters.department}
            onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
            sx={{
              minWidth: 250,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#1a1a1a',
                '& fieldset': { borderColor: '#FFD700' },
                '&:hover fieldset': { borderColor: '#FFD700' },
                '&.Mui-focused fieldset': { borderColor: '#FFD700' },
              },
            }}
          >
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Button
          onClick={handleExportCSV}
          variant="contained"
          sx={{
            backgroundColor: '#FFD700',
            color: '#000',
            mb: 3,
            '&:hover': { backgroundColor: '#FFA000' },
          }}
        >
          Export as CSV
        </Button>

        {/* Students Table */}
        <TableContainer sx={{ border: '1px solid #FFD700' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1a1a1a' }}>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Roll No</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Department</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>CGPA</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student._id} sx={{ '&:hover': { backgroundColor: '#424242' } }}>
                  <TableCell sx={{ color: '#ffffff' }}>{student.name}</TableCell>
                  <TableCell sx={{ color: '#ffffff' }}>{student.rollNo}</TableCell>
                  <TableCell sx={{ color: '#ffffff' }}>{student.department}</TableCell>
                  <TableCell sx={{ color: '#ffffff' }}>{student.cgpa}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEdit(student)}
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
                      onClick={() => handleDelete(student._id)}
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
        onClose={() => setEditDialog({ open: false, student: null })}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#2d2d2d',
            border: '2px solid #FFD700',
          }
        }}
      >
        <DialogTitle sx={{ color: '#FFD700' }}>Edit Student</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
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
              fullWidth
              label="CGPA"
              type="number"
              inputProps={{ min: 0, max: 10, step: 0.1 }}
              value={editForm.cgpa || ''}
              onChange={(e) => setEditForm(prev => ({ ...prev, cgpa: parseFloat(e.target.value) }))}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#1a1a1a',
                  '& fieldset': { borderColor: '#FFD700' },
                },
                '& .MuiInputLabel-root': { color: '#cccccc' },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, student: null })}>
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

export default ViewStudents;
