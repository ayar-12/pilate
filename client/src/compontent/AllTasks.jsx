import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  Divider,
  CircularProgress,
  Paper
} from '@mui/material';
import { AppContext } from '../context/AppContext';

const AllTasksPage = () => {
  const { backendUrl } = useContext(AppContext);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/todo/user`, { withCredentials: true });
        setTodos(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch todos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, [backendUrl]);

  const toggleDone = async (id) => {
    try {
      const updated = todos.map((todo) =>
        todo._id === id ? { ...todo, done: !todo.done } : todo
      );
      setTodos(updated);
      await axios.put(`${backendUrl}/api/todo/update/${id}`, { done: !todos.find(t => t._id === id).done }, { withCredentials: true });
    } catch (err) {
      console.error('Failed to toggle task completion:', err);
    }
  };

  const formatDateTime = (date, time) => {
    if (!date && !time) return null;
    let displayText = '';
    if (date) {
      const dateObj = new Date(date);
      displayText += dateObj.toLocaleDateString();
    }
    if (time) {
      if (displayText) displayText += ' at ';
      displayText += time;
    }
    return displayText;
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={3} color="#74512D">
        All To-Do Tasks
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center"><CircularProgress /></Box>
      ) : todos.length === 0 ? (
        <Typography variant="body1" color="textSecondary">No tasks found.</Typography>
      ) : (
        <Paper sx={{ p: 2 }}>
          <List>
            {todos.map((todo, index) => (
              <React.Fragment key={todo._id}>
                <ListItem alignItems="flex-start">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={todo.done}
                        onChange={() => toggleDone(todo._id)}
                        color="success"
                      />
                    }
                    label={
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ textDecoration: todo.done ? 'line-through' : 'none', color: todo.done ? 'gray' : '#3c3c3c' }}
                        >
                          {todo.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {todo.subtitle}
                        </Typography>
                        {formatDateTime(todo.date, todo.time) && (
                          <Typography variant="caption" color="textSecondary">
                            📅 {formatDateTime(todo.date, todo.time)}
                          </Typography>
                        )}
                        {todo.image && (
                          <Box mt={1}>
                            <img 
                              src={`${backendUrl}${todo.image}`} 
                              alt="task" 
                              width="100%" 
                              style={{ borderRadius: '8px', maxHeight: '200px', objectFit: 'cover' }}
                            />
                          </Box>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                {index < todos.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default AllTasksPage;
