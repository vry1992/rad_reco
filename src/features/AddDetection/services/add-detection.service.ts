import { api } from '../../../services/api';
import type { IShip, IUnit } from '../../../types/types';

const getAllShips = async (): Promise<IShip[]> => {
  return api.get('/ships');
};

const getAllUnits = async (): Promise<IUnit[]> => {
  return api.get('/units');
};

const createDetection = (payload: any) => {
  return api.post(`/detection`, payload);
};

export const AddDetectionService = {
  getAllShips,
  getAllUnits,
  createDetection,
};
