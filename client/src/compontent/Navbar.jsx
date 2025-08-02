import React, { useContext, useState } from "react";
import { Menu, User, Search, ChevronDown } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import "./navbra.css";
import logo from "../assets/logo.jpg";
import { AppContext } from "../context/AppContext"
import axios from "axios";
import { toast } from "react-toastify";
import avatar from '../assets/5.jpeg'

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { userData, backendUrl, setUserData, setIsLoggedin, setCourses } = useContext(AppContext);
  const location = useLocation();

const getAvatarUrl = (avatar) => {
  if (!avatar) return avater;
  if (avatar.startsWith('http')) return avatar; 
  return `${backendUrl}/${avatar}`; 
};



  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        navigate("/");
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
      <Link to='/'>
      <img src={logo} alt="Logo" className="navbar-logo" /></Link>
      <nav className="nav-links">
  <Link to="/" className={location.pathname === '/' ? 'active-link' : ''}>Home</Link>
  <Link to="/class" className={location.pathname === '/class' ? 'active-link' : ''}>Class</Link>
  <Link to="/blog" className={location.pathname === '/blog' ? 'active-link' : ''}>Blog</Link>
  <Link to="/contact" className={location.pathname === '/contact' ? 'active-link' : ''}>Contact</Link>
</nav>

      </div>

      <div className="navbar-right" style={{ marginRight: "50px" }}>


        {userData ? (
  <div className="user-dropdown-wrapper" onClick={() => setShowDropdown(!showDropdown)}>
    <div className="user-avatar">
{userData.avatar ? (
  <img src={getAvatarUrl(userData.avatar)} alt="avatar" />
) : (
  <img src={avatar} alt="default avatar" />
)}

    </div>
    <ChevronDown size={18} />

    {showDropdown && (
      <div className="dropdown-menu-glass">
        {!userData.isAccountVerified && (
          <Link to='/email-verify' >🔒 Verify Email</Link>
        )}
       <Link to={userData.role === "admin" ? "/admin-dashboard" : "/user-dashboard"}>👤 Profile</Link>


        <Link to="/my-booking">📅 My Booking</Link>
      
        <li onClick={logout}>🚪 Logout</li>
      </div>
    )}
  </div>
) : (
  <Link to="/login" className="user-icon-login">
    <User size={20} style={{color: 'black'}} />
  </Link>
)}
</div>

   
      <div className="navbar-mobile" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <Menu size={24} />
        {isMenuOpen && (
          <div className="mobile-menu dropdown-menu-glass">
            <Link to="/">Home</Link>
            <Link to="/class">Class</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/contact">Contact</Link>
            
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
