import React, { useState, useContext } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Fab,
  Alert,
  CircularProgress
} from "@mui/material";

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon
} from "@mui/icons-material";

import { AppContext } from "../../context/AppContext";import axios from "axios";

const AdminBlogList = () => {
  const { backendUrl, blogs, getAllBlogs } = useContext(AppContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fixImageUrl = (url) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `${backendUrl}/${url}`;
  };

  const handleOpenDialog = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title || "",
        description: blog.description || ""
      });
      setImagePreview(fixImageUrl(blog.image));
      setVideoPreview(fixImageUrl(blog.video));
    } else {
      setEditingBlog(null);
      setFormData({ title: "", description: "" });
      setImagePreview("");
      setVideoPreview("");
    }
    setImageFile(null);
    setVideoFile(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBlog(null);
    setFormData({ title: "", description: "" });
    setImageFile(null);
    setVideoFile(null);
    setImagePreview("");
    setVideoPreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!formData.title || !formData.description) throw new Error("All fields are required");
      if (!editingBlog && (!imageFile || !videoFile)) throw new Error("Image and video are required");

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
    formDataToSend.append("image", imageFile);
formDataToSend.append("video", videoFile);


      const url = editingBlog
        ? `${backendUrl}/api/blog/blogs/${editingBlog._id}`
        : `${backendUrl}/api/blog/blogs`;

      const response = await axios({
        method: editingBlog ? "PUT" : "POST",
        url,
        data: formDataToSend,
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        setSuccess("Saved successfully!");
        handleCloseDialog();
        getAllBlogs();
      } else {
        throw new Error(response.data.message || "Failed to save blog");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.delete(`${backendUrl}/api/blog/blogs/${id}`, { withCredentials: true });
      if (res.data.success) {
        setSuccess("Deleted successfully!");
        getAllBlogs();
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
const handleFileChange = (type, file) => {
  try {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === "image") {
        setImageFile(file);
        setImagePreview(e.target.result);
      } else {
        setVideoFile(file);
        setVideoPreview(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  } catch (err) {
    console.error("File read error:", err);
    setError("Invalid file. Try again.");
  }
};


  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight="bold" color="#8d1f58">Manage Blogs</Typography>
        <Tooltip title="Add Blog">
          <Fab color="primary" onClick={() => handleOpenDialog()} sx={{ backgroundColor: "#8d1f58" }}>
            <AddIcon />
          </Fab>
        </Tooltip>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      {loading && <CircularProgress />}

      <Grid container spacing={3}>
        {blogs && blogs.map(blog => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={blog._id}>
            <Card>
              <CardMedia
                component="img"
                height="180"
                image={fixImageUrl(blog.image)}
                onError={(e) => { e.target.src = "/placeholder-image.png"; }}
              />
              <CardContent>
                <Typography fontWeight="bold" gutterBottom>{blog.title}</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>{blog.description?.slice(0, 100)}...</Typography>
                <Box display="flex" justifyContent="space-between">
                  <IconButton color="primary" onClick={() => handleOpenDialog(blog)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(blog._id)}><DeleteIcon /></IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingBlog ? "Edit Blog" : "Add Blog"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              label="Title"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Image
                  <input hidden type="file" accept="image/*" onChange={(e) => handleFileChange("image", e.target.files[0])} />
                </Button>
                {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: "100%", marginTop: 10 }} />}
              </Grid>
              <Grid item xs={6}>
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Video
                  <input hidden type="file" accept="video/*" onChange={(e) => handleFileChange("video", e.target.files[0])} />
                </Button>
                {videoPreview && <video src={videoPreview} controls style={{ width: "100%", marginTop: 10 }} />}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ backgroundColor: "#670D2F" , borderRadius: '50px'}}>
              {loading ? <CircularProgress size={20} /> : (editingBlog ? "Update" : "Create")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AdminBlogList;
