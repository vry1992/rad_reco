import type { IAircraft, IPagination } from '../types/types';
import { api } from './api';

const getAll = (pagination?: IPagination): Promise<[IAircraft[], number]> => {
  if (pagination) {
    const query = new URLSearchParams({
      take: pagination.take.toString(),
      skip: pagination.skip.toString(),
    });
    return api.get(`aircraft?${query}`);
  }
  return api.get(`aircraft`);
};

export const AircraftService = {
  getAll,
};
