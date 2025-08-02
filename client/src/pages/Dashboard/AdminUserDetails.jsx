import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Paper, Typography, Box, CircularProgress, Button } from "@mui/material";
import { AppContext } from "../../context/AppContext";

function AdminUserDetails() {
  const { backendUrl } = useContext(AppContext); 
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);        // ← add loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get(
      `${backendUrl}/api/admin/user/${id}`,             // ← singular “user”
      { withCredentials: true }
    )
    .then(res => {
      console.log("API response:", res.data);
      if (res.data.success) {
        setUser(res.data.data);
      } else {
        setError(res.data.message);
      }
    })
    .catch(err => {
      console.error("Fetch failed:", err);
      setError(err.response?.data?.message || err.message);
    })
    .finally(() => setLoading(false));
  }, [id, backendUrl]);

  if (loading) return <CircularProgress />;
  if (error)   return <Typography color="error">{error}</Typography>;
  if (!user)   return <Typography>No user found.</Typography>;

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Box mb={2}>
        <Button component={Link} to="/admin/users" variant="outlined">
          ← Back to list
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom>
        User Details
      </Typography>
      <Typography><strong>Name:</strong> {user.name}</Typography>
      <Typography><strong>Email:</strong> {user.email}</Typography>
      <Typography><strong>Role:</strong> {user.role || "—"}</Typography>
      <Typography>
        <strong>Joined on:</strong>{" "}
        {new Date(user.createdAt).toLocaleDateString()}
      </Typography>
      <Typography><strong>Phone:</strong> {user.phone || "N/A"}</Typography>
      <Typography><strong>Address:</strong> {user.address || "N/A"}</Typography>
    </Paper>
  );
}

export default AdminUserDetails;
