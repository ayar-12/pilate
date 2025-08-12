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
} from "@mui/material";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate, Link } from "react-router-dom";

const RegisterForm = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [age, setAge]           = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  // Centered alert dialog
  const [alert, setAlert] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "OK",
    onConfirm: null,
  });

  const openAlert = ({ title, message, confirmText = "OK", onConfirm = null }) =>
    setAlert({ open: true, title, message, confirmText, onConfirm });

  const closeAlert = async () => {
    const cb = alert.onConfirm;
    setAlert((a) => ({ ...a, open: false }));
    if (typeof cb === "function") await cb();
  };

  const handleRegister = async () => {
    setError("");

    if (!name || !email || !password || !phone || !age) {
      setError("Please fill in all fields.");
      openAlert({ title: "Missing fields", message: "Please fill in all fields." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      openAlert({ title: "Invalid email", message: "Please enter a valid email address." });
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      openAlert({ title: "Weak password", message: "Password must be at least 6 characters long." });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        age: String(age).trim(),
        photo: "",
      };

      const { data } = await axios.post(
        `${backendUrl}/api/auth/register`,
        payload,
        { withCredentials: true }
      );

      if (data.success && data.userId) {
        openAlert({
          title: "Account created",
          message: `We sent a verification code to ${email.trim()}.`,
          confirmText: "Verify now",
          onConfirm: () => navigate("/email-verify", { state: { userId: data.userId } }),
        });
      } else {
        const msg = data.message || "Registration failed.";
        setError(msg);
        openAlert({ title: "Registration failed", message: msg });
      }
    } catch (err) {
      const message = err.response?.data?.message;
      const friendly =
        message?.toLowerCase().includes("exists")
          ? "This email is already registered."
          : (message || "Something went wrong. Please try again.");
      setError(friendly);
      openAlert({ title: "Error", message: friendly });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Centered full-screen form */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 6,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 420,
            p: { xs: 4, sm: 5 },
            borderRadius: 4,
            background: "#fff7f3a3",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={1} sx={{ color: "#8d1f58" }}>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Let's get new life vibes ✨
          </Typography>

          {error && (
            <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
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
            onFocus={() => setError("")}
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
              "&:hover": { backgroundColor: "#F9F3EF", color: "#8d1f58" },
            }}
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
          </Button>

          <Box mt={3} textAlign="center">
            <Typography variant="body2">
              I have an account already!{" "}
              <Link to="/login" style={{ fontWeight: "bold", color: "#8d1f58" }}>
                Login
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Centered alert dialog with blurred backdrop + 20px radius */}
      <Dialog
        open={alert.open}
        onClose={closeAlert}
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
            textAlign: "center",
            p: 0,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#8d1f58" }}>
          {alert.title}
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>{alert.message}</DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={closeAlert} autoFocus>
            {alert.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RegisterForm;
