import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Box,
  LinearProgress,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Book as BookIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
} from '@mui/icons-material';
import axios from 'axios';

function SubjectView() {
  const [subject, setSubject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const { subjectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectRes, chaptersRes, progressRes] = await Promise.all([
          axios.get(`/api/subjects/${subjectId}`),
          axios.get(`/api/chapters/${subjectId}`),
          axios.get(`/api/progress/${subjectId}`)
        ]);

        setSubject(subjectRes.data);
        setChapters(chaptersRes.data);
        setProgress(progressRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [subjectId]);

  const handleChapterClick = (chapterId) => {
    navigate(`/chapter/${chapterId}`);
  };

  const getChapterProgress = (chapterId) => {
    return progress[chapterId] || 0;
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
      <Typography variant="h2" component="h1" gutterBottom>
        {subject?.name}
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        {subject?.description}
      </Typography>

      <Paper elevation={3} sx={{ mt: 4 }}>
        <List>
          {chapters.map((chapter, index) => (
            <React.Fragment key={chapter._id}>
              <ListItem
                button
                onClick={() => handleChapterClick(chapter._id)}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <ListItemIcon>
                  <BookIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="h6">
                      {chapter.title}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={getChapterProgress(chapter._id)}
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2" color="textSecondary">
                        Progress: {getChapterProgress(chapter._id)}%
                      </Typography>
                    </Box>
                  }
                />
                {getChapterProgress(chapter._id) === 100 ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <UncheckedIcon color="action" />
                )}
              </ListItem>
              {index < chapters.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default SubjectView; 