import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  TextField,
  Typography,
  Box,
  Button,
  Paper,
  Avatar
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

const defaultAvatar = "https://i.pravatar.cc/150?img=12"; // fallback avatar

const EditProfile = () => {
  const navigate = useNavigate();
  const { backendUrl, isLoggedin, userData, getUserData } = useContext(AppContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    phone: "",
    avatar: null,
    avatarPreview: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  axios.defaults.withCredentials = true;

  const getAvatarUrl = (avatar) => {
    if (!avatar) return defaultAvatar;
    if (avatar.startsWith("http")) return avatar;
    return `${backendUrl}/${avatar}`;
  };

  useEffect(() => {
    if (!isLoggedin) navigate("/login");
  }, [isLoggedin, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      if (userData) {
        setFormData((prev) => ({
          ...prev,
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          age: userData.age || "",
          avatarPreview: getAvatarUrl(userData.avatar)
        }));
        return;
      }

      try {
        const res = await axios.get(`${backendUrl}/api/user/data`);
        if (res.data?.user) {
          const user = res.data.user;
          setFormData((prev) => ({
            ...prev,
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            age: user.age || "",
            avatarPreview: getAvatarUrl(user.avatar)
          }));
        } else {
          console.warn("No user data found");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, [backendUrl, userData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        avatar: files[0],
        avatarPreview: URL.createObjectURL(files[0])
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return alert("Name is required.");
    if (!formData.phone.trim()) return alert("Phone is required.");

    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("phone", formData.phone.trim());
      data.append("age", formData.age.trim());
      if (formData.avatar) data.append("avatar", formData.avatar);

      const res = await axios.put(`${backendUrl}/api/user/profile`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data?.user?.avatar) {
        setFormData((prev) => ({
          ...prev,
          avatarPreview: getAvatarUrl(res.data.user.avatar)
        }));
      }

      await getUserData();
      alert("Profile updated successfully!");
      setTimeout(() => navigate("/user-dashboard"), 100);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update profile";
      alert(`Error: ${msg}`);
      console.error("Update failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (
        formData.avatarPreview &&
        formData.avatarPreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(formData.avatarPreview);
      }
    };
  }, [formData.avatarPreview]);

  if (!isLoggedin) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 4, background: "#fffaf5" }}>
          <Typography variant="h5" fontWeight="bold" color="#8d1f58">
            Loading...
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, background: "#fffaf5" }}>
        <Typography variant="h5" fontWeight="bold" color="#8d1f58" gutterBottom>
          Edit Your Profile
        </Typography>

        <Box component="form" onSubmit={handleSubmit} mt={2}>
          {formData.avatarPreview && (
            <Box display="flex" justifyContent="center" mb={2}>
              <Avatar
                src={formData.avatarPreview}
                alt="avatar"
                sx={{ width: 80, height: 80 }}
              />
            </Box>
          )}
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            disabled
            margin="normal"
          />
          <TextField
            fullWidth
            label="Age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
          />
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
            style={{ marginTop: 16 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{ mt: 3, backgroundColor: "#8d1f58", borderRadius: 999 }}
          >
            {isLoading ? "Updating..." : "Save Changes"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditProfile;
