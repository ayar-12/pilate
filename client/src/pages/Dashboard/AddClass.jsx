import React, { useState, useContext } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const AddClassPage = () => {
  const { backendUrl } = useContext(AppContext);
  const [title, setTitle] = useState("");
  const [timing, setTiming] = useState(""); // JSON string like: [{"date":"2025-08-10","time":"10:00 AM"}]
  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);
  const [description, setDescription] = useState("");
  const [couchName, setCouchName] = useState(""); // correct spelling with 'u'
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleAddClass = async () => {
    if (!title || !timing || !description || !couchName || !price || !photo) {
      toast.error("Please fill in all required fields.");
      return;
    }

    let parsedTiming;
    try {
      parsedTiming = JSON.parse(timing);
      if (!Array.isArray(parsedTiming)) throw new Error();
    } catch {
      toast.error("Timing must be a valid JSON array.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("couchName", couchName);
    formData.append("timing", JSON.stringify(parsedTiming));
    formData.append("image", photo);
    if (video) formData.append("video", video);

    setLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/course/courses`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (data.success) {
        toast.success("Class added successfully!");
        setShowSuccessDialog(true);
        setTitle("");
        setTiming("");
        setDescription("");
        setCouchName("");
        setPrice("");
        setPhoto(null);
        setVideo(null);
      } else {
        toast.error(data.message || "Failed to add class");
      }
    } catch (err) {
      console.error("Error saving course:", err);
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessDialogClose = () => setShowSuccessDialog(false);

  return (
    <Box sx={{ background: "#f6f0ed", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", px: 2 }}>
      <Paper sx={{ p: 4, borderRadius: 3, width: "100%", maxWidth: 500, background: "#fff8f1" }}>
        <Typography variant="h5" fontWeight="bold" color="#74512D" mb={2}>
          Add New Pilates Class
        </Typography>

        <TextField label="Class Title" fullWidth margin="normal" value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} />
        <TextField label='Timing (JSON format)' fullWidth margin='normal' value={timing} onChange={(e) => setTiming(e.target.value)} disabled={loading} placeholder='[{"date":"2025-08-10","time":"10:00 AM"}]' />
        <TextField label="Description" fullWidth multiline rows={3} margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} disabled={loading} />
        <TextField label="Price (OMR)" fullWidth margin="normal" type="number" value={price} onChange={(e) => setPrice(e.target.value)} disabled={loading} />
        <TextField label="Coach Name" fullWidth margin="normal" value={couchName} onChange={(e) => setCouchName(e.target.value)} disabled={loading} />

        <Typography variant="subtitle1" mt={2}>Image</Typography>
        <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} disabled={loading} />

        <Typography variant="subtitle1" mt={2}>Video (optional)</Typography>
        <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} disabled={loading} />

        <Button fullWidth variant="contained" sx={{ mt: 3, borderRadius: 999, backgroundColor: "#74512D", fontWeight: "bold" }} onClick={handleAddClass} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Add Class"}
        </Button>
      </Paper>

      <Dialog open={showSuccessDialog} onClose={handleSuccessDialogClose}>
        <DialogTitle sx={{ color: "#74512D", fontWeight: "bold" }}>🎉 Class Added!</DialogTitle>
        <DialogContent>
          <Typography>New class has been created successfully.</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={handleSuccessDialogClose} variant="contained" sx={{ borderRadius: 999, backgroundColor: "#8d1f58" }}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddClassPage;
