const dns = require('dns');
// Set public DNS resolvers to ensure Node resolves MongoDB SRV records reliably in local ISP/VPN environments
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Could not set custom DNS servers, using system default:', e.message);
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Appointment = require('./models/Appointment');
const appointmentsRoutes = require('./routes/appointments');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/appointments', appointmentsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Initial seed data from brief
const initialSeedData = [
  {
    customerName: 'Alex Morgan',
    service: 'Consultation',
    dateTime: new Date('2026-11-02T10:00:00'),
    status: 'Pending',
  },
  {
    customerName: 'Jamie Lee',
    service: 'Follow-up',
    dateTime: new Date('2026-11-02T11:30:00'),
    status: 'Confirmed',
  },
  {
    customerName: 'Taylor Smith',
    service: 'Review',
    dateTime: new Date('2026-11-03T14:00:00'),
    status: 'Cancelled',
  },
];

async function seedIfEmpty() {
  try {
    const count = await Appointment.countDocuments();
    if (count === 0) {
      console.log('No appointments found in DB. Seeding initial test data from brief...');
      await Appointment.insertMany(initialSeedData);
      console.log('Seeded 3 initial appointments successfully.');
    } else {
      console.log(`Database currently has ${count} appointment(s).`);
    }
  } catch (err) {
    console.error('Error during auto-seeding:', err.message);
  }
}

// Connect to MongoDB & Start Server
if (!MONGODB_URI) {
  console.error('FATAL: MONGODB_URI environment variable is not defined.');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('Successfully connected to MongoDB Atlas');
    await seedIfEmpty();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
