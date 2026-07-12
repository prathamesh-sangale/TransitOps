import { ApiError } from '../utils/ApiError.js';

export const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, 'ROUTE_NOT_FOUND', `Route ${req.originalUrl} not found`));
};
