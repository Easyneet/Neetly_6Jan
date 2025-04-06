import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  TextField,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';
import axios from 'axios';

function AdminDashboard() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [stats, setStats] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setMessage({ type: '', text: '' });
    } else {
      setMessage({
        type: 'error',
        text: 'Please select a valid CSV file',
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({
        type: 'error',
        text: 'Please select a file first',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const response = await axios.post('/api/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage({
        type: 'success',
        text: 'Content uploaded successfully',
      });
      setFile(null);
      setStats(response.data.stats);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error uploading content',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={4}>
        {/* Upload Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upload Content
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="textSecondary" paragraph>
                Upload a CSV file with the following columns:
              </Typography>
              <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                1. Subject<br />
                2. Chapter<br />
                3. Page Number<br />
                4. Question Text<br />
                5. Option A<br />
                6. Option B<br />
                7. Option C<br />
                8. Option D<br />
                9. Correct Answer<br />
                10. Notes Content
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <input
                accept=".csv"
                style={{ display: 'none' }}
                id="csv-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="csv-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<UploadIcon />}
                >
                  Select CSV File
                </Button>
              </label>
              {file && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected file: {file.name}
                </Typography>
              )}
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={!file || uploading}
              fullWidth
            >
              {uploading ? <CircularProgress size={24} /> : 'Upload Content'}
            </Button>

            {message.text && (
              <Alert severity={message.type} sx={{ mt: 2 }}>
                {message.text}
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Stats Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Statistics
            </Typography>
            {stats ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Metric</TableCell>
                      <TableCell align="right">Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Total Subjects</TableCell>
                      <TableCell align="right">{stats.totalSubjects}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Chapters</TableCell>
                      <TableCell align="right">{stats.totalChapters}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Questions</TableCell>
                      <TableCell align="right">{stats.totalQuestions}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Test Attempts</TableCell>
                      <TableCell align="right">{stats.totalTestAttempts}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="textSecondary">
                Upload content to view statistics
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminDashboard; 