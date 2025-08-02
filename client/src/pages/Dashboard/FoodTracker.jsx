import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Popover,
  CircularProgress
  
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios'
import { toast } from "react-toastify";
import foodDatabase from "../../foodDatabase.json";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
const sizeOptions = [
  { value: 0.5, label: "50g" },
  { value: 1,   label: "100g" },
  { value: 1.5, label: "150g" },
  { value: 2,   label: "200g" }
];

const DashboardWidget = ({ title, children, sx }) => (
  <Paper sx={{ p: 2, borderRadius: 4, ...sx }}>
    <Typography variant="subtitle1" fontWeight="bold" mb={1}>
      {title}
    </Typography>
    {children}
  </Paper>
);

const FoodTracker = () => {
  const [showLogPopup, setShowLogPopup] = useState(false);
  const {backendUrl} = useContext(AppContext)
  const navigate = useNavigate()
  const [foodLog, setFoodLog] = useState(() => {
    const saved = localStorage.getItem("foodLog");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const now = new Date();
    const lastReset = localStorage.getItem("lastFoodReset");
    if (!lastReset || now - new Date(lastReset) > 24 * 60 * 60 * 1000) {
      localStorage.setItem("foodLog", JSON.stringify([]));
      localStorage.setItem("lastFoodReset", now.toISOString());
      setFoodLog([]);
    }
  }, []);

  const [selectedFoods, setSelectedFoods] = useState({
    protein: { food: "", size: 1 },
    carbs:   { food: "", size: 1 },
    fat:     { food: "", size: 1 },
    fiber:   { food: "", size: 1 },
    sugar:   { food: "", size: 1 }
  });
  const [tabIndex, setTabIndex]   = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [anchorEl, setAnchorEl]   = useState(null);
  const [targetCalories, setTargetCalories] = useState(null);
  const [loadingTarget, setLoadingTarget] = useState(true);

  
  useEffect(() => {
    localStorage.setItem("foodLog", JSON.stringify(foodLog));
  }, [foodLog]);


useEffect(() => {
  axios
    .get(`${backendUrl}/api/profile`, { withCredentials: true })
    .then(res => {
      if (res.data.success && res.data.data) {
        setTargetCalories(res.data.data.calculations.target);
      } else {
        // fallback
        const cached = localStorage.getItem("calorieProfile");
        if (cached) {
          const parsed = JSON.parse(cached);
             setTargetCalories(res.data.data.calculations.target);
        }
      }
    })
    .catch(err => {
      console.error("Error fetching profile:", err);
    })
    .finally(() => setLoadingTarget(false));
}, [backendUrl]);


  const handleFoodChange = (macro, field, value) => {
    setSelectedFoods(prev => ({
      ...prev,
      [macro]: { ...prev[macro], [field]: value }
    }));
  };

  const handleAddFood = async () => {
    setLoading(true);
    setError("");
    try {
      const selectedEntries = [];

      Object.entries(selectedFoods).forEach(([macroType, sel]) => {
        const category = foodDatabase[macroType];
        if (sel.food && category && category[sel.food]) {
          const base = category[sel.food];
          const mult = sel.size;
          selectedEntries.push({
            name:     base.name,
            grams:    Math.round(100 * mult),
            protein:  Math.round(base.protein * mult * 10) / 10,
            carbs:    Math.round(base.carbs * mult * 10) / 10,
            fat:      Math.round(base.fat * mult * 10) / 10,
            fiber:    Math.round(base.fiber * mult * 10) / 10,
            sugar:    Math.round(base.sugar * mult * 10) / 10,
            calories: Math.round(base.calories * mult),
            method:   "selected",
            service:  `${macroType.charAt(0).toUpperCase() + macroType.slice(1)} Category`,
            timestamp: new Date().toISOString()
          });
        }
      });

      if (selectedEntries.length === 0) {
        throw new Error("Please select at least one food");
      }

      setFoodLog(prev => [...prev, ...selectedEntries]);
      toast.success(`Added ${selectedEntries.length} food(s)`);
      setSelectedFoods({
        protein: { food: "", size: 1 },
        carbs:   { food: "", size: 1 },
        fat:     { food: "", size: 1 },
        fiber:   { food: "", size: 1 },
        sugar:   { food: "", size: 1 }
      });
      setOpenDialog(false);
    } catch (err) {
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const totalCalories = foodLog.reduce((sum, item) => sum + item.calories, 0);
  const remaining =
    targetCalories != null
      ? targetCalories - totalCalories
      : null;
  const burnedCalories = 200;
  const remainingCalories = 2000 - totalCalories;

  return (
<Box
  sx={{
      display: 'flex',
    justifyContent: 'center',
    width: '100%',
  }}
>
  <DashboardWidget
    sx={{
      background: "#701142ff",
      color: "white",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      boxShadow: "0 8px 32px rgba(108,39,89,0.37)",
      border: "1px solid rgba(255,255,255,0.18)",
      borderRadius: 3,
      height: { xs: "auto", sm: 360 },
      width: { xs: 400, sm: 350 },
      maxWidth: "100%",
      px: { xs: 2, sm: 3 },
      py: { xs: 2, sm: 2 },
    }}
  >


        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography fontWeight="bold" color="white">
          Food Measurement
          </Typography>
<Button
  variant="contained"
  onClick={() => navigate('/calories-data')}
  sx={{
    borderRadius: '50px',
    width: { xs: 10, sm: 40 },
    height: { xs: 10, sm: 40 },
    minWidth: 0,
    padding: 0,
    backgroundColor: 'white',
    color: '#8d1f58',
  }}
>
  <AddIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
</Button>


</Box>
<Tabs
  value={tabIndex}
  onChange={(e, val) => setTabIndex(val)}
  centered
  TabIndicatorProps={{ style: { backgroundColor: "white" } }}
>
  <Tab
    label="Today's Log"
    sx={{
      color: 'white',
      '&.Mui-selected': {
        color: 'white',
      },
    }}
  />
  <Tab
    label="+ Add Food"
    onClick={() => setOpenDialog(true)}
    sx={{
      color: 'white',
      '&.Mui-selected': {
        color: 'white',
      },
    }}
  />
</Tabs>


      <Box display="flex" justifyContent="space-between" my={2}>
        <Box>
          <Typography variant="body2" fontWeight="bold">Eaten</Typography>
          <Typography fontSize={14}>{totalCalories} kcal</Typography>
        </Box>
        <Box>
          <Typography variant="body2" fontWeight="bold">Burned</Typography>
          <Typography fontSize={14}>{burnedCalories} kcal</Typography>
        </Box>
      </Box>

      <Box
        sx={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          border: "6px solid rgba(240, 206, 233, 1)",
          borderTop: "6px solid #96a427ff",
          mx: "auto",
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer"
        }}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        {loadingTarget ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : (
          <Typography fontSize={14} textAlign="center">
            {remaining} <br />
            kcal left
          </Typography>
        )}
      </Box>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical:"bottom", horizontal:"center" }}
        transformOrigin={{ vertical:"top",    horizontal:"center" }}
      >
        <Box p={2}>
          <Typography variant="subtitle2">Today's Macros</Typography>
          <Typography fontSize={14}>🔥 {totalCalories} kcal</Typography>
        </Box>
      </Popover>

      <Box mt={2}>
        {foodLog.length === 0
          ? <Typography variant="body2" color="#fff" textAlign="center">
              No foods logged today. Add your first meal!
            </Typography>
          : <Button
              onClick={() => setShowLogPopup(true)}
              variant="outlined"
              fullWidth
              sx={{
                mt:2,
                borderRadius:"50px",
                border:"black",
                background:"linear-gradient(135deg, rgba(240,240,240,0.94), rgba(252,252,252,0.94))",
                boxShadow:"0 8px 32px rgba(97,92,96,0.29)",
                color:"#8d1f58"
              }}
            >
              See More
            </Button>
        }
      </Box>

      {/* Log Details Dialog */}
      <Dialog open={showLogPopup} onClose={() => setShowLogPopup(false)} fullWidth maxWidth="sm">
        <DialogTitle>Food Log Details</DialogTitle>
        <DialogContent>
          {foodLog.map((item,i) => (
            <Paper key={i} sx={{ p:1.5, mb:1 }}>
              <Typography fontWeight="bold">
                {item.name} ({item.grams}g)
              </Typography>
              <Typography fontSize={14}>
                🔥 {item.calories} kcal — 🥩 {item.protein}g — 🍞 {item.carbs}g — 🧈 {item.fat}g — 🥦 {item.fiber}g — 🍬 {item.sugar}g
              </Typography>
              <Typography fontSize={12} color="textSecondary">
                Service: {item.service}
              </Typography>
            </Paper>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLogPopup(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add Food Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
        <DialogTitle>Add Food</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>}

          {["protein","carbs","fat","fiber","sugar"].map(macro => (
            <Box key={macro} sx={{ mb:3 }}>
              <FormControl fullWidth>
                <InputLabel>{macro.charAt(0).toUpperCase() + macro.slice(1)} Food</InputLabel>
                <Select
                  value={selectedFoods[macro].food}
                  label={`${macro} Food`}
                  onChange={e => handleFoodChange(macro,"food",e.target.value)}
                >
                  {Object.keys(foodDatabase[macro]).map(key => (
                    <MenuItem key={key} value={key}>
                      {foodDatabase[macro][key].name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mt:1 }}>
                <InputLabel>Size</InputLabel>
                <Select
                  value={selectedFoods[macro].size}
                  label="Size"
                  onChange={e => handleFoodChange(macro,"size",e.target.value)}
                >
                  {sizeOptions.map(o => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddFood}
            variant="contained"
            disabled={loading}
            sx={{ backgroundColor: "#8d1f58", borderRadius:"50px" }}
          >
            {loading ? "Adding..." : "Add Selected Foods"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardWidget>
    </Box>
  );
};

export default FoodTracker;
