import { api } from '../../../services/api';
import type { IPagination, ITransmitionTypes } from '../../../types/types';

const getTransmitionTypes = async (
  pagination?: IPagination
): Promise<[ITransmitionTypes[], number]> => {
  if (pagination) {
    const query = new URLSearchParams({
      take: pagination.take.toString(),
      skip: pagination.skip.toString(),
    });
    return api.get(`/transmission-types?${query}`);
  }
  return api.get('/transmission-types');
};

const createTransmissionType = async (data: FormData) => {
  return api.post('/transmission-types', data);
};

export const TransmissionTypesService = {
  getTransmitionTypes,
  createTransmissionType,
};
