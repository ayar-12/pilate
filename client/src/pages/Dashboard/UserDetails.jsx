import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';

const UserDetails = () => {
  const { id } = useParams(); // user ID from route
  const { backendUrl } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const userRes = await axios.get(`${backendUrl}/api/admin/user/${id}`, { withCredentials: true });
        const bookingRes = await axios.get(`${backendUrl}/api/booking/user-booked-admin?email=${userRes.data.user.email}`, { withCredentials: true });

        if (userRes.data.success) setUser(userRes.data.user);
        if (bookingRes.data.success) setBookings(bookingRes.data.data);
      } catch (err) {
        console.error("Failed to load user details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [backendUrl, id]);

  if (loading) return <Typography sx={{ p: 4 }}>Loading user details...</Typography>;
  if (!user) return <Typography sx={{ p: 4 }}>User not found.</Typography>;

  return (
    <Box sx={{ p: 4, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h5" fontWeight="bold" color="#74512D" gutterBottom>
        User Profile
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="subtitle1"><strong>Name:</strong> {user.name}</Typography>
        <Typography variant="subtitle1"><strong>Email:</strong> {user.email}</Typography>
        <Typography variant="subtitle1"><strong>Phone:</strong> {user.phone}</Typography>
        {user.age && <Typography variant="subtitle1"><strong>Age:</strong> {user.age}</Typography>}
        {user.role && <Typography variant="subtitle1"><strong>Role:</strong> {user.role}</Typography>}
      </Paper>

      <Typography variant="h6" color="#74512D" mb={2}>
        Booking History
      </Typography>

      {bookings.length > 0 ? (
        <List>
          {bookings.map((booking) => (
            <React.Fragment key={booking._id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={booking.courseName}
                  secondary={`Date: ${new Date(booking.bookingDate).toLocaleDateString()} | Time: ${booking.selectedTime} | Status: ${booking.status}`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography color="textSecondary">No bookings found.</Typography>
      )}
    </Box>
  );
};

export default UserDetails;
