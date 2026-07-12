import { ApiError } from '../utils/ApiError.js';

export const validate = (schema) => (req, res, next) => {
  try {
    const parsedData = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });

    req.body = parsedData.body;
    req.query = parsedData.query;
    req.params = parsedData.params;

    next();
  } catch (error) {
    const details = error.errors ? error.errors.map(e => ({ path: e.path.join('.'), message: e.message })) : null;
    next(new ApiError(400, 'VALIDATION_ERROR', 'Invalid request data', details));
  }
};
