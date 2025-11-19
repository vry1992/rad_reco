import { api } from '../../../services/api';
import type { IShip, ITransmitionTypes, IUnit } from '../../../types/types';

const getAllShips = async (): Promise<IShip[]> => {
  return api.get('/ships');
};

const getAllUnits = async (): Promise<IUnit[]> => {
  return api.get('/units');
};

const getTransmitionTypes = async (): Promise<ITransmitionTypes[]> => {
  return api.get('/detection/all/transmission-types');
};

const createDetection = (payload: any) => {
  return api.post(`/detection`, payload);
};

export const AddDetectionService = {
  getAllShips,
  getAllUnits,
  createDetection,
  getTransmitionTypes,
};
