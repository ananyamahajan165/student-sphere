// Express app setup
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Middleware
app.use(express.json());

// Allow all cross-origin requests for quick local development
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

const reactBuildPath = path.join(__dirname, '../client/dist');
console.log('React build path:', reactBuildPath);
console.log('React build exists:', fs.existsSync(reactBuildPath));

if (fs.existsSync(reactBuildPath)) {
  app.use(express.static(reactBuildPath));
}
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root route to serve React app when built
app.get('/', (req, res) => {
  const indexPath = path.join(reactBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(404).send('Frontend not built. Run `npm run build` inside client.');
});

// Routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const markRoutes = require('./routes/marks');
const attendanceRoutes = require('./routes/attendance');
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/marks', markRoutes);
app.use('/api/attendance', attendanceRoutes);

app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  const indexPath = path.join(reactBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(404).send('Page not found');
});

module.exports = app;
