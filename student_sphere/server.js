// Server setup
const app = require('./src/app');
const { connectDatabase } = require('./src/config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

connectDatabase()
  .then(() => {
    console.log('MongoDB connected');
    startServer(PORT);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = Number(port) + 1;
      console.warn(`Port ${port} is already in use. Trying port ${nextPort}...`);
      startServer(nextPort);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

