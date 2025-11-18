import { api } from '../../../services/api';
import type { IShip, IUnit } from '../../../types/types';

const getAllShips = async (): Promise<IShip[]> => {
  return api.get('/ships');
};

const getAllUnits = async (): Promise<IUnit[]> => {
  return api.get('/units');
};

export const AddDetectionService = {
  getAllShips,
  getAllUnits,
};
