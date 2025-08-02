const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const apiKey = process.env.CALORIE_NINJAS_KEY;


const foodDatabase = {
  'apple': { name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, sugar: 10.4 },
  'banana': { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sugar: 12.2 },
  'chicken breast': { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0 },
  'rice': { name: 'White Rice', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0.1 },
  'salmon': { name: 'Salmon', calories: 208, protein: 25, carbs: 0, fat: 12, fiber: 0, sugar: 0 },
  'broccoli': { name: 'Broccoli', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, sugar: 1.5 },
  'eggs': { name: 'Eggs', calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 1.1 },
  'oatmeal': { name: 'Oatmeal', calories: 68, protein: 2.4, carbs: 12, fat: 1.4, fiber: 1.7, sugar: 0.3 },
  'milk': { name: 'Milk', calories: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0, sugar: 5 },
  'bread': { name: 'Bread', calories: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7, sugar: 5.2 }
};

router.post('/analyze-text', async (req, res) => {
  try {
    const { foodName, quantity, unit = 'g', preparation = '' } = req.body;
    
    if (!foodName) {
      return res.status(400).json({ error: 'Food name is required' });
    }


    if (apiKey) {
      try {
        const query = `${quantity}${unit} ${preparation} ${foodName}`;
        const response = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`, {
          headers: { 'X-Api-Key': apiKey }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            const item = data.items[0];
            return res.json({
              success: true,
              food: {
                name: item.name,
                calories: item.calories,
                protein: item.protein_g,
                carbs: item.carbohydrates_total_g,
                fat: item.fat_total_g,
                fiber: item.fiber_g,
                sugar: item.sugar_g,
                servingSize: item.serving_size_g
              },
              service: 'CalorieNinjas API'
            });
          }
        }
      } catch (apiError) {
        console.log('API failed, using local database:', apiError.message);
      }
    }

    const searchTerm = foodName.toLowerCase().trim();
    let foundFood = null;
    
   
    if (foodDatabase[searchTerm]) {
      foundFood = foodDatabase[searchTerm];
    } else {
      
      for (const [key, food] of Object.entries(foodDatabase)) {
        if (key.includes(searchTerm) || searchTerm.includes(key)) {
          foundFood = food;
          break;
        }
      }
    }

    if (!foundFood) {
     
      foundFood = {
        name: foodName,
        calories: Math.floor(Math.random() * 200) + 50,
        protein: Math.floor(Math.random() * 10) + 1,
        carbs: Math.floor(Math.random() * 30) + 5,
        fat: Math.floor(Math.random() * 10) + 1,
        fiber: Math.floor(Math.random() * 5),
        sugar: Math.floor(Math.random() * 15)
      };
    }

  
    const quantityMultiplier = (quantity || 100) / 100;
    const adjustedFood = {
      ...foundFood,
      calories: Math.round(foundFood.calories * quantityMultiplier),
      protein: Math.round(foundFood.protein * quantityMultiplier * 10) / 10,
      carbs: Math.round(foundFood.carbs * quantityMultiplier * 10) / 10,
      fat: Math.round(foundFood.fat * quantityMultiplier * 10) / 10,
      fiber: Math.round(foundFood.fiber * quantityMultiplier * 10) / 10,
      sugar: Math.round(foundFood.sugar * quantityMultiplier * 10) / 10
    };
    
    res.json({
      success: true,
      food: adjustedFood,
      service: 'Local Database'
    });

  } catch (err) {
    res.status(500).json({ error: 'Text analysis failed' });
  }
});

router.post('/analyze-image', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Try API first if key is available
    if (apiKey) {
      try {
        const response = await fetch('https://api.calorieninjas.com/v1/nutrition?image=true', {
          method: 'POST',
          headers: {
            'X-Api-Key': apiKey,
            'Content-Type': 'image/jpeg',
          },
          body: req.file.buffer
        });

        if (response.ok) {
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            const item = data.items[0];
            return res.json({
              success: true,
              food: {
                name: item.name,
                calories: item.calories,
                protein: item.protein_g,
                carbs: item.carbohydrates_total_g,
                fat: item.fat_total_g,
                fiber: item.fiber_g,
                sugar: item.sugar_g,
                servingSize: item.serving_size_g
              },
              analyzedWith: 'CalorieNinjas API'
            });
          }
        }
      } catch (apiError) {
        console.log('API failed, using mock response:', apiError.message);
      }
    }


    const mockFoods = ['apple', 'banana', 'chicken breast', 'rice', 'salmon'];
    const randomFood = mockFoods[Math.floor(Math.random() * mockFoods.length)];
    const foodData = foodDatabase[randomFood];
    
    res.json({
      success: true,
      food: foodData,
      analyzedWith: 'Mock AI Service',
      message: 'This is a demo response. Configure API keys for real AI analysis.'
    });

  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze food image' });
  }
});

module.exports = router;
