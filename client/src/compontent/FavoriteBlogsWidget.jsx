import React, { useState, useEffect, useContext } from 'react';
import {
  Grid, Box, Typography, Card, CardMedia, CardContent, Button, CircularProgress
} from '@mui/material';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const FavoriteBlogsWidget = () => {
  const { blogs, backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [displayBlog, setDisplayBlog] = useState(null); // favorite or latest
  const [isFallback, setIsFallback] = useState(false);  // true = latest (no favorites)
  const navigate = useNavigate();

  const objectIdToDate = (id) => {
    if (!id || id.length < 8) return new Date(0);
    return new Date(parseInt(id.substring(0, 8), 16) * 1000);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${backendUrl}/${imagePath.replace(/^\//, '')}`;
  };

  useEffect(() => {
    const favs = (blogs || []).filter(b => b.isFavorite);
    if (favs.length) {
      setDisplayBlog(favs[0]);
      setIsFallback(false);
    } else {
      const latest = [...(blogs || [])]
        .sort((a, b) => {
          const da = a.createdAt ? new Date(a.createdAt) : objectIdToDate(a._id);
          const db = b.createdAt ? new Date(b.createdAt) : objectIdToDate(b._id);
          return db - da;
        })[0];
      setDisplayBlog(latest || null);
      setIsFallback(true);
    }
    setLoading(false);
  }, [blogs]);

  if (loading) {
    return (
      <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
        <Box display="flex" alignItems="center" justifyContent="center" height={350}>
          <CircularProgress size={24} />
        </Box>
      </Grid>
    );
  }

  // No blogs at all
  if (!displayBlog) {
    return (
      <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
        <Box textAlign="center" p={2} sx={{ height: 350, borderRadius: 2, bgcolor: '#f7f7f7' }}>
          <Typography variant="body2" color="textSecondary">لا توجد مقالات حتى الآن.</Typography>
        </Box>
      </Grid>
    );
  }

  return (
    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
      <Card
        sx={{
          height: 350,
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          color: 'white',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        }}
      >
        <CardMedia
          component="img"
          image={getImageUrl(displayBlog.image)}
          alt={displayBlog.title}
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.1))', zIndex: 1 }} />
        <CardContent sx={{ position: 'relative', zIndex: 2 }}>
          <Typography
            variant="caption"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.9)',
              px: 1.5, py: 0.5, borderRadius: '20px', backdropFilter: 'blur(4px)',
              display: 'inline-block', mb: 1
            }}
          >
            {isFallback ? 'آخر مقال' : 'مقال مفضل'}
          </Typography>

          <Typography variant="h6" fontWeight="bold">{displayBlog.title}</Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.9)' }}>
            {(displayBlog.description || '').slice(0, 70)}…
          </Typography>

          <Box mt={2} display="flex" gap={1}>
            <Button
              onClick={() => navigate(`/blog-details/${displayBlog._id}`)}
              variant="contained" size="small"
              sx={{ backgroundColor: '#FDFAF6', color: '#111', borderRadius: '50px', textTransform: 'none', px: 3, py: 0.5, fontSize: '13px' }}
            >
              {isFallback ? 'اقرأ الآن' : 'قراءة'}
            </Button>
            <Button
              onClick={() => navigate(isFallback ? '/blogs' : '/blogs')}
              variant="contained" size="small"
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: '50px', textTransform: 'none', px: 3, py: 0.5, fontSize: '13px', boxShadow: 'none' }}
            >
              {isFallback ? 'عرض جميع المقالات' : 'عرض المفضلة'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default FavoriteBlogsWidget;

