require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/mongoDB');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// ====== DB ======
connectDB();

// ====== Middleware ======
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ====== Cloudinary Upload Folders (optional CDN support) ======
// This block is now optional — files should go directly to Cloudinary.
// Keeping it only for backwards compatibility with local dev.
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Cache-Control', 'public, max-age=31536000');
  }
}));

// ====== API Routes ======
app.use('/api/auth', require('./routes/authRouter'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/course', require('./routes/courseRouter'));
app.use('/api/booking', require('./routes/bookingRouter'));
app.use('/api/admin', require('./routes/adminRouter'));
app.use('/api/blog', require('./routes/blogRouter'));
app.use('/api/water', require('./routes/waterRouter'));
app.use('/api/food', require('./routes/foodRouter'));
app.use('/api/newsletter', require('./routes/newsletterRouter'));
app.use('/api/todo', require('./routes/todoRouter'));
app.use('/api/contact', require('./routes/contactRouter'));
app.use('/api/home', require('./routes/homeRouter'));
app.use('/api/consultation', require('./routes/consultationRoutes'));
app.use('/api/class-widget', require('./routes/classWidgetRouter'));
app.use('/api/profile', require('./routes/profileRouter'));
app.use('/api/steps', require('./routes/stepRouter'));

// ====== Root Health Check ======
app.get('/', (req, res) => {
  res.send('Pilate API is running 🧘‍♀️');
});

// ====== 404 Handler ======
app.use((req, res) => {
  console.warn('404 Not Found:', req.method, req.url);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`
  });
});

// ====== Global Error Handler ======
app.use((err, req, res, next) => {
  console.error('💥 Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ====== Start Server ======
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
