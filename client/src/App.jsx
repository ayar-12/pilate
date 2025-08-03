import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './compontent/Navbar';
import Class from './pages/Class';
import Booking from './pages/Booking';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import UserDashboard from './pages/Dashboard/UserDashboard';
import AdminDashboard from './pages/Dashboard/AdminDshboard';
import RegisterForm from './compontent/RegisterForm';
import Login from './compontent/Login';
import BookingDetails from './pages/BookingDetails';
import ResetPassword from './pages/ResetPassword';
import EmailVerify from './pages/EmailVerify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/HomePage';
import WorkoutMeals from './pages/FitnessTools/WorkoutMeals';
import EditProfile from './pages/Dashboard/EditProfile';
import ProtectedRouter from './Protect/ProtectedRouter';
import AdminRouter from './Protect/AdminRouter';
import MyBookingWidget from './compontent/MyBookingWidget';
import AllTasksPage from './compontent/AllTasks';
import UserDetails from './pages/Dashboard/UserDetails';
import {AnimatePresence} from  'framer-motion'
import { useLocation } from 'react-router-dom';

import BlogDetails from './pages/BlogDetails';
import BookConsultation from './pages/BookConsultation';
import AdminUserDetails from './pages/Dashboard/AdminUserDetails';
import BookingStateByDay from './pages/Dashboard/BookingStateByDay';
import CalorieCalculator from './pages/Dashboard/CalorieCalculator';

function App() {
  useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);

 const location = useLocation();

 

  return (
    <>
        <div
      style={{
     background: 'linear-gradient(135deg, rgb(252, 245, 248), rgb(234, 219, 229), rgb(230, 219, 226), rgb(237, 224, 233), rgb(239, 239, 246))',
     
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
    <Navbar />
      <AnimatePresence mode="wait">
  <Routes location={location} key={location.pathname}>
  
      <Route path="/" element={<HomePage />} />
      <Route path="/class" element={<Class />} />
      <Route path="/booking/:courseId" element={<Booking />} />
      <Route path="/contact" element={<Contact />} />
      <Route path='/blog' element={<Blog />}/>
      <Route path='/blog-details/:id' element={<BlogDetails />}/>
      <Route path='/user-dashboard' element={
        <ProtectedRouter>
          <UserDashboard />
        </ProtectedRouter>
      }/>
      <Route path='/admin-dashboard' element={ 
        <AdminRouter>
          <AdminDashboard />
        </AdminRouter>
      }/>
  
        <Route path='/admin/booking-state' element={
        <AdminRouter>
          <BookingStateByDay />
        </AdminRouter>
      } />
          <Route path='/admin/user/:id' element={
        <AdminRouter>
          <UserDetails />
        </AdminRouter>
      } />
      <Route path='/login' element={<Login />}/>
      <Route path='/register' element={<RegisterForm />}/>
      <Route path="/booking-details/:courseId" element={<BookingDetails />} />
      <Route path='/forgot-password' element={<ResetPassword />}/>
      <Route path='/email-verify' element={<EmailVerify />}/>
      <Route path='/book-consultation' element={<BookConsultation />}/>
      <Route path='/workout-meals' element={<WorkoutMeals />}/>
      <Route path="/edit-profile" element={       <ProtectedRouter> 
   
        <EditProfile />
        </ProtectedRouter>} />
        <Route path="/my-booking" element={       <ProtectedRouter> 
   
   <MyBookingWidget />
   </ProtectedRouter>} />

   <Route path="/all-tasks" element={       <ProtectedRouter> 
   
   <AllTasksPage />
   </ProtectedRouter>} />

   <Route path="/calories-data" element={       <ProtectedRouter> 
   
   <CalorieCalculator />
   </ProtectedRouter>} />

    </Routes>
</AnimatePresence>
    <ToastContainer
    position="top-center"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    pauseOnHover
    theme="colored"
    draggable
  />
    </div>
    </>
  );
}

export default App;
