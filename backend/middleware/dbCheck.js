import { checkDBConnection } from '../config/db.js';

// Middleware to check if database is connected
export const checkDatabase = (req, res, next) => {
  const isConnected = checkDBConnection();
  
  if (!isConnected) {
    return res.status(503).json({ 
      message: 'Database is not connected. Please check your MongoDB connection string in the .env file.',
      error: 'DATABASE_NOT_CONNECTED'
    });
  }
  
  next();
};

