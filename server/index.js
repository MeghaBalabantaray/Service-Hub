import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDatabase, getDatabaseStatus, mongoUri } from './db.js';
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';
import serviceRoutes from './routes/services.js';
import uploadRoutes from './routes/uploads.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static('server/uploads'));


app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'ServiceHub',
    database: getDatabaseStatus(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/uploads', uploadRoutes);


async function start() {
  try {
    await connectDatabase();
    console.log(`MongoDB connected: ${getDatabaseStatus().name}`);

    app.listen(port, () => {
      console.log(`ServiceHub API running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Unable to start ServiceHub API');
    console.error(error.message);
    console.error(`Mongo URI: ${mongoUri}`);
    console.error('Check that MongoDB is running, or update MONGO_URI in .env.');
    process.exit(1);
  }
}

start();
