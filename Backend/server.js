const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env') });

const connectDB = require('./config/mongoDB'); // ✅ correct import
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs');



const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRouter');
const bookingRouter = require('./routes/bookingRouter');
const adminRouter = require('./routes/adminRouter');
const blogRouter = require('./routes/blogRouter');
const waterRouter = require('./routes/waterRouter');
const foodRoutes = require('./routes/foodRouter');
const classWidgetRoutes = require('./routes/classWidgetRouter');
const newsletterRoutes = require('./routes/newsletterRouter');
const todoRouter = require('./routes/todoRouter');
const contactRouter = require('./routes/contactRouter');
const profileRouter = require('./routes/profileRouter');
const homeRouter = require('./routes/homeRouter');
const consultationRoutes = require('./routes/consultationRoutes');
const stepRouter = require('./routes/stepRouter');

const app = express();
const port = process.env.PORT || 3000;


connectDB();


app.use(cors({
  origin: process.env.CLIENT_URL || 'https://pilate.onrender.com',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const UPLOADS_DIR = path.join(__dirname, 'uploads');
const IMAGES_DIR = path.join(UPLOADS_DIR, 'images');
const VIDEOS_DIR = path.join(UPLOADS_DIR, 'videos');

[UPLOADS_DIR, IMAGES_DIR, VIDEOS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});




app.get('/api/debug/status', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uploadsDir: UPLOADS_DIR,
    imagesDir: IMAGES_DIR,
    videosDir: VIDEOS_DIR
  });
});

app.use('/uploads', express.static(UPLOADS_DIR, {
  setHeaders: (res) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Cache-Control', 'public, max-age=31536000');
  }
}));
app.get('/api/debug/class-widget', async (req, res) => {
  try {
    const ClassWidage = require('./models/classWidage');
    const classData = await ClassWidage.findOne();
    res.json({
      success: true,
      classData: classData,
      hasImage: !!classData?.image,
      imagePath: classData?.image,
      fullImageUrl: classData?.image ? `http://localhost:3000/uploads/${classData.image}` : null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


console.log('Registering routes...');
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/course', courseRoutes);
app.use('/api/booking', bookingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/blog', blogRouter);
app.use('/api/water', waterRouter);
app.use('/api/food', foodRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/todo', todoRouter);
app.use('/api/contact', contactRouter);
app.use('/api/home', homeRouter);
app.use('/api/consultation', consultationRoutes);
app.use('/api/class-widget', classWidgetRoutes);
app.use('/api/profile', profileRouter);
app.use('/api/steps', stepRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handler
app.use((err, req, res, next) => {
 
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use((req, res) => {
  console.log('its runway 404🎃 ⚒️', req.method, req.url);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`
  });
});


app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
