import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { PlayArrow as StartTestIcon } from '@mui/icons-material';
import axios from 'axios';

function PageView() {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { pageId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await axios.get(`/api/pages/${pageId}`);
        setPageData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching page data:', error);
        setLoading(false);
      }
    };

    fetchPageData();
  }, [pageId]);

  const handleStartTest = () => {
    navigate(`/test/${pageId}`);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Study Notes Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Study Notes
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-line' }}>
              {pageData?.notes}
            </Typography>
          </Paper>
        </Grid>

        {/* MCQs Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Practice Questions
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" color="textSecondary" paragraph>
                This page has {pageData?.questions?.length || 0} multiple choice questions.
                Test your knowledge by attempting these questions.
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<StartTestIcon />}
              onClick={handleStartTest}
              fullWidth
              sx={{ mt: 2 }}
            >
              Start Test
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default PageView; 