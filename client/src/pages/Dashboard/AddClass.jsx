import React, { useState, useContext } from "react";
import {
  Box, Typography, TextField, Button, Paper, Dialog, DialogTitle,
  DialogContent, DialogActions, CircularProgress, LinearProgress
} from "@mui/material";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const MAX_FILE_MB = 50;

const AddClassPage = () => {
  const { backendUrl } = useContext(AppContext);
  const [title, setTitle] = useState("");
  const [timing, setTiming] = useState(''); // e.g. [{"date":"2025-08-10","time":"10:00 AM"}]
  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);
  const [description, setDescription] = useState("");
  const [couchName, setCouchName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const validateFile = (file, label, accept) => {
    if (!file) return true;
    if (!file.type.startsWith(accept)) {
      toast.error(`${label} must be a ${accept.replace("/", "")}`);
      return false;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      toast.error(`${label} must be <= ${MAX_FILE_MB}MB`);
      return false;
    }
    return true;
  };

  const handleAddClass = async () => {
    if (!title || !timing || !description || !couchName || !price || !photo) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Validate timing JSON
    let parsedTiming;
    try {
      parsedTiming = JSON.parse(timing);
      if (!Array.isArray(parsedTiming) || parsedTiming.length === 0) throw new Error();
    } catch {
      toast.error("Timing must be a non-empty JSON array. Example: " +
        `[{"date":"2025-08-10","time":"10:00 AM"}]`);
      return;
    }

    // Validate files against backend limits (multer 50MB)
    if (!validateFile(photo, "Image", "image/")) return;
    if (video && !validateFile(video, "Video", "video/")) return;

    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("description", description.trim());
    fd.append("price", String(price).trim());
    fd.append("couchName", couchName.trim());
    fd.append("timing", JSON.stringify(parsedTiming));
    fd.append("image", photo);
    if (video) fd.append("video", video);

    setLoading(true);
    setProgress(0);

    // If you use Bearer tokens instead of cookies, pull it from storage:
    const token = localStorage.getItem("token");

    try {
      const { data } = await axios.post(`${backendUrl}/api/course/courses`, fd, {
        // DO NOT set Content-Type manually; let the browser set the multipart boundary
        withCredentials: true, // needed if you use cookie auth
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          const pct = Math.round((evt.loaded * 100) / evt.total);
          setProgress(pct);
        }
      });

      if (data?.success) {
        toast.success("Class added successfully!");
        setShowSuccessDialog(true);
        // reset
        setTitle(""); setTiming(""); setDescription("");
        setCouchName(""); setPrice(""); setPhoto(null); setVideo(null);
        setProgress(0);
      } else {
        toast.error(data?.message || "Failed to add class");
      }
    } catch (err) {
      console.error("Error saving course:", err);
      const msg = err.response?.data?.message || err.message || "Something went wrong.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessDialogClose = () => setShowSuccessDialog(false);

  return (
    <Box sx={{
      background: "#f6f0ed",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      px: 2
    }}>
      <Paper sx={{ p: 4, borderRadius: 3, width: "100%", maxWidth: 500, background: "#fff8f1" }}>
        <Typography variant="h5" fontWeight="bold" color="#74512D" mb={2}>
          Add New Pilates Class
        </Typography>

        <TextField label="Class Title" fullWidth margin="normal"
          value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} />

        <TextField label="Timing (JSON format)" fullWidth margin="normal"
          value={timing} onChange={(e) => setTiming(e.target.value)} disabled={loading}
          placeholder='[{"date":"2025-08-10","time":"10:00 AM"}]' />

        <TextField label="Description" fullWidth multiline rows={3} margin="normal"
          value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading} />

        <TextField label="Price (OMR)" fullWidth margin="normal" type="number"
          value={price} onChange={(e) => setPrice(e.target.value)} disabled={loading} />

        <TextField label="Coach Name" fullWidth margin="normal"
          value={couchName} onChange={(e) => setCouchName(e.target.value)} disabled={loading} />

        <Typography variant="subtitle1" mt={2}>Image</Typography>
        <input type="file" accept="image/*"
          onChange={(e) => setPhoto(e.target.files?.[0] || null)} disabled={loading} />
        {photo && (
          <img src={URL.createObjectURL(photo)} alt="Preview" style={{ width: "100%", marginTop: 10 }} />
        )}

        <Typography variant="subtitle1" mt={2}>Video (optional)</Typography>
        <input type="file" accept="video/*"
          onChange={(e) => setVideo(e.target.files?.[0] || null)} disabled={loading} />

        {loading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
              Uploading… {progress}%
            </Typography>
          </Box>
        )}

        <Button fullWidth variant="contained"
          sx={{ mt: 3, borderRadius: 999, backgroundColor: "#74512D", fontWeight: "bold" }}
          onClick={handleAddClass} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Add Class"}
        </Button>
      </Paper>

      <Dialog open={showSuccessDialog} onClose={handleSuccessDialogClose}>
        <DialogTitle sx={{ color: "#74512D", fontWeight: "bold" }}>🎉 Class Added!</DialogTitle>
        <DialogContent>
          <Typography>New class has been created successfully.</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={handleSuccessDialogClose} variant="contained"
            sx={{ borderRadius: 999, backgroundColor: "#8d1f58" }}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddClassPage;
