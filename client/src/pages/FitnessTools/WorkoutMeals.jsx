import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WorkoutMeals = () => {
  const [meals, setMeals] = useState([]);
  const API_KEY = import.meta.env.VITE_MEALS_API_KEY;

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
          params: {
            apiKey: API_KEY,
            number: 12,
            type: 'main course',
            cuisine: 'italian',
            excludeCuisine: 'greek',
            maxCalories: 550, 
            addRecipeNutrition: true,
            tags: 'healthy',
          }
        });
        setMeals(res.data.results || []);
      } catch (err) {
        console.error("Failed to fetch meals:", err);
      }
    };

    fetchMeals();
  }, [API_KEY]);

  return (
    <div style={{
      padding: "40px 20px",
      minHeight: "100vh",
    }}>
      <h2 style={{
        color: "#74512D",
        fontWeight: "bold",
        fontSize: "26px",
        textAlign: "center",
        marginBottom: "40px"
      }}>
        🍝 Healthy Italian Meals (≤ 550 cal)
      </h2>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "30px"
      }}>
        {meals.map((meal) => (
        <div key={meal.id} style={{
            width: '280px',
            height: '300px',
            borderRadius: '16px',
            overflow: 'hidden',
            position: 'relative',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            background: '#fefcf0'
          }}>
            {/* Top Half: Normal Image */}
            <div style={{
              height: '50%',
              width: '100%',
            }}>
              <img
                src={meal.image}
                alt={meal.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            </div>
          
            {/* Bottom Half: Blurred background with overlay content */}
            <div style={{
              position: 'relative',
              height: '50%',
              width: '100%',
              backgroundImage: `url(${meal.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(10px)',
            }} />
          
            {/* Overlay text on blurred part */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              padding: '16px',
              zIndex: 1,
              backdropFilter: 'blur(2px)',
            }}>
              <span style={{
                display: "inline-block",
                marginBottom: "6px",
                background: "#e6e4dd",
                color: "#8d1f58",
                padding: "4px 10px",
                fontSize: "10px",
                fontWeight: "bold",
                borderRadius: "6px"
              }}>
                ITALIAN · HEALTHY
              </span>
              <h4 style={{
                margin: "0 0 8px 0",
                color: "#e6e4dd",
                fontWeight: "bold",
                fontSize: "15px"
              }}>{meal.title}</h4>
              <a
                href={`https://spoonacular.com/recipes/${meal.title.replace(/ /g, "-")}-${meal.id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#e6e4dd",
                  fontSize: "13px",
                  fontWeight: "bold",
                  textDecoration: "none"
                }}
              >
                View Recipe →
              </a>
            </div>
          </div>
          
          
        ))}
      </div>
    </div>
  );
};

export default WorkoutMeals;
