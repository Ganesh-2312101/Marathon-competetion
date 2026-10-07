const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initDB } = require('./config/db');

const participantRoutes = require('./routes/participantRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database connection & tables
initDB();

// API Routes
app.use('/api/participants', participantRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api', (req, res) => {
  res.send({
    message: 'TAMIL NADU MARATHON 2026 - Registration System API Running',
    status: 'Active'
  });
});

app.get('/', (req, res) => {
  res.send({
    message: 'TAMIL NADU MARATHON 2026 - Registration System API Running',
    status: 'Active'
  });
});

// Export app for Serverless / Vercel deployment & listen if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Node.js Express Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
