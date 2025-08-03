require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/mongoDB');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;


connectDB();


app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());

app.use(cookieParser());


app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Cache-Control', 'public, max-age=31536000');
  }
}));
// 1. Mount API routes FIRST
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

app.use(express.static(path.join(__dirname, 'client', 'build')));

const allowedPaths = [
  '/', '/class', '/contact', '/login', '/register', '/email-verify',
  '/user-dashboard', '/admin-dashboard', '/my-booking',
  '/all-tasks', '/calories-data', '/forgot-password', '/edit-profile',
  '/blog', /^\/blog-details\/.*/, /^\/booking\/.*/, /^\/booking-details\/.*/,
  '/book-consultation', '/workout-meals'
];

const validStaticPaths = [
  '/', '/class', '/contact', '/login', '/register', '/email-verify',
  '/user-dashboard', '/admin-dashboard', '/my-booking',
  '/all-tasks', '/calories-data', '/forgot-password', '/edit-profile',
  '/blog', '/book-consultation', '/workout-meals'
];

// Regex routes for dynamic pages
const dynamicRegexRoutes = [
  /^\/booking\/[a-zA-Z0-9]+$/,
  /^\/booking-details\/[a-zA-Z0-9]+$/,
  /^\/blog-details\/[a-zA-Z0-9]+$/,
  /^\/admin\/user\/[a-zA-Z0-9]+$/
];

app.get('*', (req, res, next) => {
  const matched =
    validStaticPaths.includes(req.path) ||
    dynamicRegexRoutes.some(rx => rx.test(req.path));

  if (matched) {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  } else {
    next();
  }
});





app.get('/', (req, res) => {
  res.send('Pilate API is running 🧘‍♀️');
});


app.use((req, res) => {
  console.warn('404 Not Found:', req.method, req.url);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`
  });
});


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
