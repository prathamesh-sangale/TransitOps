import * as tripService from '../services/trip.service.js';
import { successResponse, collectionResponse } from '../utils/apiResponse.js';

export const getTrips = async (req, res) => {
  const result = await tripService.getTrips(req.query);
  collectionResponse(res, result.data, result.meta);
};

export const getTrip = async (req, res) => {
  const trip = await tripService.getTripById(req.params.id);
  successResponse(res, trip);
};

export const createTrip = async (req, res) => {
  const trip = await tripService.createTrip(req.body);
  successResponse(res, trip, 201);
};

export const dispatchTrip = async (req, res) => {
  const trip = await tripService.dispatchTrip(req.params.id, req.body);
  successResponse(res, trip);
};

export const completeTrip = async (req, res) => {
  const trip = await tripService.completeTrip(req.params.id);
  successResponse(res, trip);
};

export const cancelTrip = async (req, res) => {
  const trip = await tripService.cancelTrip(req.params.id, req.body);
  successResponse(res, trip);
};

