import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  CircularProgress,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  CheckCircle as CorrectIcon,
  Cancel as IncorrectIcon,
  Refresh as RetakeIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import axios from 'axios';

function TestResults() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const { testId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`/api/tests/results/${testId}`);
        setResults(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching test results:', error);
        setLoading(false);
      }
    };

    fetchResults();
  }, [testId]);

  const handleRetakeTest = () => {
    navigate(`/test/${results.testId}`);
  };

  const handleViewHistory = () => {
    navigate('/history');
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

  const score = ((results.correctAnswers / results.totalQuestions) * 100).toFixed(1);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Test Results
        </Typography>
        <Divider sx={{ my: 3 }} />

        {/* Score Summary */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h3" color="primary">
                {score}%
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Overall Score
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Total Questions"
                    secondary={results.totalQuestions}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Correct Answers"
                    secondary={results.correctAnswers}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Incorrect Answers"
                    secondary={results.totalQuestions - results.correctAnswers}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Question Review */}
        <Typography variant="h5" gutterBottom>
          Question Review
        </Typography>
        <List>
          {results.questions.map((question, index) => (
            <Paper key={index} elevation={1} sx={{ mb: 2 }}>
              <ListItem>
                <ListItemIcon>
                  {question.isCorrect ? (
                    <CorrectIcon color="success" />
                  ) : (
                    <IncorrectIcon color="error" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1">
                      {index + 1}. {question.questionText}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="textSecondary">
                      Your answer: {question.selectedAnswer || 'Not attempted'}
                      {!question.isCorrect && (
                        <Typography component="span" color="error">
                          {' '}
                          (Correct answer: {question.correctAnswer})
                        </Typography>
                      )}
                    </Typography>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>

        {/* Action Buttons */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<RetakeIcon />}
            onClick={handleRetakeTest}
          >
            Retake Test
          </Button>
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={handleViewHistory}
          >
            View History
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default TestResults; 