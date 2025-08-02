import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';

function AdminClassList() {
  const { backendUrl, getClassData } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [classForm, setClassForm] = useState({
    headTitle: '',
    title: '',
    subHeadTitle: '',
    span: '',
    subTitle: '',
    image: null,
    video: null,
  });

  const [preview, setPreview] = useState({ image: '', video: '' });

 useEffect(() => {
  axios.get(`${backendUrl}/api/class-widget`)
    .then(res => {
      if (res.data.success && res.data.data.length > 0) {
        const { headTitle, subHeadTitle , span, title, subTitle, image, video } = res.data.data[0];
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
    })
    .catch(() => setError('Could not load content.'));
}, [backendUrl]);


const handleChange = (e) => {
  const { name, value, files } = e.target;

  if (files && files[0]) {
    const file = files[0];
    setClassForm(prev => ({ ...prev, [name]: file }));
    setPreview(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
  } else {
    setClassForm(prev => ({ ...prev, [name]: value }));
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('title', classForm.title);
    form.append('subTitle', classForm.subTitle);
    form.append('headTitle', classForm.headTitle);
    form.append('subHeadTitle', classForm.subHeadTitle);
    form.append('span', classForm.span);
    if (classForm.image instanceof File) form.append('image', classForm.image);
    if (classForm.video instanceof File) form.append('video', classForm.video);

    try {
      setLoading(true);
      await axios.put(`${backendUrl}/api/class-widget/update`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      await getClassData();
      alert('Updated successfully!');
    } catch (err) {
      alert('Update failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6">Edit Class Widget Content</Typography>

      {error && <Box>{error}</Box>}

      <form onSubmit={handleSubmit}>
        <TextField label="Title" name="title" value={classForm.title} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <TextField label="Subtitle" name="subTitle" value={classForm.subTitle} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
 <TextField label="Head Title" name="headTitle" value={classForm.headTitle} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <TextField label="SubHeadtitle" name="subHeadTitle" value={classForm.subHeadTitle} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
<TextField label="span" name="span" value={classForm.span} onChange={handleChange} fullWidth sx={{ mb: 2 }} />

        <Typography>Upload Image</Typography>
        <input type="file" name="image" accept="image/*" onChange={handleChange} />
        {preview.image && <img src={preview.image} style={{ width: '100%', maxHeight: '200px' }} />}

        <Typography>Upload Video</Typography>
        <input type="file" name="video" accept="video/*" onChange={handleChange} />
        {preview.video && <video src={preview.video} controls style={{ width: '100%', maxHeight: '200px' }} />}

        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
      </form>
    </Paper>
  );
}

export default AdminClassList;
