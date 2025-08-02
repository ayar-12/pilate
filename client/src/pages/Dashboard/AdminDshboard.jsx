import React, { useState, useEffect , useContext} from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";

import {
  Box,
  Typography,

  Paper,
  Button,
  Tabs,
  Tab,

} from "@mui/material";
import AdminCourseList from "./AdminCourseList";
import AdminBlogList from "./AdminBlogList";
import { useNavigate } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow
} from "@mui/material";
import AdminHomeSettings from "./AdminHomeSettings";
import AdminClassList from "./AdminClassList.jsx";
import BookingStateByDay from "./BookingStateByDay";



const AdminDashboard = () => {
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userBookings, setUserBookings] = useState({}); 
  const { backendUrl, userData , getAllCourses} = useContext(AppContext);
  const [consultations, setConsultations] = useState([]);
  const navigate = useNavigate();




  useEffect(() => {
    const fetchUsers = async () => {
      try {
  const res = await axios.get(`${backendUrl}/api/admin/users`, { withCredentials: true })

        if (res.data.success) {
          setUsers(res.data.users);
        
          res.data.users.forEach(async (user) => {
            try {
            const bookingsRes = await axios.get(`${backendUrl}/api/booking/user-booked-admin?email=${user.email}`, { withCredentials: true });
              if (bookingsRes.data.success) {
                setUserBookings(prev => ({ ...prev, [user._id]: bookingsRes.data.data }));
              }
            } catch (err) {
              setUserBookings(prev => ({ ...prev, [user._id]: [] }));
            }
          });
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };
 if (userData && userData.role === 'admin') {
  fetchUsers()
 }
  },  [backendUrl, userData?.role]); 

  const handleTabChange = (e, newTab) => setTab(newTab);


  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/consultation/all`, { withCredentials: true });
        if (res.data.success) {
          setConsultations(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch consultations', err);
      }
    };
    if (userData?.role === 'admin') fetchConsultations();
  }, [backendUrl, userData]);


  return (
    <Box sx={{  minHeight: "100vh", py: 6, px: { xs: 2, md: 6 }, marginTop: '50px' }}>
      <Typography variant="h4" fontWeight="bold" color="#8d1f58" mb={4}>
        Admin Dashboard
      </Typography>


      <Tabs value={tab} onChange={handleTabChange} textColor="primary" indicatorColor="primary" variant="scrollable" scrollButtons>
        <Tab label="Users" />
        <Tab label="Booking" />
        <Tab label="Manage Classes" />
        <Tab label="Manage Blogs" />
        <Tab label="Home Page Content" />
        <Tab label="consultations" />
        <Tab label="Class Page" />
      </Tabs>

      <Box mt={4}>
      {tab === 0 && (
      <TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell><strong>Name</strong></TableCell>
        <TableCell><strong>Email</strong></TableCell>
        <TableCell align="right"><strong>Actions</strong></TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {users.map((user) => (
        <TableRow key={user._id}>
          <TableCell>{user.name}</TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell align="right">
            <Button
              size="small"
              variant="outlined"
              onClick={() => navigate(`/admin/user/${user._id}`)}
              sx={{ borderRadius: 20, textTransform: 'none', fontWeight: 'bold' }}
            >
              View Details
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
     )}
{tab === 1 && (
  <BookingStateByDay />
)}
     
        {tab === 2 && (
          <AdminCourseList />
        )}
   

        {tab === 3 && (
          <AdminBlogList />
        )}
   

       
        {tab === 4 && (
         <AdminHomeSettings />
        )}

{tab === 5 && (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell><strong>Name</strong></TableCell>
          <TableCell><strong>Email</strong></TableCell>
          <TableCell><strong>Phone</strong></TableCell>
          <TableCell><strong>Date</strong></TableCell>
          <TableCell><strong>Time</strong></TableCell>
          <TableCell><strong>Notes</strong></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {consultations.map(c => (
          <TableRow key={c._id}>
            <TableCell>{c.userName}</TableCell>
            <TableCell>{c.userEmail}</TableCell>
            <TableCell>{c.userPhone}</TableCell>
            <TableCell>{c.preferredDate}</TableCell>
            <TableCell>{c.preferredTime}</TableCell>
            <TableCell>{c.notes}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)}

{tab === 6 && (
  <AdminClassList />
   
)}
      </Box>
    </Box>
  );
};

export default AdminDashboard;