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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { coordinatorService } from '../../services/coordinatorService';

const years = ['All Years', '2021', '2022', '2023', '2024', '2025'];

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(true);
  const [cgpaDialog, setCgpaDialog] = useState({ open: false, student: null, cgpa: '' });
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchStudents();
  }, [selectedYear]);

  useEffect(() => {
    filterStudents();
  }, [students, searchName]);

  const fetchStudents = async () => {
    try {
      const yearParam = selectedYear === 'All Years' ? 'all' : selectedYear;
      const response = await coordinatorService.getStudents(yearParam);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      setAlert({
        open: true,
        message: 'Failed to fetch students',
        severity: 'error'
      });
    }
    setLoading(false);
  };

  const filterStudents = () => {
    let filtered = [...students];

    if (searchName) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchName.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  };

  const handleUpdateCGPA = (student) => {
    setCgpaDialog({ 
      open: true, 
      student, 
      cgpa: student.cgpa?.toString() || '' 
    });
  };

  const handleCGPASubmit = async () => {
    try {
      const { student, cgpa } = cgpaDialog;
      
      if (!cgpa || cgpa < 0 || cgpa > 10) {
        setAlert({
          open: true,
          message: 'Please enter a valid CGPA between 0 and 10',
          severity: 'error'
        });
        return;
      }

      await coordinatorService.updateStudentCGPA(student._id, parseFloat(cgpa));
      
      setAlert({
        open: true,
        message: 'CGPA updated successfully!',
        severity: 'success'
      });
      
      setCgpaDialog({ open: false, student: null, cgpa: '' });
      fetchStudents(); // Refresh the data
    } catch (error) {
      console.error('Error updating CGPA:', error);
      setAlert({
        open: true,
        message: error.response?.data?.message || 'Failed to update CGPA',
        severity: 'error'
      });
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Name', 'Roll No', 'Year', 'Email', 'Phone', 'CGPA'].join(','),
      ...filteredStudents.map(student =>
        [
          student.name,
          student.rollNo,
          student.year,
          student.email,
          student.phoneNo,
          student.cgpa || 'N/A'
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_${selectedYear}_${new Date().getTime()}.csv`;
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
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Search by Name or Roll No"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
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
            label="Filter by Year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            sx={{
              minWidth: 150,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#1a1a1a',
                '& fieldset': { borderColor: '#FFD700' },
                '&:hover fieldset': { borderColor: '#FFD700' },
                '&.Mui-focused fieldset': { borderColor: '#FFD700' },
              },
              '& .MuiInputLabel-root': { color: '#cccccc' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#FFD700' },
            }}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>

          <Button
            onClick={handleExportCSV}
            variant="contained"
            sx={{
              backgroundColor: '#FFD700',
              color: '#000',
              '&:hover': { backgroundColor: '#FFA000' },
            }}
          >
            Export CSV
          </Button>
        </Box>

        {/* Students Table */}
        <TableContainer sx={{ border: '1px solid #FFD700' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1a1a1a' }}>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Roll No</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Year</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>CGPA</TableCell>
                <TableCell sx={{ color: '#FFD700', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ color: '#ffffff', textAlign: 'center', py: 4 }}>
                    {loading ? 'Loading students...' : 'No students found'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student._id} sx={{ '&:hover': { backgroundColor: '#424242' } }}>
                    <TableCell sx={{ color: '#ffffff' }}>{student.name}</TableCell>
                    <TableCell sx={{ color: '#ffffff' }}>{student.rollNo}</TableCell>
                    <TableCell sx={{ color: '#ffffff' }}>{student.year}</TableCell>
                    <TableCell sx={{ color: '#ffffff' }}>{student.cgpa || 'Not Set'}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleUpdateCGPA(student)}
                        sx={{
                          backgroundColor: '#FFD700',
                          color: '#000',
                          '&:hover': { backgroundColor: '#FFA000' },
                        }}
                      >
                        Update CGPA
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Summary */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ color: '#cccccc' }}>
            Showing {filteredStudents.length} of {students.length} students
          </Typography>
          <Typography sx={{ color: '#cccccc' }}>
            {selectedYear !== 'All Years' ? `Year: ${selectedYear}` : 'All Years'}
          </Typography>
        </Box>
      </Paper>

      {/* CGPA Update Dialog */}
      <Dialog
        open={cgpaDialog.open}
        onClose={() => setCgpaDialog({ open: false, student: null, cgpa: '' })}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#2d2d2d',
            border: '2px solid #FFD700',
          }
        }}
      >
        <DialogTitle sx={{ color: '#FFD700' }}>
          Update CGPA - {cgpaDialog.student?.name}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#ffffff', mb: 2 }}>
            Roll No: {cgpaDialog.student?.rollNo}
          </Typography>
          <Typography sx={{ color: '#ffffff', mb: 2 }}>
            Current CGPA: {cgpaDialog.student?.cgpa || 'Not Set'}
          </Typography>
          <TextField
            fullWidth
            label="New CGPA"
            type="number"
            inputProps={{ min: 0, max: 10, step: 0.01 }}
            value={cgpaDialog.cgpa}
            onChange={(e) => setCgpaDialog(prev => ({ ...prev, cgpa: e.target.value }))}
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#1a1a1a',
                '& fieldset': { borderColor: '#FFD700' },
              },
              '& .MuiInputLabel-root': { color: '#cccccc' },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setCgpaDialog({ open: false, student: null, cgpa: '' })}
            sx={{ color: '#ffffff' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCGPASubmit}
            variant="contained"
            sx={{ 
              backgroundColor: '#FFD700', 
              color: '#000',
              '&:hover': { backgroundColor: '#FFA000' }
            }}
          >
            Update CGPA
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
