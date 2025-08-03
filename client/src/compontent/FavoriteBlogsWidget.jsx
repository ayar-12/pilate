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
  CircularProgress,
  Container
} from '@mui/material';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';


const FavoriteBlogsWidget = () => {
  const { blogs, backendUrl } = useContext(AppContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fav = blogs.filter((b) => b.isFavorite);
    setFavorites(fav);
    setLoading(false);
  }, [blogs]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const clean = imagePath.replace(/^\//, '');
    return `${backendUrl}/${clean}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (favorites.length === 0) {
    return (
      <Box textAlign="center" py={6}>
        <img
          src={noFavoritesImg}
          alt="No favorites"
          style={{ width: '100%', maxWidth: 300, objectFit: 'contain' }}
        />
        <Typography variant="h6" mt={2}>
          No favorite blogs yet.
        </Typography>
      </Box>
    );
  }

  const fav = favorites[0]; // show first or random later if needed

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" fontWeight="bold" mb={3} color="#8d1f58">
        Your Favorite Blog
      </Typography>

      <Card
        sx={{
          height: 400,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          color: 'white',
          boxShadow: 6
        }}
      >
        <CardMedia
          component="img"
          image={getImageUrl(fav.image)}
          alt={fav.title}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
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
            background: 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.1))',
            zIndex: 1
          }}
        />
        <CardContent sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Featured Favorite
          </Typography>
          <Typography variant="h5" fontWeight="bold" mt={1}>
            {fav.title}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.9)' }}>
            {fav.description?.slice(0, 100)}…
          </Typography>
          <Button
            onClick={() => navigate('/blogs')}
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
            View All Favorite Blogs
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default FavoriteBlogsWidget;

