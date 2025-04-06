import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  CircularProgress,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Send as SubmitIcon } from '@mui/icons-material';
import axios from 'axios';

function TestView() {
  const [testData, setTestData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { testId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const response = await axios.get(`/api/tests/${testId}`);
        setTestData(response.data);
        setTimeLeft(response.data.timeLimit * 60); // Convert minutes to seconds
        setLoading(false);
      } catch (error) {
        console.error('Error fetching test data:', error);
        setLoading(false);
      }
    };

    fetchTestData();
  }, [testId]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`/api/tests/${testId}/submit`, {
        answers,
      });
      navigate(`/results/${response.data.testAttemptId}`);
    } catch (error) {
      console.error('Error submitting test:', error);
    }
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Timer */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 3,
          position: 'sticky',
          top: 20,
          zIndex: 1000,
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="h6" align="center">
          Time Remaining: {formatTime(timeLeft)}
        </Typography>
      </Paper>

      {/* Questions */}
      {testData?.questions.map((question, index) => (
        <Paper key={question._id} elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {index + 1}. {question.questionText}
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              value={answers[question._id] || ''}
              onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            >
              {Object.entries(question.options).map(([key, value]) => (
                <FormControlLabel
                  key={key}
                  value={key}
                  control={<Radio />}
                  label={value}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>
      ))}

      {/* Submit Button */}
      <Fab
        color="primary"
        variant="extended"
        onClick={() => setShowConfirmDialog(true)}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
        }}
      >
        <SubmitIcon sx={{ mr: 1 }} />
        Submit Test
      </Fab>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
      >
        <DialogTitle>Submit Test?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit your test? You cannot change your answers after submission.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default TestView; 