import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
const dbName = process.env.DATABASE_NAME || 'vjk_mahal';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db = null;

export async function connectDB() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    db = client.db(dbName);
    
    // Test connection
    await db.command({ ping: 1 });
    
    // Create collection with validation
    try {
      await db.createCollection('bookings', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            title: 'Booking Document Validation',
            required: ['date', 'bookings'],
            properties: {
              date: {
                bsonType: 'string',
                pattern: '^\\d{4}-\\d{2}-\\d{2}$',
                description: 'Date in YYYY-MM-DD format'
              },
              bookings: {
                bsonType: 'array',
                description: 'Array of booking objects',
                items: {
                  bsonType: 'object',
                  required: ['id', 'name', 'customerName', 'slot', 'price', 'advance', 'pending'],
                  properties: {
                    id: {
                      bsonType: 'string',
                      description: 'Unique booking ID'
                    },
                    name: {
                      bsonType: 'string',
                      description: 'Event name'
                    },
                    customerName: {
                      bsonType: 'string',
                      description: 'Customer name'
                    },
                    phone: {
                      bsonType: 'string',
                      description: 'Customer phone number'
                    },
                    slot: {
                      enum: ['Morning', 'Afternoon', 'Evening', 'All Day'],
                      description: 'Time slot'
                    },
                    price: {
                      bsonType: 'number',
                      minimum: 0,
                      description: 'Total price'
                    },
                    advance: {
                      bsonType: 'number',
                      minimum: 0,
                      description: 'Advance payment'
                    },
                    pending: {
                      bsonType: 'number',
                      minimum: 0,
                      description: 'Pending amount'
                    },
                    notes: {
                      bsonType: 'string',
                      description: 'Additional notes'
                    },
                    createdAt: {
                      bsonType: 'string',
                      description: 'Creation timestamp'
                    },
                    updatedAt: {
                      bsonType: 'string',
                      description: 'Last update timestamp'
                    }
                  }
                }
              }
            }
          }
        }
      });
      
      // Create unique index on date field
      await db.collection('bookings').createIndex({ date: 1 }, { unique: true });
      
      console.log('✅ Collection "bookings" created with validation schema');
    } catch (error) {
      if (error.codeName === 'NamespaceExists') {
        console.log('ℹ️  Collection "bookings" already exists');
      } else {
        throw error;
      }
    }
    
    console.log('✅ Connected to MongoDB:', dbName);
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
}

export async function closeDB() {
  await client.close();
  console.log('✅ MongoDB connection closed');
}

// Handle process termination
process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});

