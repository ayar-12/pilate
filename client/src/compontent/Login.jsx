import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Login = () => {
  const { backendUrl, setIsLoggedin, getUserData, setUserData } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) return setError("Please fill in all fields");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return setError("Enter a valid email");

    setLoading(true);

    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/login`, { email, password });

      if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

        setIsLoggedin(true);
        toast.success("Welcome back!", { position: "top-center", autoClose: 2000 });

        try {
          await getUserData();
        } catch (err) {
          console.error("User data fetch error:", err);
        } finally {
          navigate("/");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Something went wrong.");
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
        background: "#fff",
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

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
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
              sx={{ py: 1.5, borderRadius: 8, background: "#8d1f58" }}
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
    </Box>
  );
};

export default Login;

