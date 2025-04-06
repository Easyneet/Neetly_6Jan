import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Box,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

function Home() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('/api/subjects');
        setSubjects(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleSubjectClick = (subjectId) => {
    navigate(`/subject/${subjectId}`);
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
      <Typography variant="h1" component="h1" gutterBottom align="center">
        MCQ Test System
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom align="center" color="textSecondary">
        Select a subject to begin
      </Typography>
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {subjects.map((subject) => (
          <Grid item xs={12} sm={6} md={4} key={subject._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              <CardActionArea
                onClick={() => handleSubjectClick(subject._id)}
                sx={{ height: '100%' }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h4" component="h3" gutterBottom>
                    {subject.name}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {subject.description || 'Start learning and testing your knowledge'}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home; 