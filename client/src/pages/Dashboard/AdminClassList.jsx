import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';

const AdminClassList = () => {
  const { backendUrl, getClassData } = useContext(AppContext);

  const [classForm, setClassForm] = useState({
    title: '',
    subTitle: '',
    headTitle: '',
    subHeadTitle: '',
    span: '',
    image: null,
    video: null,
  });

  const [preview, setPreview] = useState({ image: '', video: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClassWidget = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/class-widget`);
        const data = res.data?.data?.[0];
        if (data) {
          const {
            title = '',
            subTitle = '',
            headTitle = '',
            subHeadTitle = '',
            span = '',
            image = '',
            video = '',
          } = data;

          setClassForm({
            title,
            subTitle,
            headTitle,
            subHeadTitle,
            span,
            image: null,
            video: null,
          });

          setPreview({
            image: image ? `${backendUrl}/${image}` : '',
            video: video ? `${backendUrl}/${video}` : '',
          });
        }
      } catch (err) {
        setError('Failed to load class data.');
        console.error(err);
      }
    };

    fetchClassWidget();
  }, [backendUrl]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      setClassForm((prev) => ({ ...prev, [name]: file }));
      setPreview((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
    } else {
      setClassForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const form = new FormData();
      form.append('title', classForm.title);
      form.append('subTitle', classForm.subTitle);
      form.append('headTitle', classForm.headTitle);
      form.append('subHeadTitle', classForm.subHeadTitle);
      form.append('span', classForm.span);

      if (classForm.image instanceof File) form.append('image', classForm.image);
      if (classForm.video instanceof File) form.append('video', classForm.video);

      const res = await axios.put(`${backendUrl}/api/class-widget/update`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (res.data.success) {
        await getClassData();
        alert('Class content updated successfully!');
      } else {
        throw new Error(res.data.message || 'Update failed.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Update Class Widget Content
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Head Title"
          name="headTitle"
          value={classForm.headTitle}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Sub Head Title"
          name="subHeadTitle"
          value={classForm.subHeadTitle}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Span"
          name="span"
          value={classForm.span}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Title"
          name="title"
          value={classForm.title}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Sub Title"
          name="subTitle"
          value={classForm.subTitle}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 2 }}
        />

        <Box my={2}>
          <Typography variant="subtitle2">Upload Image</Typography>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            style={{ marginBottom: '10px' }}
          />
          {preview.image && (
            <img src={preview.image} alt="Preview" style={{ width: '100%', maxHeight: '200px' }} />
          )}
        </Box>

        <Box my={2}>
          <Typography variant="subtitle2">Upload Video</Typography>
          <input
            type="file"
            name="video"
            accept="video/*"
            onChange={handleChange}
            style={{ marginBottom: '10px' }}
          />
          {preview.video && (
            <video
              src={preview.video}
              controls
              style={{ width: '100%', maxHeight: '200px' }}
            />
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, borderRadius: 999, backgroundColor: '#8d1f58' }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
        </Button>
      </form>
    </Paper>
  );
};

export default AdminClassList;
