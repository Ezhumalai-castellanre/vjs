import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileDB } from './fileDB.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const USE_FILE_DB = process.env.USE_FILE_DB !== 'false'; // Default to file DB
const USE_MONGODB = process.env.MONGODB_URI && process.env.MONGODB_URI.includes('mongodb');

// CORS Configuration - Allow multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', // Vite default dev port
  'https://vjs-gamma.vercel.app',
  FRONTEND_URL
].filter(Boolean); // Remove any undefined values

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // In development, be more permissive
      if (process.env.NODE_ENV !== 'production') {
        console.log(`⚠️  Allowing origin in dev: ${origin}`);
        callback(null, true);
      } else {
        console.log(`❌ Blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'VJK Mahal API is running',
    database: USE_FILE_DB ? 'File-based (JSON)' : 'MongoDB',
    timestamp: new Date().toISOString()
  });
});

// Bookings API Routes (File-based)
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await fileDB.getAllBookings();
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.get('/api/bookings/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const bookings = await fileDB.getBookingsByDate(date);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

app.post('/api/bookings/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const { bookings } = req.body;
    
    if (!Array.isArray(bookings)) {
      return res.status(400).json({ error: 'Bookings must be an array' });
    }
    
    await fileDB.setBookingsByDate(date, bookings);
    
    res.json({ 
      message: bookings.length === 0 ? 'Bookings deleted' : 'Bookings saved',
      date,
      bookings
    });
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ error: 'Failed to save booking' });
  }
});

app.delete('/api/bookings/:date', async (req, res) => {
  try {
    const { date } = req.params;
    await fileDB.deleteBookingsByDate(date);
    res.json({ message: 'Bookings deleted', date });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
async function startServer() {
  try {
    // Initialize file database
    await fileDB.init();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log('=================================');
      console.log('🚀 VJK Mahal API Server Started');
      console.log('=================================');
      console.log(`📍 Server URL: http://localhost:${PORT}`);
      console.log(`📍 Health Check: http://localhost:${PORT}/health`);
      console.log(`📍 API Endpoint: http://localhost:${PORT}/api/bookings`);
      console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);
      console.log(`🌐 Allowed Origins: ${allowedOrigins.join(', ')}`);
      console.log(`💾 Database: File-based (JSON)`);
      console.log('=================================');
      console.log('ℹ️  Using temporary file database');
      console.log('ℹ️  Data saved to: server/bookings.json');
      console.log('ℹ️  To use MongoDB: Set up Atlas and update .env');
      console.log('=================================');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

