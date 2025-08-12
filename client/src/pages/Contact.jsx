import React, { useState, useContext } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Divider,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const { backendUrl } = useContext(AppContext);

  const [status, setStatus] = useState({ type: "", message: "" });
  const isOpen = Boolean(status.message);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/api/contact`, formData);
      setStatus({ type: "success", message: "Message sent successfully!" });
      setFormData({ firstName: "", lastName: "", email: "", message: "" });
    } catch {
      setStatus({ type: "error", message: "Failed to send message." });
    }
  };

  return (
    <Box sx={{ py: 10, px: 2, minHeight: "100vh" }}>
      <Box
        maxWidth="lg"
        mx="auto"
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        gap={4}
        alignItems="stretch"
      >
        {/* Left: contact info */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "100%",
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} color="#8d1f58" gutterBottom>
              Get in touch
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              Whether you have questions, feedback, or just want to connect — we’d love to hear from you!
            </Typography>

            <Box mb={3}>
              <Typography fontWeight={600} color="#74512D">📧 Email</Typography>
              <Link href="mailto:hello@yogaflex.om" underline="hover" color="text.primary">
                hello@yogaflex.om
              </Link>
            </Box>

            <Box mb={3}>
              <Typography fontWeight={600} color="#74512D">📞 Call</Typography>
              <Typography color="text.primary">+968 9123 4567</Typography>
            </Box>

            <Box mb={3}>
              <Typography fontWeight={600} color="#74512D">📍 Location</Typography>
              <Typography color="text.primary">Al Khuwair, Muscat, Oman</Typography>
            </Box>
          </Box>

          <Box>
            <Typography fontWeight={600} color="#74512D" gutterBottom>
              ⏰ Business Hours
            </Typography>
            <Typography color="text.primary">Mon–Fri: 8:00 AM – 8:00 PM</Typography>
            <Typography color="text.primary">Saturday: 10:00 AM – 4:00 PM</Typography>
            <Typography color="text.primary">Sunday: Closed</Typography>
          </Box>
        </Box>

        {/* Right: form */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            bgcolor: "#EFEEEA",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: "100%",
          }}
        >
          <Typography
            variant="h5"
            fontWeight={600}
            mb={3}
            color="#8d1f58"
            textAlign="center"
          >
            Send us a message
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Your Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  multiline
                  rows={5}
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    py: 1.6,
                    borderRadius: "50px",
                    fontWeight: "bold",
                    backgroundColor: "#66001F",
                    "&:hover": { backgroundColor: "#5a001a" },
                  }}
                >
                  Send Message
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>

      {/* Centered alert dialog with blur + 20px radius */}
      <Dialog
        open={isOpen}
        onClose={() => setStatus({ type: "", message: "" })}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            backgroundColor: "rgba(0,0,0,0.25)",
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            bgcolor: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.5)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: status.type === "success" ? "success.main" : "error.main" }}>
          {status.type === "success" ? "Success" : "Error"}
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Typography>{status.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatus({ type: "", message: "" })} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Contact;
