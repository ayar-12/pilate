import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Grid,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress
} from '@mui/material';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import blogimage from '../assets/img2.jpg'
const FavoriteBlogsWidget = () => {
  const { backendUrl } = useContext(AppContext);
  const [favorites, setFavorites] = useState(null); // null = loading
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = localStorage.getItem('token'); // if using JWT
        const { data } = await axios.get(`${backendUrl}/api/blog/blogs/favorites`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (!cancelled) {
          setFavorites(data?.data || []);
        }
      } catch (e) {
        if (!cancelled) {
          setFavorites([]); // treat error as no favorites
        }
      }
    })();
    return () => { cancelled = true; };
  }, [backendUrl]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/assets/placeholder-image.png';
    if (imagePath.startsWith('http')) return imagePath;
    return `${backendUrl}/${imagePath.replace(/^\//, '')}`;
  };

  // Loading state
  if (favorites === null) {
    return (
      <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress size={24} />
        </Box>
      </Grid>
    );
  }

  // No favorites
  if (favorites.length === 0) {
    return (
      <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
        <Box textAlign="center">
          <img
            src={blogimage}
            alt="No favorites"
            style={{ width: '100%', maxHeight: 200, objectFit: 'contain' }}
          />
          <Typography variant="body2" color="textSecondary" mt={1}>
            لا يوجد مقالات مفضلة حتى الآن — أضف مقالاتك المفضلة.
          </Typography>
          <Button
            onClick={() => navigate('/blog')}
            variant="contained"
            sx={{
              mt: 2,
              borderRadius: '999px',
              background: '#8d1f58',
              color: 'white'
            }}
          >
            اذهب للمدونة
          </Button>
        </Box>
      </Grid>
    );
  }

  // Show first favorite blog
  const first = favorites[0];

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
          color: 'white'
        }}
      >
        <CardMedia
          component="img"
          image={getImageUrl(first.image)}
          alt={first.title}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.1))',
            zIndex: 1
          }}
        />
        <CardContent sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h6" fontWeight="bold" mt={0.5}>
            {first.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1, color: 'rgba(255,255,255,0.9)' }}
          >
            {first.description?.slice(0, 70)}…
          </Typography>
          <Button
            onClick={() => navigate('/blog')}
            variant="contained"
            size="small"
            sx={{
              mt: 2,
              backgroundColor: '#FDFAF6',
              color: '#111',
              borderRadius: '50px',
              textTransform: 'none',
              px: 3,
              py: 0.5,
              fontSize: '13px'
            }}
          >
            عرض كل المفضلة
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default FavoriteBlogsWidget;
