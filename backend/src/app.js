import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { notFoundHandler } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: env.FRONTEND_ORIGIN }));
app.use(helmet());
app.use(morgan('dev'));

// Central API Routes
app.use('/api', routes);

// 404 Handler
app.use(notFoundHandler);

// Central Error Handler
app.use(errorHandler);

export default app;
