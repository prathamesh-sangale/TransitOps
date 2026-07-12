import { env } from './config/env.js';
import { checkDatabaseConnection, db } from './config/database.js';
import app from './app.js';

const PORT = env.PORT;

let server;

const startServer = async () => {
  try {
    await checkDatabaseConnection();
    server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

const gracefulShutdown = () => {
  console.log('Received shutdown signal, closing server...');
  if (server) {
    server.close(() => {
      console.log('HTTP server closed.');
      db.pool.end(() => {
        console.log('Database pool closed.');
        process.exit(0);
      });
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
