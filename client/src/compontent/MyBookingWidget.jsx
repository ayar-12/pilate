import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Paper,
} from '@mui/material';
import { AppContext } from '../context/AppContext';

const DashboardWidget = ({ title, children, sx }) => (
  <Paper
    elevation={3}
    sx={{
      p: 5,
      borderRadius: 4,
      backgroundColor: '#fff',
      color: '#4A2F1B',
      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
      marginTop: 5,
      marginLeft:5,
      marginRight:5,
      ...sx,
    }}
  >
    <Typography fontWeight={700} mb={2} fontSize={18} color="#8d1f58">
      {title}
    </Typography>
    {children}
  </Paper>
);

const MyBookingWidget = () => {
  const { backendUrl } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/booking/user-booked`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setBookings(res.data.data);
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
    <Grid item xs={12}>
      <DashboardWidget title="My Booking Schedule">
        {loading ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress size={28} />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : bookings.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            No bookings found.
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Course</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Time</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow
                    key={booking._id}
                    hover
                    sx={{ '&:last-child td': { borderBottom: 0 } }}
                  >
                    <TableCell>
                      {booking.course?.title || booking.courseName || 'Untitled'}
                    </TableCell>
                    <TableCell>
                      {new Date(booking.bookingDate).toLocaleDateString('en-GB')}
                    </TableCell>
                    <TableCell>{booking.selectedTime || 'TBA'}</TableCell>
                    <TableCell>{booking.status || 'Pending'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DashboardWidget>
    </Grid>
  );
};

export default MyBookingWidget;
