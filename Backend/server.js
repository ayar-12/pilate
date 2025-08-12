// server.js (or index.js)
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/mongoDB');

const app = express();
app.set('trust proxy', 1);

const port = process.env.PORT || 3000;

// --- Core middleware ---
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// --- DB ---
connectDB();

// --- CORS ---
const allowed = [
  'https://pilate-1.onrender.com', // API domain
  'https://pilate-2.onrender.com', // client domain
  'http://localhost:5173',         // local dev
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowed.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
app.options('*', cors({ origin: allowed, credentials: true }));

// --- Static uploads (keep outside SPA) ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Cache-Control', 'public, max-age=31536000');
  }
}));

// --- API routes ---
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

// --- Health check that won't conflict with SPA ---
app.get('/api/health', (req, res) => {
  res.send('Pilate API is running 🧘‍♀️');
});

// --- Serve Vite build (AFTER your /api routes) ---
const clientDist = path.join(__dirname, 'client', 'dist');

if (fs.existsSync(clientDist)) {
  // Serve static assets from Vite build
  app.use(express.static(clientDist));

  // SPA fallback for any non-API/non-uploads GET request
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// --- 404 for unknown API routes or other methods ---
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`
  });
});

// --- Error handler ---
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
