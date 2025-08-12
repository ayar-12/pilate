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

const FavoriteBlogsWidget = () => {
  const { blogs, backendUrl } = useContext(AppContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // simulate load
    const fav = blogs.filter(b => b.isFavorite);
    setFavorites(fav);
    setLoading(false);
  }, [blogs]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const clean = imagePath.replace(/^\//, '');
    return `${backendUrl}/${clean}`;
  };

  return (
    <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
      {loading ? (
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress size={24} />
        </Box>
      ) : favorites.length === 0 ? (
        <Box textAlign="center" p={2}>
          <img
            src="/assets/no-favorites.png"
            alt="No favorites"
            style={{ width: '100%', maxHeight: 200, objectFit: 'contain' }}
          />
          <Typography variant="body2" color="textSecondary" mt={1}>
            No favorite blogs yet.
          </Typography>
        </Box>
      ) : (
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
            image={getImageUrl(favorites[0].image)}
            alt={favorites[0].title}
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
              background: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.1))',
              zIndex: 1
            }}
          />
          <CardContent sx={{ position: 'relative', zIndex: 2 }}>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Favorite Blog
            </Typography>
            <Typography variant="h6" fontWeight="bold" mt={0.5}>
              {favorites[0].title}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255,255,255,0.9)' }}>
              {favorites[0].description?.slice(0, 70)}…
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
      )}
    </Grid>
  );
};

export default FavoriteBlogsWidget;
