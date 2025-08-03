import React, { useContext, useState } from "react";
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
  Grid,
} from "@mui/material";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import loginImg from "../assets/5.jpeg";

const RegisterForm = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    if (!name || !email || !password || !phone || !age) {
      setError("Please fill in all fields.");
      toast.error("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        phone,
        age,
        photo: "", // optional
      };
      
      
      

      const { data } = await axios.post(
        `${backendUrl}/api/auth/register`,
        payload,
        { withCredentials: true }
      );

      if (data.success) {
        setShowSuccessDialog(true);
      } else {
        setError(data.message || "Registration failed");
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Something went wrong");
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    navigate("/login");
  };

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
         <Grid
             item
             xs={12}
             md={6}
             lg={6}
             display="flex"
             alignItems="center"
             justifyContent="center"
             sx={{ px: { xs: 3, md: 6 }, py: 6, marginTop: 10 }}
           >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100%" }}
        >
          <Paper
            elevation={0}
      sx={{
              width: "100%",
              maxWidth: 400,
              p: 6,
              borderRadius: 4,
              background: "#fff7f3a3",
              backdropFilter: "blur(10px)",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              mb={1}
              sx={{ color: "#8d1f58" }}
            >
          Create Account
        </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
              Let's get new life vibes ✨
            </Typography>

            {error && (
              <Typography
                color="error"
                sx={{ mb: 2, textAlign: "center" }}
              >
                {error}
              </Typography>
            )}

            <TextField
              label="Name"
              fullWidth
              margin="normal"
              onChange={(e) => setName(e.target.value)}
              value={name}
              disabled={loading}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              disabled={loading}
            />
            <TextField
              label="Phone"
              fullWidth
              margin="normal"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              disabled={loading}
            />
            <TextField
              label="Age"
              type="number"
              fullWidth
              margin="normal"
              onChange={(e) => setAge(e.target.value)}
              value={age}
              disabled={loading}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              disabled={loading}
            />

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            borderRadius: 999,
                backgroundColor: "#8d1f58",
            fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#F9F3EF",
                  color: "#8d1f58",
                },
          }}
          onClick={handleRegister}
          disabled={loading}
        >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Register"
              )}
        </Button>

            <Box mt={3} textAlign="center">
              <Typography variant="body2">
                I have an account already!{" "}
                <Link
                  to="/login"
                  style={{ fontWeight: "bold", color: "#8d1f58" }}
                >
                  Login
                </Link>
              </Typography>
            </Box>
      </Paper>
        </Box>
      </Grid>

      <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" }, p: 0, m: 0,}}>
       <Box
          sx={{
            height: "100vh",
            width: "850px",
            backgroundImage: `url(${loginImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            color: "white",
            p: 6,
            borderBottomLeftRadius: 20,
            borderTopLeftRadius: '20px',
            marginLeft: '90px',
            marginTop: '80px'
            
      
          }}>
          <Typography variant="h6" fontWeight="bold">
            Transform Your Mind & Body with Yoga and Pilates
          </Typography>
          <Typography variant="body2" mt={1}>
            Experience holistic workouts that build strength, flexibility, and peace of mind — anywhere, anytime.
          </Typography>
          <Box display="flex" gap={2} mt={3} flexWrap="wrap">
            <Button variant="outlined" sx={{ color: "#fff", borderColor: "#fff", borderRadius: 8 }}>
              100% Healthy Life
            </Button>
            <Button variant="outlined" sx={{ color: "#fff", borderColor: "#fff", borderRadius: 8 }}>
              Free trial for the first time
            </Button>
          </Box>
        </Box>
      </Grid>

      <Dialog
        open={showSuccessDialog}
        onClose={handleSuccessDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            textAlign: "center",
            p: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#74512D",
            fontWeight: "bold",
            fontSize: "1.5rem",
          }}
        >
          🎉 Registration Successful!
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Welcome to Yoga Courses! Your account has been created successfully.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            A welcome email has been sent to <strong>{email}</strong>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={handleSuccessDialogClose}
            variant="contained"
            sx={{
              backgroundColor: "#74512D",
              borderRadius: 999,
              px: 4,
              "&:hover": {
                backgroundColor: "#5a3e23",
              },
            }}
          >
            Continue to Login
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default RegisterForm;
