import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import {
  Grid,
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  Divider,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  InputLabel,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { AppContext } from '../context/AppContext';

const DashboardWidget = ({ title, children, sx }) => (
  <Paper
    sx={{
      p: 2,
      borderRadius: 4,
      height: '350px',
      overflowY: 'auto',
      ...sx,
    }}
  >
    <Typography fontWeight="bold" mb={1} color="#74512D">
      {title}
    </Typography>
    {children}
  </Paper>
);

const blurBackdrop = {
  BackdropProps: {
    sx: {
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      backgroundColor: 'rgba(0,0,0,0.25)',
    },
  },
  PaperProps: {
    sx: {
      borderRadius: '20px',
      bgcolor: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      border: '1px solid rgba(255,255,255,0.5)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
    },
  },
};

const TodoWidget = () => {
  const { backendUrl } = useContext(AppContext);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit modals
  const [showDialog, setShowDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // View details modal
  const [selectedTodo, setSelectedTodo] = useState(null);

  // Forms
  const [form, setForm] = useState({ title: '', subtitle: '', date: '', time: '', image: null });
  const [editForm, setEditForm] = useState({ title: '', subtitle: '', date: '', time: '', image: null });
  const [editingTodo, setEditingTodo] = useState(null);

  // Inline error (inside add/edit forms)
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Row menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTodoForMenu, setSelectedTodoForMenu] = useState(null);

  // Centered alert dialog (info/error)
  const [alert, setAlert] = useState({
    open: false,
    title: '',
    message: '',
    confirmText: 'OK',
    onConfirm: null,
  });
  const openAlert = ({ title, message, confirmText = 'OK', onConfirm = null }) =>
    setAlert({ open: true, title, message, confirmText, onConfirm });
  const closeAlert = async () => {
    const cb = alert.onConfirm;
    setAlert((a) => ({ ...a, open: false }));
    if (typeof cb === 'function') await cb();
  };

  // Confirm dialog (e.g., delete)
  const [confirm, setConfirm] = useState({
    open: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: null,
  });
  const openConfirm = ({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm = null }) =>
    setConfirm({ open: true, title, message, confirmText, cancelText, onConfirm });
  const closeConfirm = () => setConfirm((c) => ({ ...c, open: false }));

  const getImageUrl = (p) => {
    if (!p) return null;
    if (p.startsWith('http')) return p;
    return `${backendUrl}/${String(p).replace(/^\/+/, '')}`;
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/todo/user`, { withCredentials: true });
        setTodos(res.data.data || []);
      } catch (err) {
        console.error('Error fetching todos:', err);
        setError('Failed to load todos');
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, [backendUrl]);

  const toggleDone = async (id) => {
    try {
      const todoToUpdate = todos.find((t) => t._id === id);
      const updated = todos.map((todo) => (todo._id === id ? { ...todo, done: !todo.done } : todo));
      setTodos(updated);

      await axios.put(
        `${backendUrl}/api/todo/update/${id}`,
        { done: !todoToUpdate.done },
        { withCredentials: true }
      );
    } catch (err) {
      console.error('Error updating todo status:', err);
      openAlert({ title: 'Update failed', message: 'Failed to update todo status.' });
      // rollback
      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? { ...todo, done: !todo.done } : todo))
      );
    }
  };

  const handleAdd = async () => {
    if (!form.title.trim()) {
      openAlert({ title: 'Missing title', message: 'Please enter a title for your todo.' });
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('subtitle', form.subtitle.trim());
      formData.append('date', form.date);
      formData.append('time', form.time);
      if (form.image) formData.append('image', form.image);

      const res = await axios.post(`${backendUrl}/api/todo/create`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setTodos((prev) => [res.data.data, ...prev]);
        setForm({ title: '', subtitle: '', date: '', time: '', image: null });
        setShowDialog(false);
        openAlert({ title: 'Added', message: 'Todo added successfully!' });
      } else {
        throw new Error(res.data.message || 'Failed to add todo');
      }
    } catch (err) {
      console.error('Failed to add todo:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add todo';
      setError(errorMessage);
      openAlert({ title: 'Error', message: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editForm.title.trim()) {
      openAlert({ title: 'Missing title', message: 'Please enter a title for your todo.' });
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', editForm.title.trim());
      formData.append('subtitle', editForm.subtitle.trim());
      formData.append('date', editForm.date);
      formData.append('time', editForm.time);
      if (editForm.image) formData.append('image', editForm.image);

      const res = await axios.put(`${backendUrl}/api/todo/edit/${editingTodo._id}`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setTodos((prev) => prev.map((t) => (t._id === editingTodo._id ? res.data.data : t)));
        setEditForm({ title: '', subtitle: '', date: '', time: '', image: null });
        setEditingTodo(null);
        setShowEditDialog(false);
        openAlert({ title: 'Updated', message: 'Todo updated successfully!' });
      } else {
        throw new Error(res.data.message || 'Failed to update todo');
      }
    } catch (err) {
      console.error('Failed to update todo:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update todo';
      setError(errorMessage);
      openAlert({ title: 'Error', message: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (todo) => {
    openConfirm({
      title: 'Delete todo',
      message: `Are you sure you want to delete "${todo.title}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: async () => {
        try {
          const res = await axios.delete(`${backendUrl}/api/todo/delete/${todo._id}`, {
            withCredentials: true,
          });
          if (res.data.success) {
            setTodos((prev) => prev.filter((t) => t._id !== todo._id));
            openAlert({ title: 'Deleted', message: 'Todo deleted successfully!' });
          } else {
            throw new Error(res.data.message || 'Failed to delete todo');
          }
        } catch (err) {
          console.error('Failed to delete todo:', err);
          const errorMessage = err.response?.data?.message || err.message || 'Failed to delete todo';
          openAlert({ title: 'Error', message: errorMessage });
        } finally {
          closeConfirm();
        }
      },
    });
  };

  const openEditDialog = (todo) => {
    setEditingTodo(todo);
    setEditForm({
      title: todo.title,
      subtitle: todo.subtitle || '',
      date: todo.date || '',
      time: todo.time || '',
      image: null,
    });
    setShowEditDialog(true);
    setAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setForm({ title: '', subtitle: '', date: '', time: '', image: null });
    setError(null);
  };

  const handleCloseEditDialog = () => {
    setShowEditDialog(false);
    setEditForm({ title: '', subtitle: '', date: '', time: '', image: null });
    setEditingTodo(null);
    setError(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      openAlert({ title: 'Too large', message: 'Image size should be less than 5MB.' });
      return;
    }
    if (!file.type.startsWith('image/')) {
      openAlert({ title: 'Invalid file', message: 'Please select a valid image file.' });
      return;
    }
    setForm({ ...form, image: file });
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      openAlert({ title: 'Too large', message: 'Image size should be less than 5MB.' });
      return;
    }
    if (!file.type.startsWith('image/')) {
      openAlert({ title: 'Invalid file', message: 'Please select a valid image file.' });
      return;
    }
    setEditForm({ ...editForm, image: file });
  };

  const handleMenuOpen = (event, todo) => {
    setAnchorEl(event.currentTarget);
    setSelectedTodoForMenu(todo);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTodoForMenu(null);
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
    <Grid item xs={12} sm={6} md={4} lg={4} xl={4} sx={{ height: '320px' }}>
      <DashboardWidget title="My To-Do List" sx={{ width: { xs: 400, md: 300 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <button
            onClick={() => setShowDialog(true)}
            style={{
              borderRadius: '50%',
              minWidth: '40px',
              width: 40,
              height: 40,
              backgroundColor: '#8d1f58',
              color: '#fff',
              padding: 0,
              border: 'none',
              cursor: 'pointer',
            }}
            aria-label="Add todo"
          >
            <AddIcon />
          </button>
   <Button
        variant="text"
        size="small"
        sx={{ ml: 'auto', textTransform: 'none', color: '#8d1f58', fontWeight: 'bold' }}
        onClick={() => navigate('/all-tasks')} // import { useNavigate } from 'react-router-dom'
      >
        Show More
      </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : (
          <List>
            {todos.length === 0 ? (
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                No todos yet. Click the + button to add one!
              </Typography>
            ) : (
              todos
                .slice(0, 3)
                .map((todo, index) => (
                  <React.Fragment key={todo._id}>
                    <ListItem
                      disableGutters
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        pr: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={todo.done}
                              onChange={() => toggleDone(todo._id)}
                              color="success"
                              onClick={(e) => e.stopPropagation()}
                            />
                          }
                          label={
                            <Box onClick={() => setSelectedTodo(todo)} sx={{ cursor: 'pointer' }}>
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  textDecoration: todo.done ? 'line-through' : 'none',
                                  color: todo.done ? 'gray' : '#6c0e0eff',
                                }}
                              >
                                {todo.title}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {todo.subtitle}
                              </Typography>
                              {formatDateTime(todo.date, todo.time) && (
                                <Typography
                                  variant="caption"
                                  color="textSecondary"
                                  sx={{ display: 'block', mt: 0.5 }}
                                >
                                  📅 {formatDateTime(todo.date, todo.time)}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </Box>

                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, todo)} sx={{ ml: 1 }}>
                        <MoreVertIcon />
                      </IconButton>
                    </ListItem>
                    {index < todos.slice(0, 3).length - 1 && <Divider />}
                  </React.Fragment>
                ))
            )}
          </List>
        )}

        {/* Add dialog */}
        <Dialog open={showDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth {...blurBackdrop}>
          <DialogTitle>Add To-Do Item</DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              label="Title *"
              fullWidth
              margin="dense"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              disabled={submitting}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !submitting && form.title.trim()) {
                  handleAdd();
                }
              }}
            />
            <TextField
              label="Subtitle (optional)"
              fullWidth
              margin="dense"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              disabled={submitting}
            />
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid item xs={6}>
                <TextField
                  label="Date (optional)"
                  type="date"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{ shrink: true }}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Time (optional)"
                  type="time"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{ shrink: true }}
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  disabled={submitting}
                />
              </Grid>
            </Grid>
            <InputLabel sx={{ mt: 2, mb: 1 }}>Upload Image (optional)</InputLabel>
            <input type="file" accept="image/*" onChange={handleImageChange} disabled={submitting} style={{ marginBottom: 16 }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={submitting}>
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              variant="contained"
              disabled={submitting || !form.title.trim()}
              sx={{ backgroundColor: '#8d1f58', color: 'white' }}
            >
              {submitting ? (
                <>
                  <CircularProgress size={16} sx={{ mr: 1, color: 'white' }} />
                  Adding...
                </>
              ) : (
                'Add Todo'
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit dialog */}
        <Dialog open={showEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth {...blurBackdrop}>
          <DialogTitle>Edit To-Do Item</DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              label="Title *"
              fullWidth
              margin="dense"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              disabled={submitting}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !submitting && editForm.title.trim()) {
                  handleEdit();
                }
              }}
            />
            <TextField
              label="Subtitle (optional)"
              fullWidth
              margin="dense"
              value={editForm.subtitle}
              onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
              disabled={submitting}
            />
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid item xs={6}>
                <TextField
                  label="Date (optional)"
                  type="date"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{ shrink: true }}
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  disabled={submitting}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Time (optional)"
                  type="time"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{ shrink: true }}
                  value={editForm.time}
                  onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                  disabled={submitting}
                />
              </Grid>
            </Grid>
            <InputLabel sx={{ mt: 2, mb: 1 }}>Upload New Image (optional)</InputLabel>
            <input type="file" accept="image/*" onChange={handleEditImageChange} disabled={submitting} style={{ marginBottom: 16 }} />
            {editingTodo?.image && (
              <Box mt={2}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Current Image:
                </Typography>
                <img
                  src={getImageUrl(editingTodo.image)}
                  alt="current"
                  width="100px"
                  style={{ borderRadius: 8 }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} disabled={submitting}>
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              variant="contained"
              disabled={submitting || !editForm.title.trim()}
              sx={{ backgroundColor: '#8d1f58', color: 'white' }}
            >
              {submitting ? (
                <>
                  <CircularProgress size={16} sx={{ mr: 1, color: 'white' }} />
                  Updating...
                </>
              ) : (
                'Update Todo'
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* View details dialog */}
        <Dialog open={!!selectedTodo} onClose={() => setSelectedTodo(null)} {...blurBackdrop}>
          <DialogTitle>{selectedTodo?.title}</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1">{selectedTodo?.subtitle}</Typography>
            {formatDateTime(selectedTodo?.date, selectedTodo?.time) && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                📅 {formatDateTime(selectedTodo.date, selectedTodo.time)}
              </Typography>
            )}
            {selectedTodo?.image && (
              <Box mt={2}>
                <img
                  src={getImageUrl(selectedTodo.image)}
                  alt="task"
                  width="100%"
                  style={{ borderRadius: 10 }}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedTodo(null)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Row action menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => openEditDialog(selectedTodoForMenu)}>
            <EditIcon sx={{ mr: 1, fontSize: 20 }} />
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              if (selectedTodoForMenu) handleDelete(selectedTodoForMenu);
            }}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
            Delete
          </MenuItem>
        </Menu>

        {/* Global alert dialog */}
        <Dialog open={alert.open} onClose={closeAlert} {...blurBackdrop}>
          <DialogTitle sx={{ fontWeight: 700, color: '#8d1f58' }}>{alert.title}</DialogTitle>
          <DialogContent sx={{ pt: 0 }}>{alert.message}</DialogContent>
          <DialogActions>
            <Button onClick={closeAlert} autoFocus>
              {alert.confirmText}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Global confirm dialog */}
        <Dialog open={confirm.open} onClose={closeConfirm} {...blurBackdrop}>
          <DialogTitle sx={{ fontWeight: 700, color: '#8d1f58' }}>{confirm.title}</DialogTitle>
          <DialogContent sx={{ pt: 0 }}>{confirm.message}</DialogContent>
          <DialogActions>
            <Button onClick={closeConfirm}>{confirm.cancelText}</Button>
            <Button
              onClick={async () => {
                const cb = confirm.onConfirm;
                if (typeof cb === 'function') await cb();
              }}
              color="error"
              variant="contained"
            >
              {confirm.confirmText}
            </Button>
          </DialogActions>
        </Dialog>
      </DashboardWidget>
    </Grid>
  );
};

export default TodoWidget;

