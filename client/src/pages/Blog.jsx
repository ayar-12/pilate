import React, { useContext, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button
} from "@mui/material";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import axios from 'axios'
import { motion } from 'framer-motion';

const Blog = () => {
  const { blogs, backendUrl, toggleFavoriteBlog } = useContext(AppContext);
const [blog, setBlog] = useState('')


  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
    return `${backendUrl}/${cleanPath}`;
  };

  const toggleFavorite = async (blogId) => {
    try {
      await axios.post(`${backendUrl}/api/blog/blogs/favorite/${blogId}`, {}, { withCredentials: true });

      toggleFavoriteBlog(blogId); 
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    }
  };
  

  return (
    <Box sx={{ minHeight: "100vh", py: 6 }}>
                 <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true, amount: 0.2 }}
  >
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" fontWeight="bold" color="#670D2F">
          Wellness Reads
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Discover insights, tips, and stories to nourish your soul.
        </Typography>
      </Box>
      </motion.div>

           <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true, amount: 0.4 }}
  >
      <Grid container spacing={4} justifyContent="center" alignItems="stretch">
      

        {blogs.length > 0 ? (
  
          blogs.map((blog) => {
            const imageUrl = getImageUrl(blog.image);
            return (
              <Grid item xs={12} sm={6} md={4} key={blog._id} display="flex" justifyContent="center">
                <Box sx={{ width: 400 }}>
            <Card
              sx={{
    height: '360px',
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)' 
              }}
            >

        
              <CardMedia
                component="img"
                      image={imageUrl}
                      alt={blog.title}
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
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    background: 'rgba(0, 0, 0, 0.08)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    zIndex: 1,
    
  }}
              />


                    <CardContent
                      sx={{
                        position: 'relative',
                        zIndex: 2,
                        p: 3,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        color: 'white'
                      }}
                    >
                          <IconButton onClick={() => toggleFavorite(blog._id)}  sx={{ color: blog.isFavorite ? '#ff4081' : 'white' , position: "absolute", top: 12, right: 12, zIndex: 2}}>
  {blog.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
</IconButton>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <ArrowUpRight
                          className="arrow-icon"
                          size={24}
                          style={{ opacity: 0, transition: 'opacity 0.3s' }}
                        />
                      </Box>

                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'rgba(255,255,255,0.8)',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: '20px',
                            backdropFilter: 'blur(4px)',
                            display: 'inline-block',
                            mb: 1
                          }}
                        >
                          Blog Article
                </Typography>

                        <Typography variant="h6" fontWeight="bold">
                          {blog.title}
                </Typography>

                      

                <Button
                          variant="contained"
                  size="small"
                  sx={{
                            mt: 2,
                            backgroundColor: "#8d1f58",
                            borderRadius: 999,
                    fontWeight: "bold",
                            textTransform: "none"
                  }}
                          endIcon={<ChevronRight size={16} />}
                          component={Link}
                          to={`/blog-details/${blog._id}`}
                >
                  Read More
                </Button>
                      </Box>
              </CardContent>
            </Card>
                </Box>
          </Grid>
            );

          })
        ) : (
          <Typography variant="h6" color="textSecondary">
            No blog posts available at the moment
          </Typography>
       
        )}
      </Grid>
      </motion.div>
    </Box>
  );
};

export default Blog;

