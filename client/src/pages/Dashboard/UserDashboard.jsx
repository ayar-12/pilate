// client/src/pages/Dashboard/UserDashboard.jsx
import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions
} from "@mui/material";
import { AppContext } from "../../context/AppContext";
import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import FoodTracker from "./FoodTracker";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import MyBookingWidgetDashboatd from "../../compontent/MyBookingWidgetDashboard";
import TodoWidget from "../../compontent/ToDoWidgetDetails";
import FavoriteBlogsWidget from "../../compontent/FavoriteBlogsWidget";
import defaultAvatar from "../../assets/5.jpeg";

const DashboardWidget = ({ title, children, sx }) => (
  <Paper sx={{ p: 2, borderRadius: 4, height: "100%", width: "100%", ...sx }}>
    {title && (
      <Typography fontWeight="bold" mb={1} color="#8d1f58" fontFamily="Poppins">
        {title}
      </Typography>
    )}
    {children}
  </Paper>
);

const FitnessDashboard = () => {
  const [, forceRerender] = useState(0);
  const { userData, backendUrl, waterToday, getTodayWater, lastDrinkTime } =
    useContext(AppContext);

  const [stepData, setStepData] = useState({ steps: 0, message: "", chartData: [] });
  const [showStepDialog, setShowStepDialog] = useState(false);
  const [stepValue, setStepValue] = useState(0);

  const getAvatarUrl = (avatar) => {
    if (!avatar) return defaultAvatar;
    if (avatar.startsWith("http")) return avatar;
    return `${backendUrl}/${avatar.replace(/^\//, "")}`;
  };

  const dailyGoal = 3500;
  const waterPercent = Math.min((waterToday / dailyGoal) * 100, 100).toFixed(0);

  const fetchSteps = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/steps`, { withCredentials: true });
      const chartData = Array.isArray(res.data?.data)
        ? res.data.data.map((entry) => ({
            name: new Date(entry.date).toLocaleDateString("en-US", { weekday: "short" }),
            points: entry.steps
          }))
        : [];
      const latest = chartData.at(-1)?.points || 0;
      setStepData({
        steps: latest,
        message: latest > 5000 ? "You're walking more than you usually do." : "Keep going, you're doing well!",
        chartData
      });
    } catch (err) {
      console.error("Failed to fetch steps:", err);
    }
  };

  const submitSteps = async () => {
    try {
      await axios.post(`${backendUrl}/api/steps`, { steps: stepValue }, { withCredentials: true });
      setShowStepDialog(false);
      fetchSteps();
    } catch (err) {
      console.error("Failed to save steps:", err);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("userStepData");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const timestamp = new Date(parsed.timestamp);
        if (Date.now() - timestamp.getTime() < 24 * 60 * 60 * 1000) {
          setStepData(parsed.stepData);
        } else {
          localStorage.removeItem("userStepData");
        }
      } catch {}
    }
    fetchSteps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddWater = async (amount) => {
    try {
      await axios.post(`${backendUrl}/api/water/add`, { amount }, { withCredentials: true });
      toast.success(`Added ${amount}ml water`);
      await getTodayWater();
      forceRerender((n) => n + 1);
    } catch (error) {
      toast.error("Failed to log water");
      console.error(error);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", p: { xs: 1.5, sm: 2, md: 4 }, width: "100%" }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight={700} sx={{ color: "#8d1f58" }}>
          Dashboard
        </Typography>
        <Typography variant="subtitle2" sx={{ color: "#7c4d66" }}>
          Welcome back, {userData?.name || "there"} 💕
        </Typography>
      </Box>

      {/* ROW 1 — EXACTLY 4 ACROSS ON DESKTOP */}
      <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} alignItems="stretch">
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <DashboardWidget title="User Profile" sx={{ background: "#FFFCFB" }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <img
                src={getAvatarUrl(userData?.avatar)}
                alt="avatar"
                style={{ width: "100%", height: 130, borderRadius: 10, objectFit: "cover" }}
              />
              <Box sx={{ width: "100%", mt: 1 }}>
                <Typography variant="h6">{userData?.name || "N/A"}</Typography>
                <Typography variant="body2">Age: {userData?.age || "N/A"}</Typography>
                <Typography variant="body2">Email: {userData?.email || "N/A"}</Typography>
                <Typography variant="body2">Phone: {userData?.phone || "N/A"}</Typography>
              </Box>
              <Box mt={2} width="100%">
                <Button
                  component={Link}
                  to="/edit-profile"
                  fullWidth
                  variant="contained"
                  sx={{ background: "#8d1f58", borderRadius: "20px", textTransform: "none",
                        "&:hover": { background: "#a5326d" } }}
                >
                  Edit Profile
                </Button>
              </Box>
            </Box>
          </DashboardWidget>
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          {/* Ensure FoodTracker returns a full-width root */}
          <Box sx={{ height: "100%", width: "100%" }}>
            <FoodTracker backendUrl={import.meta.env.VITE_BACKEND_URL} />
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <DashboardWidget
            title="Steps Highlights"
            sx={{ backgroundColor: "#fff0f7", width: {sx: 350, md: 300}, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
          >
            <Typography variant="h6" color="#6d1a3d">
              {stepData.steps.toLocaleString()} Steps
            </Typography>
            <Typography fontSize={14} color="gray">{stepData.message}</Typography>

            <Box mt={2}>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={stepData.chartData.length ? stepData.chartData : [
                  { name: "Today", points: 0 },
                  { name: "Yesterday", points: 0 },
                  { name: "2 Days Ago", points: 0 }
                ]}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                  <Bar dataKey="points" fill="#701142ff" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            <Box mt={2}>
              <button
                onClick={() => setShowStepDialog(true)}
                style={{ minWidth: 0, width: 48, height: 48, borderRadius: "50%", backgroundColor: "#8d1f58" }}
              >
                <AddIcon style={{ color: "#fff" }} />
              </button>
            </Box>

            <Dialog
              open={showStepDialog}
              onClose={() => setShowStepDialog(false)}
              BackdropProps={{ sx:{ backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)', backgroundColor:'rgba(0,0,0,0.25)'} }}
              PaperProps={{ sx:{ borderRadius:'20px', bgcolor:'rgba(255,255,255,0.85)', backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)', border:'1px solid rgba(255,255,255,0.4)'} }}
            >
              <DialogTitle sx={{ fontSize: "15px" }}>Enter Your Steps</DialogTitle>
              <DialogContent>
                <TextField label="Steps" type="number" fullWidth autoFocus
                  onChange={(e) => setStepValue(parseInt(e.target.value, 10) || 0)} />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowStepDialog(false)}>Cancel</Button>
                <Button onClick={submitSteps} disabled={!stepValue}>Save</Button>
              </DialogActions>
            </Dialog>
          </DashboardWidget>
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <DashboardWidget title="Water measurement" sx={{ backgroundColor: "#FDFAF6", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} height={150}>
              <Box>
                <Typography fontWeight="bold">{waterToday}ml</Typography>
                <Typography fontSize={12}>of daily goal {dailyGoal / 1000}L</Typography>
              </Box>
              <Box sx={{ position: "relative", width: 30, height: 100, borderRadius: 15, backgroundColor: "#f5f5f5", overflow: "hidden" }}>
                <Box sx={{ position: "absolute", bottom: 0, width: "100%", height: `${waterPercent}%`, backgroundColor: "#E6B2BA",
                           color: "white", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {waterPercent}%
                </Box>
              </Box>
            </Box>
            <Typography variant="body2">Last drink: {lastDrinkTime || "—"}</Typography>
            <Typography variant="caption" color="gray" mt={1} display="block">
              Drinking water helps maintain the balance of body fluids
            </Typography>
            <Box display="flex" gap={1} mt={2}>
              {[250, 500, 750].map((amount) => (
                <Button key={amount} variant="contained" onClick={() => handleAddWater(amount)}
                        sx={{ backgroundColor: "#8d1f58", borderRadius: "20px", fontSize: "12px", px: 2, py: 0.5, textTransform: "none",
                              "&:hover": { backgroundColor: "#a5326d" } }}>
                  +{amount}ml
                </Button>
              ))}
            </Box>
          </DashboardWidget>
        </Grid>
      </Grid>

      {/* ROW 2 — booking, todo, blog */}
      <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} alignItems="stretch" sx={{ mt: { xs: 2, md: 3 } }}>
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}><MyBookingWidgetDashboatd /></Grid>
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}><TodoWidget /></Grid>
        <Grid item xs={12} sm={6} md={4} lg={4} xl={4}><FavoriteBlogsWidget /></Grid>
      </Grid>
    </Box>
  );
};

export default FitnessDashboard;
