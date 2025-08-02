import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';

function AdminHomeSettings() {
  const { backendUrl, getHomeData } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // form fields + file placeholders
  const [form, setForm] = useState({
    title: '',
    subTitle: '',
    description: '',
    button1: '',
    button2: '',
    button3: '',
    hTitle1: '',
    hSubTitle1: '',
    hTitle2: '',
    hSubTitle2: '',
    videoDocumantion: '',
    videoTitle: '',
    video: null     
  });

  const [preview, setPreview] = useState({  video: '' });


  useEffect(() => {
    axios.get(`${backendUrl}/api/home`)
      .then(res => {
        if (res.data.success && Array.isArray(res.data.data)) {
          const home = res.data.data[0];
          const videoFilename = home.video
          ? home.video.split('/').pop()
          : null;
          setForm({
            title:        home.title        || '',
            subTitle:     home.subTitle     || '',
            description:  home.description  || '',
            button1:      home.button1      || '',
            button2:      home.button2      || '',
            button3:      home.button3      || '',
            hTitle1:      home.hTitle1      || '',
            hSubTitle1:   home.hSubTitle1   || '',
            hTitle2:      home.hTitle2      || '',
            hSubTitle2:   home.hSubTitle2   || '',
            videoDocumantion: home.videoDocumantion || '',
            videoTitle:   home.videoTitle   || '',
            video: videoFilename,  
         
          });
          setPreview({
            video: home.video || '',
     
          });
        }
      })
      .catch(() => setError('Could not load home settings.'));
  }, [backendUrl]);

  

const handleChange = (e) => {
  const { name, files, value } = e.target;

  if (files?.length) {
    const file = files[0];
    setForm((f) => ({ ...f, [name]: file }));

    if (name === 'video') {
      setPreview((p) => ({ ...p, video: URL.createObjectURL(file) }));
    }
  } else {
    setForm((f) => ({ ...f, [name]: value }));
  }
};


  const handleSubmit = async e => {
    e.preventDefault();
    const fd = new FormData();

    [
      'title','subTitle','description',
      'button1','button2','button3',
      'hTitle1','hSubTitle1','hTitle2','hSubTitle2',
      'videoDocumantion','videoTitle'
    ].forEach(key => fd.append(key, form[key] || ''));

  
    if (form.video instanceof File) fd.append('video', form.video);



    try {
      setLoading(true);
      await axios.put(`${backendUrl}/api/home/update`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      
      await getHomeData();   
      alert('Home settings updated!');
    } catch (err) {
      alert('Update failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>Edit Home Page Content</Typography>

      {error && <Box sx={{ mb:2, color:'error.main' }}>{error}</Box>}

      <form onSubmit={handleSubmit}>
        {[
          'title','subTitle','description',
          'button1','button2','button3',
          'hTitle1','hSubTitle1','hTitle2','hSubTitle2',
          'videoDocumantion','videoTitle'
        ].map(key => (
          <TextField
            key={key}
            label={key}
            name={key}
            value={form[key]}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
        ))}

     

      <Typography variant="body2" sx={{ mt: 2 }}>Upload Video</Typography>
<input
  type="file"
  name="video"
  accept="video/*"
  onChange={handleChange}
/>

        {preview.video && (
          <Box mb={2}>
            <video
              src={preview.video}
              controls
              style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }}
            />
          </Box>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Paper>
  );
}

export default AdminHomeSettings;
