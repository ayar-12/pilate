import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Fab,
  Tooltip,
  MenuItem,
} from "@mui/material";

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon
} from "@mui/icons-material";

import { AppContext } from "../../context/AppContext";
import axios from "axios";

const AdminCourseList = () => {
  const { backendUrl, courses, getAllCourses, deleteCourse } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    couchName: "",
    timing: [{ date: new Date().toISOString().split('T')[0], time: "9:00 AM" }],
  });
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");

  useEffect(() => {
    console.log("Trigger getAllCourses() from AdminCourseList");
    getAllCourses();
  }, []);

  const fixImageUrl = (url) => {
    if (!url) return null;
    return url.replace(/([^:]\/)\/+/g, "$1");
  };

  const getVideoUrl = (videoPath) => {
  if (!videoPath) return null;
  // if path already absolute (http...), just return it
  if (videoPath.startsWith('http')) return videoPath;
  // else prepend backendUrl
  return `${backendUrl}/${videoPath}`;
};

  const handleOpenDialog = (course = null) => {
    if (course) {
      setEditingCourse(course);
      const processedTiming = course.timing && course.timing.length > 0 
        ? course.timing.map(slot => ({
            date: slot.date || new Date().toISOString().split('T')[0],
            time: slot.time || "9:00 AM"
          }))
        : [{ date: new Date().toISOString().split('T')[0], time: "9:00 AM" }];

      setFormData({
        title: course.title || "",
        description: course.description || "",
        price: course.price ? course.price.toString() : "",
        couchName: course.couchName || "",
        timing: processedTiming,
      });
      setImagePreview(fixImageUrl(course.image));
      setVideoPreview(fixImageUrl(course.video));
    } else {
      setEditingCourse(null);
      setFormData({
        title: "",
        description: "",
        price: "",
        couchName: "",
        timing: [{ date: new Date().toISOString().split('T')[0], time: "9:00 AM" }],
      });
      setImagePreview("");
      setVideoPreview("");
    }
    setImageFile(null);
    setVideoFile(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCourse(null);
    setFormData({
      title: "",
      description: "",
      price: "",
      couchName: "",
      timing: [{ date: new Date().toISOString().split('T')[0], time: "9:00 AM" }],
    });
    setImageFile(null);
    setVideoFile(null);
    setImagePreview("");
    setVideoPreview("");
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };


  const handleTimingChange = (index, field, value) => {
    const newTiming = [...formData.timing];
    newTiming[index] = { ...newTiming[index], [field]: value };
    setFormData(prev => ({ ...prev, timing: newTiming }));
  };

  const addTimingSlot = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      timing: [...prev.timing, { date: today, time: "9:00 AM" }]
    }));
  };

  const removeTimingSlot = (index) => {
    if (formData.timing.length > 1) {
      setFormData(prev => ({
        ...prev,
        timing: prev.timing.filter((_, i) => i !== index)
      }));
    }
  };

  const handleFileChange = (type, file) => {
    if (type === 'image') {
      setImageFile(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview("");
      }
    } else if (type === 'video') {
      setVideoFile(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setVideoPreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setVideoPreview("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!formData.title || !formData.description || !formData.price || !formData.couchName) {
        throw new Error("All fields are required");
      }

      if (!editingCourse && (!imageFile || !videoFile)) {
        throw new Error("Image and video are required for new courses");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("couchName", formData.couchName); 
      formDataToSend.append("timing", JSON.stringify(formData.timing));

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }
      if (videoFile) {
        formDataToSend.append("video", videoFile); // ✅ Make sure backend expects 'video'

      }

      const url = editingCourse 
        ? `${backendUrl}/api/course/courses/${editingCourse._id}`
        : `${backendUrl}/api/course/courses`;

      const response = await axios({
        method: editingCourse ? "PUT" : "POST",
        url: url,
        data: formDataToSend,
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.data.success) {
        setSuccess(editingCourse ? "Course updated successfully!" : "Course created successfully!");
        handleCloseDialog();
        await getAllCourses();
      } else {
        throw new Error(response.data.message || "Failed to save course");
      }
    } catch (err) {
      console.error("Error saving course:", err);
      setError(err.response?.data?.message || err.message || "Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.delete(`${backendUrl}/api/course/courses/${courseId}`, {
        withCredentials: true
      });

      if (response.data.success) {
        setSuccess("Course deleted successfully!");
        deleteCourse(courseId);
      } else {
        throw new Error(response.data.message || "Failed to delete course");
      }
    } catch (err) {
      console.error("Error deleting course:", err);
      setError(err.response?.data?.message || err.message || "Failed to delete course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold" color="#8d1f58">
          Manage Classes
      </Typography>
        <Tooltip title="Add New Class">
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => handleOpenDialog()}
            sx={{ backgroundColor: "#8d1f58" }}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {loading && (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress />
        </Box>
      )}

      <Grid container spacing={3}>
        {courses && courses.length > 0 ? (
          courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={course._id}>
              <Card
                sx={{
                  height: "500px", 
                  width: "100%", 
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 4,
                  background: "linear-gradient(135deg,rgb(249, 249, 249) 0%,rgb(240, 240, 240) 100%)",
                  boxShadow: "0 8px 32px rgba(116, 81, 45, 0.1)",
                  transition: "all 0.3s ease",
                  border: "1px solid rgba(116, 81, 45, 0.1)",
                  "&:hover": { 
                    transform: "translateY(-8px)",
                    boxShadow: "0 16px 48px rgba(116, 81, 45, 0.2)",
                  },
                  overflow: "hidden",
                }}
              >
            <CardMedia
              component="img"
                  height="220" 
                  image={fixImageUrl(course.image)}
              alt={course.title}
                  sx={{
                    objectFit: "cover",
                    backgroundColor: "#f5f5f5",
                    borderBottom: "1px solid rgba(116, 81, 45, 0.1)",
                  }}
                  onError={(e) => {
                    e.target.src = "/placeholder-image.png";
                  }}
                />
                <CardContent 
                  sx={{ 
                    flexGrow: 1, 
                    display: "flex", 
                    flexDirection: "column",
                    p: 2.5,
                    "&:last-child": { pb: 2.5 }
                  }}
                >
                  <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    color="#8d1f58" 
                    gutterBottom
                    sx={{
                      fontSize: "1.1rem",
                      lineHeight: 1.3,
                      mb: 1.5,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {course.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2, 
                      flexGrow: 1,
                      fontSize: "0.875rem",
                      lineHeight: 1.5,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {course.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={`$${course.price}`} 
                      color="primary" 
                      size="small" 
                      sx={{ 
                        mr: 1, 
                        backgroundColor: "#8d1f58",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "0.8rem",
                      }}
                    />
                    <Chip 
                      label={course.couchName} 
                      variant="outlined" 
                      size="small"
                      sx={{
                        borderColor: "#8d1f58",
                        color: "#8d1f58",
                        fontSize: "0.8rem",
                      }}
                    />
                  </Box>

                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      fontSize: "0.75rem",
                      lineHeight: 1.4,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    🕒 {course.timing?.length > 0 
                      ? course.timing.map(slot => `${slot.date} ${slot.time}`).join(" | ")
                      : "No schedule"
                    }
                  </Typography>

                  <Box sx={{ 
                    display: "flex", 
                    gap: 1, 
                    mt: "auto",
                    justifyContent: "center",
                  }}>
                    <IconButton
                      size="medium"
                      color="primary"
                      onClick={() => handleOpenDialog(course)}
                      sx={{ 
                        backgroundColor: "rgba(116, 81, 45, 0.1)",
                        "&:hover": {
                          backgroundColor: "rgba(116, 81, 45, 0.2)",
                        }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="medium"
                      color="error"
                      onClick={() => handleDelete(course._id)}
                      sx={{ 
                        backgroundColor: "rgba(244, 67, 54, 0.1)",
                        "&:hover": {
                          backgroundColor: "rgba(244, 67, 54, 0.2)",
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
          </CardContent>
        </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                No courses available. Create your first class!
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Add/Edit Course Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCourse ? "Edit Class" : "Add New Class"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Class Title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  required
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Price ($)"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Coach Name"
                  value={formData.couchName}
                  onChange={(e) => handleInputChange("couchName", e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              {/* File Upload Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Media Files
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: "center" }}>
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="image-upload"
                        type="file"
                        onChange={(e) => handleFileChange("image", e.target.files[0])}
                      />
                      <label htmlFor="image-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<CloudUploadIcon />}
                          fullWidth
                          sx={{ mb: 1 }}
                        >
                          {editingCourse ? "Change Image" : "Upload Image"}
                        </Button>
                      </label>
                      {imagePreview && (
                        <Box sx={{ mt: 1 }}>
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "4px" }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: "center" }}>
                      <input
                        accept="video/*"
                        style={{ display: "none" }}
                        id="video-upload"
                        type="file"
                        onChange={(e) => handleFileChange("video", e.target.files[0])}
                      />
                      <label htmlFor="video-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<CloudUploadIcon />}
                          fullWidth
                          sx={{ mb: 1 }}
                        >
                          {editingCourse ? "Change Video" : "Upload Video"}
                        </Button>
                      </label>
                 {videoPreview && (
  <Box sx={{ mt: 1 }}>
    <Typography variant="body2" sx={{ mb: 1 }}>Preview:</Typography>
   <video
      controls
  style={{
        width: "100%",
        height: "180px",
        objectFit: "cover",
        borderRadius: "4px",
        border: "1px solid #ccc"
  }}
>
      <source src={videoPreview} type="video/mp4" />
      Your browser does not support the video tag.
</video>

  </Box>
)}

                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Class Schedule
                </Typography>
                {formData.timing.map((slot, index) => (
                  <Box key={index} sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
                    <TextField
                      label="Date"
                      type="date"
                      value={slot.date}
                      onChange={(e) => handleTimingChange(index, "date", e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      select
                      label="Time"
                      value={slot.time}
                      onChange={(e) => handleTimingChange(index, "time", e.target.value)}
                      sx={{ flex: 1 }}
                    >
                       {[
                "8:00 AM","9:00 AM","10:00 AM","11:00 AM",
                "12:00 PM","1:00 PM","2:00 PM","3:00 PM",
                "4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM"
              ].map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
             ))}
                    </TextField>
                    {formData.timing.length > 1 && (
                      <IconButton
                        color="error"
                        onClick={() => removeTimingSlot(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  onClick={addTimingSlot}
                  sx={{ mt: 1 }}
                >
                  Add Time Slot
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ backgroundColor: "#8d1f58", borderRadius: '50px' }}
            >
              {loading ? <CircularProgress size={20} /> : (editingCourse ? "Update" : "Create")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}



export default AdminCourseList;

