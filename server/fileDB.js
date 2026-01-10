import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'bookings.json');

// Simple file-based database (temporary solution until MongoDB is set up)
class FileDB {
  constructor() {
    this.data = {};
    this.initialized = false;
  }

  async init() {
    try {
      const fileData = await fs.readFile(DB_FILE, 'utf8');
      this.data = JSON.parse(fileData);
      console.log('✅ Loaded bookings from file database');
    } catch (error) {
      // File doesn't exist yet, start with empty data
      this.data = {};
      await this.save();
      console.log('✅ Created new file database');
    }
    this.initialized = true;
  }

  async save() {
    await fs.writeFile(DB_FILE, JSON.stringify(this.data, null, 2));
  }

  async getAllBookings() {
    return this.data;
  }

  async getBookingsByDate(date) {
    return this.data[date] || [];
  }

  async setBookingsByDate(date, bookings) {
    if (bookings.length === 0) {
      delete this.data[date];
    } else {
      this.data[date] = bookings;
    }
    await this.save();
  }

  async deleteBookingsByDate(date) {
    delete this.data[date];
    await this.save();
  }
}

export const fileDB = new FileDB();

