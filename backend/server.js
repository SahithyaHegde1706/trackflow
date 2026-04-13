require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const path = require('path');

// Route imports
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const commentRoutes = require('./routes/commentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const activityRoutes = require('./routes/activityRoutes');
const searchRoutes = require('./routes/searchRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Load env vars
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware to attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Body parser
app.use(express.json());
app.use(cookieParser());

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set security headers
app.use(helmet({
  contentSecurityPolicy: false
}));

// Enable CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://trackflow-seven-eosin.vercel.app",
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));

// Sanitize data
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// ─── Public Health Routes (NO auth, placed BEFORE all API routes) ────────────
app.get('/', (req, res) => {
  res.status(200).send('TrackFlow Backend is Live 🚀');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API working',
    uptime: `${process.uptime().toFixed(2)}s`,
    timestamp: new Date().toISOString()
  });
});
// ─────────────────────────────────────────────────────────────────────────────

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/notifications', notificationRoutes);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinProject', (projectId) => {
    socket.join(projectId);
    console.log(`User joined project: ${projectId}`);
  });

  // User-specific room for targeted notifications
  socket.on('joinUserRoom', (userId) => {
    socket.join(userId);
    console.log(`User joined personal room: ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Error handling (must be LAST — after all routes)
app.use(notFound);
app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
