import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Container, Divider } from "@mui/material";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { Grid } from "lucide-react";

const BlogDetails = () => {
  const { id } = useParams(); // blog ID from URL
  const { backendUrl } = useContext(AppContext);
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/blog/blogs/${id}`);
        if (data.success) {
          setBlog(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch blog:", err);
      }
    };

    fetchBlog();
  }, [id, backendUrl]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
    return `${backendUrl}/${cleanPath}`;
  };

  if (!blog) return <Typography>Loading blog...</Typography>;

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight="bold" color="#670D2F" gutterBottom>
        {blog.title}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Blog Article • {new Date(blog.createdAt).toLocaleDateString()}
      </Typography>

      {blog.image && (
        <Box
          component="img"
          src={getImageUrl(blog.image)}
          alt={blog.title}
          sx={{
            width: "100%",
            maxHeight: "400px",
            objectFit: "cover",
            borderRadius: "16px",
            my: 4,
          }}
        />
      )}



      <Divider sx={{ mb: 3 }} />

      <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
        {blog.description}
      </Typography>

      

    </Container>
  );
};

export default BlogDetails;
