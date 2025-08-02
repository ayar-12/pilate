import React, { useState, useContext } from "react";
import { Box, Grid, TextField, Button, Alert, Typography, Divider, Link,  Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import axios from 'axios';
import { AppContext } from "../context/AppContext";
const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const { backendUrl} = useContext(AppContext);

  const [status, setStatus] = useState({ type: "", message: "" });

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
    } catch (error) {
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

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>

            <TextField
              fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
              variant="outlined"
                />
           
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  variant="outlined"
            />
            
            <TextField
              fullWidth
              label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
              variant="outlined"
            />
           
            <TextField
              fullWidth
              label="Your Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
              multiline
                  rows={5}
                  variant="outlined"
            />

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
            
              <Dialog open={!!status.message} onClose={() => setStatus({ type: "", message: "" })}>
  <DialogTitle>{status.type === "success" ? "Success" : "Error"}</DialogTitle>
  <DialogContent>
    <Typography>{status.message}</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setStatus({ type: "", message: "" })} autoFocus>
      OK
    </Button>
  </DialogActions>
</Dialog>

            </Grid>
          </form>
            </Box>
          </Box>
    </Box>
  );
};

export default Contact;