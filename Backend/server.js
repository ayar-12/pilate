require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/mongoDB');
const path = require('path');
const fs = require('fs');

const app = express();
app.set('trust proxy', 1); // <- 🛠️ Add this here
const port = process.env.PORT || 3000;
app.use(express.static('public'));
connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Static uploads route
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Cache-Control', 'public, max-age=31536000');
  }
}));

// ✅ Directly mount routes — remove buggy safeUse wrapper
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

// Serve static client files if exists
const staticPath = path.join(__dirname, 'client', 'build');
if (fs.existsSync(staticPath)) {
  app.use(express.static(staticPath));
}

// Define valid static routes for SPA fallback
const validStaticPaths = [
  '/', '/class', '/contact', '/login', '/register', '/email-verify',
  '/user-dashboard', '/admin-dashboard', '/my-booking',
  '/all-tasks', '/calories-data', '/forgot-password', '/edit-profile',
  '/blog', '/book-consultation', '/workout-meals'
];

const dynamicRegexRoutes = [
  /^\/booking\/[a-zA-Z0-9]+$/,
  /^\/booking-details\/[a-zA-Z0-9]+$/,
  /^\/blog-details\/[a-zA-Z0-9]+$/,
  /^\/admin\/user\/[a-zA-Z0-9]+$/
];

// Catch-all for SPA
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  const matched = validStaticPaths.includes(req.path) || dynamicRegexRoutes.some(regex => regex.test(req.path));
  if (matched && fs.existsSync(staticPath)) {
    return res.sendFile(path.join(staticPath, 'index.html'));
  }
  next();
});

app.get('/', (req, res) => {
  res.send('Pilate API is running 🧘‍♀️');
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`
  });
});


// Error handler
app.use((err, req, res, next) => {
  console.error('💥 Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
