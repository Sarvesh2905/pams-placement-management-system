import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Button,
  Link,
} from '@mui/material';
import { LinkedIn } from '@mui/icons-material';
import { studentService } from '../../services/studentService';

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

const years = ['All Years', '2020', '2021', '2022', '2023', '2024'];

const ViewAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [filteredAlumni, setFilteredAlumni] = useState([]);
  const [filters, setFilters] = useState({
    year: 'All Years',
    department: 'All Departments',
    searchName: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlumni();
  }, []);

  useEffect(() => {
    filterAlumni();
  }, [alumni, filters]);

  const fetchAlumni = async () => {
    try {
      const response = await studentService.getAlumni();
      setAlumni(response.data);
    } catch (error) {
      console.error('Error fetching alumni:', error);
    }
    setLoading(false);
  };

  const filterAlumni = () => {
    let filtered = [...alumni];

    if (filters.year !== 'All Years') {
      filtered = filtered.filter(alum => alum.year === parseInt(filters.year));
    }

    if (filters.department !== 'All Departments') {
      filtered = filtered.filter(alum => alum.department === filters.department);
    }

    if (filters.searchName) {
      filtered = filtered.filter(alum =>
        alum.name.toLowerCase().includes(filters.searchName.toLowerCase())
      );
    }

    setFilteredAlumni(filtered);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#FFD700', fontWeight: 'bold' }}>
        Alumni Directory
      </Typography>

      <Paper
        elevation={6}
        sx={{
          p: 3,
          backgroundColor: '#2d2d2d',
          border: '2px solid #FFD700',
          borderRadius: '12px',
          mb: 3,
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
            label="Filter by Year"
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

          <TextField
            select
            label="Filter by Department"
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
              '& .MuiInputLabel-root': { color: '#cccccc' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#FFD700' },
            }}
          >
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Typography variant="body2" sx={{ color: '#cccccc' }}>
          Showing {filteredAlumni.length} of {alumni.length} alumni
        </Typography>
      </Paper>

      {loading ? (
        <Typography sx={{ color: '#ffffff', textAlign: 'center' }}>
          Loading alumni...
        </Typography>
      ) : filteredAlumni.length === 0 ? (
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
            No alumni found matching your filters
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredAlumni.map((alum) => (
            <Grid item xs={12} sm={6} md={4} key={alum._id}>
              <Card
                sx={{
                  backgroundColor: '#2d2d2d',
                  border: '1px solid #FFD700',
                  borderRadius: '12px',
                  height: '100%',
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#FFD700', mb: 1, fontWeight: 'bold' }}>
                    {alum.name}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ color: '#ffffff', mb: 1 }}>
                    <strong>Year:</strong> {alum.year}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ color: '#ffffff', mb: 1 }}>
                    <strong>Department:</strong> {alum.department}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ color: '#ffffff', mb: 2 }}>
                    <strong>Current Role:</strong> {alum.currentRole}
                  </Typography>

                  {alum.linkedinProfile && (
                    <Link
                      href={alum.linkedinProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#FFD700',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      <LinkedIn sx={{ mr: 1 }} />
                      LinkedIn Profile
                    </Link>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ViewAlumni;
