import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,

  Dialog,
  DialogTitle, DialogContent, TextField, DialogActions
} from "@mui/material";
import { AppContext } from "../../context/AppContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import FoodTracker from "./FoodTracker";
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios'
import MyBookingWidgetDashboatd from "../../compontent/MyBookingWidgetDashboard";
import TodoWidget from "../../compontent/ToDoWidgetDetails";
import FavoriteBlogsWidget from "../../compontent/FavoriteBlogsWidget";
import defaultAvatar from '../../assets/5.jpeg';


const data = [
  { name: 'Mon', points: 200 },
  { name: 'Tue', points: 400 },
  { name: 'Wed', points: 300 },
  { name: 'Thu', points: 500 },
  { name: 'Fri', points: 250 },
  { name: 'Sat', points: 450 },
  { name: 'Sun', points: 100 },
];

const DashboardWidget = ({ title, children, sx }) => (
  <Paper
    sx={{
      p: 2,
      borderRadius: 4,

      ...sx,
    }}
  >
    <Typography fontWeight="bold" mb={1} color="#8d1f58" fontFamily= 'Poppins'>
      {title}
    </Typography>
    {children}
  </Paper>
);

const FitnessDashboard = () => {
  const [, forceRerender] = React.useState(0);
  const { userData, backendUrl, waterToday, getTodayWater, lastDrinkTime } = useContext(AppContext);
   const [stepData, setStepData] = useState({ steps: 0, message: '', chartData: [] });

  const [showStepDialog, setShowStepDialog] = useState(false);
  const [stepValue, setStepValue] = useState(0);

  const getAvatarUrl = (avatar) => {
  if (!avatar) return defaultAvatar;
  if (avatar.startsWith('http')) return avatar;
  return `${backendUrl}/${avatar}`;
};





  const dailyGoal = 3500;
  const waterPercent = Math.min((waterToday / dailyGoal) * 100, 100).toFixed(0);
  
const fetchSteps = async () => {
  try {
    const res = await axios.get(`${backendUrl}/api/steps`, { withCredentials: true });

    const chartData = Array.isArray(res.data.data)
      ? res.data.data.map(entry => ({
          name: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
          points: entry.steps,
        }))
      : [];

    const latest = chartData.at(-1)?.points || 0;

    setStepData({
      steps: latest,
      message: latest > 5000
        ? "You're walking more than you usually do by this point."
        : "Keep going, you're doing well!",
      chartData,
    });
  } catch (err) {
    console.error("Failed to fetch steps:", err);
  }
};


const submitSteps = async () => {
  try {
    await axios.post(`${backendUrl}/api/steps`, { steps: stepValue }, { withCredentials: true });

    setShowStepDialog(false);
    fetchSteps(); // refetch chart data after save
  } catch (err) {
    console.error("Failed to save steps:", err);
  }
};



  useEffect(() => {
    const stored = localStorage.getItem("userStepData");
    if (stored) {
      const parsed = JSON.parse(stored);
      const timestamp = new Date(parsed.timestamp);
      const now = new Date();
      const diff = now - timestamp;

      if (diff < 24 * 60 * 60 * 1000) {
        setStepData(parsed.stepData);
      } else {
        localStorage.removeItem("userStepData");
      }
    }
    fetchSteps();
  }, []);

useEffect(() => {
  fetchSteps();
}, []);


 
  useEffect(() => {
    const stored = localStorage.getItem("userStepData");
    if (stored) {
      const parsed = JSON.parse(stored);
      const timestamp = new Date(parsed.timestamp);
      const now = new Date();
      const diff = now - timestamp;
  
      if (diff < 24 * 60 * 60 * 1000) {
        setStepData(parsed.stepData);
      } else {
        localStorage.removeItem("userStepData"); // expired
      }
    }
  }, []);
  

  const handleAddWater = async (amount) => {
    try {
      await axios.post(`${backendUrl}/api/water/add`, { amount }, { withCredentials: true });
      toast.success(`Added ${amount}ml water`);
      await getTodayWater();
      forceRerender(n => n + 1); 
    } catch (error) {
      toast.error("Failed to log water");
      console.error(error);
    }
  };
  

  const fetchStepData = async () => {
  const res = await axios.get(`${backendUrl}/api/steps`, { withCredentials: true });
  const steps = res.data.data;

  const formatted = steps.map(s => ({
    name: new Date(s.date).toLocaleDateString('en-US', { weekday: 'short' }),
    points: s.steps
  }));

  setStepData(prev => ({ ...prev, chartData: formatted }));
};

useEffect(() => {
  fetchStepData();
}, []);

  const widgets = [
    <DashboardWidget title="User Profile" sx={{ 
      background: "#FFFCFB", 
      height: 360,
      width: {sx: 150 , md: 300},
      maxWidth: '100%',
    
    }}>
      <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" sx={{
        '@media (max-width: 600px)': {
          width: '100%',
        }
      }}>
        <img 
          src={getAvatarUrl(userData?.avatar)} 
          style={{ 
            width: '100%', 
            height: '130px', 
            borderRadius: '10px',
            '@media (max-width: 600px)': {
              width: '120px',
              height: '150px',
            }
          }} 
        />
  <div style={{ textAlign: 'left', paddingLeft: '0' , marginTop: 10}}>
         <Typography variant="h6" sx={{
          '@media (max-width: 600px)': {
            fontSize: '1.5rem',
            marginTop: '12px',
          }
        }}>{userData?.name || "N/A"}</Typography>
        <Typography variant="body2" sx={{
          '@media (max-width: 600px)': {
            fontSize: '1rem',
            marginTop: '8px',
          }
        }}>Age: {userData?.age || "N/A"}</Typography>
        <Typography variant="body2" sx={{
          '@media (max-width: 600px)': {
            fontSize: '1rem',
            marginTop: '4px',
          }
        }}>Email: {userData?.email || "N/A"}</Typography>
        <Typography variant="body2" sx={{
          '@media (max-width: 600px)': {
            fontSize: '1rem',
            marginTop: '4px',
          }
        }}>Phone: {userData?.phone || "N/A"}</Typography>
       </div>
        <Link to="/edit-profile" style={{ textDecoration: 'none' }}>
         <button

  style={{
    background: '#8d1f58',
    color: '#fff',
    borderRadius: '20px',
  width: '250px',            
    px: 3,
    py: 1,
    marginTop: 2,
    '&:hover': { background: '#a5326d' },
  }}
>Edit Profile</button>
        </Link>
      </Box>
    </DashboardWidget>,

    <FoodTracker backendUrl={import.meta.env.VITE_BACKEND_URL} />,

    <DashboardWidget title="Steps Highlights" sx={{
      backgroundColor: '#fff0f7',
      height: { xs: "auto", sm: 360 },
      width: { xs: 400, sm: 320 },
      maxWidth: '100%',
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      boxShadow: "0 8px 32px 0 rgba(221, 214, 219, 0.37)",
      border: "1px solid rgba(172, 168, 168, 0.1)",
   
    }}>
    

      <Typography variant="h6" color='#ECEDE7'>{stepData.steps.toLocaleString()} Steps</Typography>
      <Typography fontSize={14} color="gray">{stepData.message}</Typography>


      <Box mt={2}>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={stepData.chartData.length > 0 ? stepData.chartData : [
            { name: 'Today', points: 0 },
            { name: 'Yesterday', points: 0 },
            { name: '2 Days Ago', points: 0 }
          ]}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
            <Bar dataKey="points" fill="#701142ff" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Box mt={2}>
<button

  onClick={() => setShowStepDialog(true)}
  disableElevation
  style={{
      width: { xs: 40, sm: 40, md: 80 },
    height: { xs: 40, sm: 40, md: 80 },
    minWidth: '0',
    borderRadius: '50%',
    backgroundColor: '#8d1f58',
    color: '#fff',
    padding: 0,
    lineHeight: 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& .MuiButton-startIcon, & .MuiButton-endIcon': {
      margin: 0,
    },
  }}
>
  <AddIcon sx={{ fontSize: 24 }} />
</button>

      </Box>
      <Dialog open={showStepDialog} onClose={() => setShowStepDialog(false)}>
        <DialogTitle sx={{fontSize: '15px'}}>Enter Your Steps</DialogTitle>
        <DialogContent >
          <TextField
  label="Steps" 
  type="number"
  fullWidth
  autoFocus
  onChange={(e) => setStepValue(parseInt(e.target.value, 10) || 0)}
/>

        </DialogContent>
     <DialogActions>
  <Button onClick={() => setShowStepDialog(false)}>Cancel</Button>
  <Button onClick={submitSteps} disabled={!stepValue}>Save</Button>
</DialogActions>

      </Dialog>
    </DashboardWidget>,

    <DashboardWidget title="Water measurement" sx={{ height: { xs: "auto", sm: 360 }, width :{ xs: "auto", sm: 350 },    backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      boxShadow: "0 8px 32px 0 rgba(108, 39, 89, 0.37)",
      border: "1px solid rgba(255, 255, 255, 0.18)", backgroundColor: '#FDFAF6'}}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} height={150}>
        <Box>
          <Typography fontWeight="bold">{waterToday}ml</Typography>
          <Typography fontSize={12}>of daily goal {dailyGoal / 1000}L</Typography>
        </Box>
        <Box sx={{ position: 'relative', width: 30, height: 100, borderRadius: 15, backgroundColor: '#f5f5f5', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', bottom: 0, width: '100%', height: `${waterPercent}%`, backgroundColor: '#E6B2BA', color: 'white', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {waterPercent}%
          </Box>
        </Box>
      </Box>
      <Typography variant="body2">Last drink: {lastDrinkTime || '—'}</Typography>
      <Typography variant="caption" color="gray" mt={1} display="block">
        Drinking water helps maintain the balance of body fluids
      </Typography>
      <Box display="flex" gap={1} mt={2}>
        {[250, 500, 750].map((amount) => (
          <Button key={amount} variant="contained" onClick={() => handleAddWater(amount)} style={{ backgroundColor: '#8d1f58', borderRadius: '20px', fontSize: '12px', px: 2, py: 0.5, textTransform: 'none' }}>
            +{amount}ml
          </Button>
        ))}
      </Box>
    </DashboardWidget>,

<Grid container spacing={2}>
  <Grid item xs={12} sm={4}><MyBookingWidgetDashboard /></Grid>
  <Grid item xs={12} sm={4}><TodoWidget /></Grid>
  <Grid item xs={12} sm={4}><FavoriteBlogsWidget /></Grid>
</Grid>


  ];

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      p: { xs: 0, sm: 2, md: 4 },
      '@media (max-width: 600px)': {
        padding: '4px',
      }
    }}>

    <Box textAlign="center" mb={4} sx={{
      '@media (max-width: 600px)': {
        padding: '16px',
        marginBottom: '16px',
      }
    }}><Typography variant="h4" fontWeight={700} sx={{ color: '#8d1f58' }}>
  Dashboard
</Typography>
<Typography variant="subtitle2" sx={{ color: '#7c4d66' }}>
  Welcome back, ayar alkind 💕
</Typography>

    </Box>
    <Grid container spacing={{ xs: 0, sm: 2 }}>
      {widgets.map((Component, i) => (
        <Grid 
    key={i} 
    item 
    xs={12} 
    sm={12} 
    md={6} 
    lg={4} 
    xl={3}
    sx={{
      mb: { xs: 2, sm: 3 }, // Add bottom margin
      ...(i === 0 && {
        '@media (max-width: 600px)': {
          width: '100%',
          maxWidth: '100%',
          padding: '2px',
          margin: '0',
        }
      })
    }}
  >
          {Component}
        </Grid>
      ))}
    </Grid>
  </Box>
  );
};

export default FitnessDashboard;
