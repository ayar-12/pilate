import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const Login = () => {
  const { backendUrl, setIsLoggedin, getUserData, setUserData } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  // Centered alert dialog state
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      openAlert({ title: "Missing fields", message: "Please fill in all fields." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      openAlert({ title: "Invalid email", message: "Enter a valid email." });
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/login`, { email, password });

      if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        setIsLoggedin(true);

        // show success in centered modal, then fetch user + go home
        openAlert({
          title: "Welcome back!",
          message: "You’ve signed in successfully.",
          confirmText: "Continue",
          onConfirm: async () => {
            try {
              await getUserData();
            } catch (err) {
              console.error("User data fetch error:", err);
            } finally {
              navigate("/");
            }
          },
        });
      } else {
        openAlert({ title: "Login failed", message: data.message || "Something went wrong." });
      }
    } catch (err) {
      console.error("Login error:", err);
      openAlert({
        title: "Login error",
        message: err.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/auth/is-auth`, { withCredentials: true })
      .then((res) => {
        if (res.data.success) {
          setUserData(res.data.user);
          navigate("/");
        }
      })
      .catch(() => {
        setUserData(null);
      });
  }, [backendUrl, navigate, setUserData]);

  return (
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
          maxWidth: 480,
          p: { xs: 4, sm: 5 },
          borderRadius: 4,
          background: "#fff7f3a3",
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={1} sx={{ color: "#8d1f58" }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Let's get you signed in
        </Typography>

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            disabled={loading}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            disabled={loading}
            required
          />
          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ py: 1.5, borderRadius: 8, background: "#8d1f58", "&:hover": { background: "#7a1a4e" } }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
          </Box>
        </form>

        <Box textAlign="center" mt={2}>
          <Link to="/forgot-password" style={{ fontSize: 14, color: "#555" }}>
            Forgot Password?
          </Link>
        </Box>

        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            Don&apos;t have an account?{" "}
            <Link to="/register" style={{ fontWeight: "bold", color: "#8d1f58" }}>
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>

      {/* Centered alert dialog (blurred backdrop, 20px radius) */}
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
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#8d1f58" }}>
          {alert.title}
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          {alert.message}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAlert} autoFocus>
            {alert.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;

