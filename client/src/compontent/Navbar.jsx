 import React, { useContext, useState, useEffect } from "react";
import { Menu, User, ChevronDown } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./navbra.css";
import logo from "../assets/logo.jpg";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import avatarFallback from "../assets/5.jpeg";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContext);

  // centered alert dialog state
  const [alert, setAlert] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "OK",
  });
  const openAlert = ({ title, message, confirmText = "OK" }) =>
    setAlert({ open: true, title, message, confirmText });
  const closeAlert = () => setAlert((a) => ({ ...a, open: false }));

  // close dropdown when route changes
  useEffect(() => {
    setShowDropdown(false);
    setIsMenuOpen(false);
  }, [location.pathname]);

  const getAvatarUrl = (src) => {
    if (!src) return avatarFallback;
    if (src.startsWith("http")) return src;
    return `${backendUrl}/${src.replace(/^\/+/, "")}`;
  };


const logout = async () => {
  try {
    await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });
  } catch (_) {
    // ignore
  }

  // drop auth
  localStorage.removeItem('token');
  delete axios.defaults.headers.common.Authorization;
  setIsLoggedin(false);
  setUserData(null);

  // close dropdown if open
  setShowDropdown(false);

  // go to LOGIN (not home)
  navigate('/login', { replace: true, state: { fromLogout: true } });
};


  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/"><img src={logo} alt="Logo" className="navbar-logo" /></Link>

        <nav className="nav-links">
          <Link to="/" className={location.pathname === "/" ? "active-link" : ""}>Home</Link>
          <Link to="/class" className={location.pathname === "/class" ? "active-link" : ""}>Class</Link>
          <Link to="/blog" className={location.pathname === "/blog" ? "active-link" : ""}>Blog</Link>
          <Link to="/contact" className={location.pathname === "/contact" ? "active-link" : ""}>Contact</Link>
        </nav>
      </div>

      <div className="navbar-right" style={{ marginRight: "50px" }}>
        {userData ? (
          <div
            className="user-dropdown-wrapper"
            onClick={() => setShowDropdown((s) => !s)}
          >
            <div className="user-avatar">
              <img src={getAvatarUrl(userData.avatar)} alt="avatar" />
            </div>
            <ChevronDown size={18} />

            {showDropdown && (
              <div className="dropdown-menu-glass" onClick={(e) => e.stopPropagation()}>
                {!userData.isAccountVerified && (
                  <Link to="/email-verify">🔒 Verify Email</Link>
                )}
                <Link to={userData.role === "admin" ? "/admin-dashboard" : "/user-dashboard"}>
                  👤 Profile
                </Link>
                <Link to="/my-booking">📅 My Booking</Link>
                <div onClick={logout} style={{ cursor: "pointer" }}>🚪 Logout</div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="user-icon-login">
            <User size={20} style={{ color: "black" }} />
          </Link>
        )}
      </div>

      <div className="navbar-mobile" onClick={() => setIsMenuOpen((m) => !m)}>
        <Menu size={24} />
        {isMenuOpen && (
          <div className="mobile-menu dropdown-menu-glass" onClick={(e) => e.stopPropagation()}>
            <Link to="/">Home</Link>
            <Link to="/class">Class</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/contact">Contact</Link>
          </div>
        )}
      </div>

      {/* Centered alert (blurred backdrop, 20px radius) */}
      <Dialog
        open={alert.open}
        onClose={closeAlert}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            backgroundColor: "rgba(0,0,0,0.25)",
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            bgcolor: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.5)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
            textAlign: "center",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#8d1f58" }}>
          {alert.title}
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          {alert.message}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={closeAlert} autoFocus>
            {alert.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </header>
  );
};

export default Navbar;

