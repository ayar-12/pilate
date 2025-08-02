
const Profile = require('../models/profile');

const activityMap = {
  sedentary: 1.2,
  light:     1.375,
  moderate:  1.55,
  very:      1.725,
  extra:     1.9,
};

exports.getProfile = async (req, res) => {
    try {
      const userId = req.user.id;
      const profile = await Profile.findOne({ userId });
      if (!profile) return res.json({ success:true, data:null });
  
      // re‑compute (in case the BMR formula changed, or to avoid storing numbers twice)
      const { age, gender, weight, height, activity, goal } = profile;
      const s     = gender==='male'?5:-161;
      const bmr   = Math.round( 10*weight + 6.25*height - 5*age + s );
      const tdee  = Math.round( bmr * (activityMap[activity]||1.2) );
      const adjust= goal==='lose'?-500: goal==='gain'?+500:0;
      const target= tdee + adjust;
  
      return res.json({
        success: true,
        data: {
          profile,
          calculations:{ bmr, tdee, target }
        }
      });
    } catch(err) {
      console.error(err);
      res.status(500).json({ success:false, message:'Server error' });
    }
  };
  
exports.upsertProfile = async (req, res) => {
  try {
    const { age, gender, weight, height, activity, goal } = req.body;
    const userId = req.user.id;
    if (![age, gender, weight, height, activity, goal].every(Boolean)) {
      return res.status(400).json({ success:false, message:'Missing fields' });
    }

    // BMR
    const s   = gender === 'male' ? 5 : -161;
    const bmr = 10*weight + 6.25*height - 5*age + s;

    // TDEE
    const factor = activityMap[activity] || 1.2;
    const tdee   = bmr * factor;

    // Target calories
    const adjust = goal==='lose' ? -500 : goal==='gain' ? +500 : 0;
    const target = Math.round(tdee + adjust);

    // Upsert
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { age, gender, weight, height, activity, goal },
      { upsert:true, new:true }
    );

    res.json({
      success: true,
      data: {
        profile,
        calculations: {
          bmr:    Math.round(bmr),
          tdee:   Math.round(tdee),
          target
        }
      }
    });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success:false, message:'Server error' });
  }
};
