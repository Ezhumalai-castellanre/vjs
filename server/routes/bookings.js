import express from 'express';
import { getDB } from '../db.js';

const router = express.Router();

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const bookings = await db.collection('bookings').find({}).toArray();
    
    // Transform to match frontend format: { "2026-01-15": [...bookings] }
    const formattedBookings = {};
    bookings.forEach(doc => {
      formattedBookings[doc.date] = doc.bookings;
    });
    
    res.json(formattedBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get bookings for a specific date
router.get('/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const db = getDB();
    const doc = await db.collection('bookings').findOne({ date });
    
    res.json(doc ? doc.bookings : []);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Create or update bookings for a specific date
router.post('/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const { bookings } = req.body;
    
    if (!Array.isArray(bookings)) {
      return res.status(400).json({ error: 'Bookings must be an array' });
    }
    
    const db = getDB();
    
    if (bookings.length === 0) {
      // Delete the document if no bookings
      await db.collection('bookings').deleteOne({ date });
      return res.json({ message: 'Bookings deleted', date });
    }
    
    // Upsert: update if exists, insert if not
    const result = await db.collection('bookings').updateOne(
      { date },
      { 
        $set: { 
          date,
          bookings,
          updatedAt: new Date().toISOString()
        }
      },
      { upsert: true }
    );
    
    res.json({ 
      message: result.upsertedCount ? 'Bookings created' : 'Bookings updated',
      date,
      bookings
    });
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ error: 'Failed to save booking' });
  }
});

// Delete bookings for a specific date
router.delete('/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const db = getDB();
    
    await db.collection('bookings').deleteOne({ date });
    
    res.json({ message: 'Bookings deleted', date });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// Delete a specific booking by ID within a date
router.delete('/:date/:bookingId', async (req, res) => {
  try {
    const { date, bookingId } = req.params;
    const db = getDB();
    
    const doc = await db.collection('bookings').findOne({ date });
    if (!doc) {
      return res.status(404).json({ error: 'Date not found' });
    }
    
    const updatedBookings = doc.bookings.filter(b => b.id !== bookingId);
    
    if (updatedBookings.length === 0) {
      await db.collection('bookings').deleteOne({ date });
    } else {
      await db.collection('bookings').updateOne(
        { date },
        { $set: { bookings: updatedBookings } }
      );
    }
    
    res.json({ message: 'Booking deleted', date, bookingId });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

export default router;

