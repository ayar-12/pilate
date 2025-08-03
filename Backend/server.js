require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/mongoDB');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs');

connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
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

const safeUse = (path, router) => {
  try {
    if (!path || typeof path !== 'string' || path.includes('/:')) {
      throw new Error(`❌ Invalid route path: "${path}"`);
    }
    app.use(path, router);
  } catch (err) {
    console.error(`❌ Failed to mount router at ${path}:`, err.message);
    process.exit(1); // force exit so Render shows the real error
  }
};

// SAFELY MOUNT ROUTES
safeUse('/api/auth', require('./routes/authRouter'));
safeUse('/api/user', require('./routes/userRoutes'));
safeUse('/api/course', require('./routes/courseRouter'));
safeUse('/api/booking', require('./routes/bookingRouter'));
safeUse('/api/admin', require('./routes/adminRouter'));
safeUse('/api/blog', require('./routes/blogRouter'));
safeUse('/api/water', require('./routes/waterRouter'));
safeUse('/api/food', require('./routes/foodRouter'));
safeUse('/api/newsletter', require('./routes/newsletterRouter'));
safeUse('/api/todo', require('./routes/todoRouter'));
safeUse('/api/contact', require('./routes/contactRouter'));
safeUse('/api/home', require('./routes/homeRouter'));
safeUse('/api/consultation', require('./routes/consultationRoutes'));
safeUse('/api/class-widget', require('./routes/classWidgetRouter'));
safeUse('/api/profile', require('./routes/profileRouter'));
safeUse('/api/steps', require('./routes/stepRouter'));


const staticPath = path.join(__dirname, 'client', 'build');
if (fs.existsSync(staticPath)) {
  app.use(express.static(staticPath));
}


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

app.get('*', (req, res, next) => {
  try {
    if (req.path.startsWith('/api/')) return next();
    const matched = validStaticPaths.includes(req.path) || 
                    dynamicRegexRoutes.some(regex => regex.test(req.path));
    if (matched) {
      return res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    }
    next();
  } catch (err) {
    console.error('Wildcard route crash:', err);
    res.status(500).send('Internal error');
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

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});