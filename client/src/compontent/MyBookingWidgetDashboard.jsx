import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Paper,
  Button
} from '@mui/material';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

const DashboardWidget = ({ title, children, sx }) => (
  <Paper
    sx={{
      p: 2,
      borderRadius: 4,
      backgroundColor: '#FDFAF6',
      color: '#4A2F1B',
      ...sx,
    }}
  >
    <Typography fontWeight="bold" mb={1} color="#8d1f58">
      {title}
    </Typography>
    {children}
  </Paper>
);

const MyBookingWidgetDashboard = () => {
  const { backendUrl } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
  const fetchUserBookings = async () => {
    try {
  const token = localStorage.getItem('token');
const res = await axios.get(`${backendUrl}/api/booking/user-booked`, {
  headers: {
    Authorization: `Bearer ${token}`,
  }
});

      if (res.data.success) {
        setBookings(res.data.data.slice(0, 3));
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  fetchUserBookings();
}, [backendUrl]);


  return (
    <Grid item xs={12} md={3} >
      <DashboardWidget title="MY BOOKING" sx={{
  height: 'auto',
  width: { xs: 400, md: 400 }
}}>
        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : bookings.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            No bookings found.
          </Typography>
        ) : (
          <>
            <List>
              {bookings.map((booking) => (
                <ListItem key={booking._id} sx={{ borderBottom: '1px solid #e5cfc1' }}>
                  <ListItemText
                    primary={booking.courseName}
                    secondary={`Date: ${new Date(booking.bookingDate).toLocaleDateString()} | Time: ${booking.selectedTime} | Status: ${booking.status}`}
                  />
                </ListItem>
              ))}
            </List>
          <Box textAlign="right" mt={2}>
    <Link to="/my-booking" style={{ textDecoration: 'none' }}>
      <Button size="small" sx={{ color: '#8d1f58', fontWeight: 'bold' }}>
        Show More →
      </Button>
    </Link>
  </Box>
          </>
        )}
      </DashboardWidget>
    </Grid>
  );
};

export default MyBookingWidgetDashboard;
