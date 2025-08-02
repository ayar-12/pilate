// Load env
require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/mongoDB');

// Routes
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

// Connect DB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://pilate-2.onrender.com/',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Create uploads folders (locally)
const uploadsDirs = ['uploads', 'uploads/images', 'uploads/videos'];
uploadsDirs.forEach(dir => {
  const full = path.join(__dirname, dir);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
});

// Static hosting for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Cache-Control', 'public, max-age=31536000');
  }
}));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
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

// Global error handler
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
  console.log('404 Not Found:', req.method, req.url);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

