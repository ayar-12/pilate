import React, { useState, useContext , useEffect} from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Grid
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from 'react-toastify';
import loginImg from '../assets/5.jpeg';

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
    setIsLoggedin(true);
    toast.success("Welcome back!", { position: "top-center", autoClose: 2000 });

    setTimeout(async () => {
      try {
        await getUserData();
      } catch (err) {
        console.error("User data fetch error:", err);
      } finally {
        navigate("/");
      }
    }, 200);
  } else {
    setError(data.message || "Login failed");
  }
} catch (err) {
  console.error("Login error:", err);
  setError(err.response?.data?.message || "Something went wrong.");
}



  useEffect(() => {
axios.get(`${backendUrl}/api/auth/is-auth`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }
})


      .then(res => {
        if (res.data.success) {
          setUserData(res.data.user); 

        } else {
          setUserData(null);
        }
      })
      .catch(err => {
        setUserData(null);
      });
  }, []);
  
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
        sx={{ px: { xs: 3, md: 6 }, py: 6 }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
           
            maxWidth: 800,
            p: { xs: 4, sm: 6 },
            borderRadius: 4,
            background: '#fff7f3a3',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={1} sx={{ color: "#8d1f58" }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={3}>
            Let's get you signed in
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
                sx={{ py: 1.5, borderRadius: 8, background: '#8d1f58' }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
              </Button>
            </Box>
          </form>

          <Box textAlign="center" mt={2}>
            <Link to="/forgot-password" style={{ fontSize: 14, color: '#555' }}>
              Forgot Password?
            </Link>
          </Box>

          <Box mt={3} textAlign="center">
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link to="/register" style={{ fontWeight: 'bold', color: '#8d1f58' }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Grid>

     
      <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" }, p: 0, m: 0 }}>
  <Box
    sx={{
      height: "80vh",
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
      marginLeft: '2px',
      marginTop: '80px'
      

    }}
  >

          <Typography variant="h6" fontWeight="bold">
            Transform Your Mind & Body with Yoga and Pilates
          </Typography>
          <Typography variant="body2" mt={1}>
            Experience holistic workouts that build strength, flexibility, and peace of mind — anywhere, anytime.
          </Typography>
          <Box display="flex" gap={2} mt={3} flexWrap="wrap">
            <Button variant="outlined" sx={{ color: '#fff', borderColor: '#fff', borderRadius: 8 }}>
              100% Healthy life
            </Button>
            <Button variant="outlined" sx={{ color: '#fff', borderColor: '#fff', borderRadius: 8 }}>
              Free trial for the first time
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
