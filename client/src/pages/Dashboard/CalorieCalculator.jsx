import React, { useState, useContext } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Grid
} from "@mui/material";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";


const activityLevels = [
  { label: "Sedentary (little or no exercise)", value: "sedentary" },
  { label: "Lightly active (1–3×/week)", value: "light" },
  { label: "Moderately active (3–5×/week)", value: "moderate" },
  { label: "Very active (6–7×/week)", value: "very" },
  { label: "Extra active (very hard exercise)", value: "extra" }
];

export default function CalorieCalculator() {
  const { backendUrl } = useContext(AppContext);

  const [age, setAge]                   = useState("");
  const [gender, setGender]             = useState("male");
  const [weight, setWeight]             = useState("");  // kg
  const [height, setHeight]             = useState("");  // cm
  const [activity, setActivity]         = useState("sedentary");
  const [goal, setGoal]                 = useState("maintain");
  const [calculations, setCalculations] = useState(null);
  const [error, setError]               = useState("");

  const handleSubmit = async () => {
    setError("");
    // simple client‑side validation
    if (![age, gender, weight, height, activity, goal].every(Boolean)) {
      return setError("Please fill in all fields.");
    }

    try {
      const res = await axios.post(
        `${backendUrl}/api/profile`,
        { age, gender, weight, height, activity, goal },
        { withCredentials: true }
      );

      if (res.data.success) {
        setCalculations(res.data.data.calculations);
      } else {
        setError(res.data.message || "Calculation failed.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message
          || err.message
          || "Server error, try again later."
      );
    }
  };

  return (
    <Grid sx={{ p: 3, mb: 4 }}>
      <Link style={{color: '#8d1f58', textDecoration: 'none',  fontStyle: ' bold'}} to='/user-dashboard'>Back to Dashboard</Link>
      <Typography variant="h6" gutterBottom sx={{fontFamily: 'Magical Childhood, cursive' , textAlign: 'center', marginTop: '50px', marginBottom: '40px', color: '#8d1f58'}}>
        Daily Calorie Needs Calculator
      </Typography>

      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{ display: "grid", gap: 2, mb: 2 }}
      >
        <TextField
          label="Age (years)"
          type="number"
          value={age}
          onChange={e => setAge(e.target.value)}
          required
        />

        <FormControl required>
          <InputLabel>Gender</InputLabel>
          <Select
            value={gender}
            label="Gender"
            onChange={e => setGender(e.target.value)}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Weight (kg)"
          type="number"
          value={weight}
          onChange={e => setWeight(e.target.value)}
          required
        />

        <TextField
          label="Height (cm)"
          type="number"
          value={height}
          onChange={e => setHeight(e.target.value)}
          required
        />

        <FormControl required>
          <InputLabel>Activity Level</InputLabel>
          <Select
            value={activity}
            label="Activity Level"
            onChange={e => setActivity(e.target.value)}
          >
            {activityLevels.map(l => (
              <MenuItem key={l.value} value={l.value}>
                {l.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl required>
          <InputLabel>Goal</InputLabel>
          <Select
            value={goal}
            label="Goal"
            onChange={e => setGoal(e.target.value)}
          >
            <MenuItem value="lose">Lose weight</MenuItem>
            <MenuItem value="maintain">Maintain weight</MenuItem>
            <MenuItem value="gain">Gain weight</MenuItem>
          </Select>
        </FormControl>

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        <Button sx={{background: '#8d1f58', borderRadius: '50px', color: 'white'}}onClick={handleSubmit}>
          Calculate
        </Button>
      </Box>

      {calculations && (
        <Box>
          <Typography>
            <strong>BMR:</strong> {calculations.bmr} kcal/day<br/>
            (basal metabolic rate)
          </Typography>
          <Typography>
            <strong>TDEE:</strong> {calculations.tdee} kcal/day<br/>
            (BMR × activity factor)
          </Typography>
          <Typography>
            <strong>Target Calories:</strong> {calculations.target} kcal/day<br/>
            (adjusted for your goal)
          </Typography>
        </Box>
      )}
    </Grid>
  );
}
