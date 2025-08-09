 import React, { useState, useContext } from "react";
import {
  Box, Grid, Typography, Button, Card, CardMedia, CardContent, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, IconButton, Tooltip,
  Fab, Alert, CircularProgress, LinearProgress
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

const MAX_MB = 50;

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
  const [uploadPct, setUploadPct] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getImageUrl = (p) => {
    if (!p) return "/placeholder-image.png";
    if (typeof p === "string" && p.startsWith("http")) return p;
    return `${backendUrl}/${p}`;
  };

  const handleOpenDialog = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({ title: blog.title || "", description: blog.description || "" });
      setImagePreview(getImageUrl(blog.image));
      setVideoPreview(getImageUrl(blog.video));
    } else {
      setEditingBlog(null);
      setFormData({ title: "", description: "" });
      setImagePreview("");
      setVideoPreview("");
    }
    setImageFile(null);
    setVideoFile(null);
    setError("");
    setSuccess("");
    setUploadPct(0);
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
    setUploadPct(0);
  };

  const validateFile = (file, label, acceptPrefix) => {
    if (!file) return true;
    if (!file.type.startsWith(acceptPrefix)) {
      setError(`${label} must be ${acceptPrefix.replace("/", "")}`);
      return false;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`${label} must be ≤ ${MAX_MB}MB`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setUploadPct(0);

    try {
      if (!formData.title || !formData.description) throw new Error("Title and description are required.");
      if (!editingBlog && (!imageFile || !videoFile)) throw new Error("Image and video are required for creating a blog.");

      if (!validateFile(imageFile, "Image", "image/")) throw new Error();
      if (!validateFile(videoFile, "Video", "video/")) throw new Error();

      const fd = new FormData();
      fd.append("title", formData.title.trim());
      fd.append("description", formData.description.trim());
      // Only append files if user selected new ones (Cloudinary upload)
      if (imageFile) fd.append("image", imageFile);
      if (videoFile) fd.append("video", videoFile);

      const url = editingBlog
        ? `${backendUrl}/api/blog/blogs/${editingBlog._id}`
        : `${backendUrl}/api/blog/blogs`;

      // If you’re using Bearer tokens:
      const token = localStorage.getItem("token");

      const { data } = await axios({
        method: editingBlog ? "PUT" : "POST",
        url,
        data: fd,
        withCredentials: true, // keep if you also support cookie auth
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        onUploadProgress: (evt) => {
          if (evt.total) setUploadPct(Math.round((evt.loaded * 100) / evt.total));
        }
      });

      if (!data?.success) throw new Error(data?.message || "Failed to save blog.");

      setSuccess(editingBlog ? "Blog updated successfully!" : "Blog created successfully!");
      handleCloseDialog();
      getAllBlogs();
    } catch (err) {
      if (err?.message) setError(err.message);
      else setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${backendUrl}/api/blog/blogs/${id}`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      if (!res.data?.success) throw new Error(res.data?.message || "Delete failed");
      setSuccess("Deleted successfully!");
      getAllBlogs();
    } catch (err) {
      setError(err.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (type, file) => {
    if (!file) return;
    setError("");
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

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {loading && !openDialog && <CircularProgress />}

      <Grid container spacing={3}>
        {blogs?.map((blog) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={blog._id}>
            <Card>
              <CardMedia
                component="img"
                height="180"
                image={getImageUrl(blog.image)}
                onError={(e) => { e.currentTarget.src = "/placeholder-image.png"; }}
              />
              <CardContent>
                <Typography fontWeight="bold" gutterBottom>{blog.title}</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {blog.description?.slice(0, 100)}...
                </Typography>
                <Box display="flex" justifyContent="space-between">
                  <IconButton color="primary" onClick={() => handleOpenDialog(blog)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(blog._id)}>
                    <DeleteIcon />
                  </IconButton>
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
                <Button component="label" variant="outlined" fullWidth startIcon={<CloudUploadIcon />}>
                  {imageFile ? "Change Image" : "Upload Image"}
                  <input hidden type="file" accept="image/*" onChange={(e) => handleFileChange("image", e.target.files?.[0])} />
                </Button>
                {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: "100%", marginTop: 10 }} />}
              </Grid>
              <Grid item xs={6}>
                <Button component="label" variant="outlined" fullWidth startIcon={<CloudUploadIcon />}>
                  {videoFile ? "Change Video" : "Upload Video"}
                  <input hidden type="file" accept="video/*" onChange={(e) => handleFileChange("video", e.target.files?.[0])} />
                </Button>
                {videoPreview && <video src={videoPreview} controls style={{ width: "100%", marginTop: 10 }} />}
              </Grid>
            </Grid>

            {loading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress variant="determinate" value={uploadPct} />
                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                  Uploading… {uploadPct}%
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ backgroundColor: "#670D2F", borderRadius: "50px" }}>
              {loading ? <CircularProgress size={20} /> : editingBlog ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AdminBlogList;
