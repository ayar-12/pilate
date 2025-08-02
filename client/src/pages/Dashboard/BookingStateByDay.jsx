import React, { useEffect, useState, useContext } from 'react';
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  CircularProgress,
  Box,
  Alert
} from '@mui/material';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';

function BookingStateByDay() {
  const { backendUrl } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/booking/booking-sesstion`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setBookings(res.data.data);
        } else {
          setError(res.data.message || 'Failed to fetch bookings');
        }
      } catch (err) {
        setError('Server error');
      } finally {
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, [backendUrl]);

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        All Bookings (Admin)
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center"><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Class</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Time</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((b) => (
              <TableRow key={b._id}>
                <TableCell>{b.userName || 'N/A'}</TableCell>
                <TableCell>{b.userEmail || 'N/A'}</TableCell>
                <TableCell>{b.userPhone || 'N/A'}</TableCell>
                <TableCell>{b.courseName || 'N/A'}</TableCell>
                <TableCell>{new Date(b.bookingDate).toLocaleDateString()}</TableCell>
                <TableCell>{b.selectedTime || 'TBA'}</TableCell>
                <TableCell>{b.status || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}

export default BookingStateByDay;
