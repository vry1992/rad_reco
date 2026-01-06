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
    return api.get(`/transmission-types/all?${query}`);
  }
  return api.get('/transmission-types/all');
};

const createTransmissionType = async (data: FormData) => {
  return api.post('/transmission-types', data);
};

const editTransmissionType = async (id: string, data: FormData) => {
  return api.put(`/transmission-types/${id}`, data);
};

const getTransmitionTypeImage = (id: string, name: string): Promise<Blob> => {
  const params = new URLSearchParams({
    name,
  });
  return api.get(`/transmission-types/${id}/image?${params}`, {
    responseType: 'blob',
  });
};

const getOne = (id: string): Promise<ITransmitionTypes> => {
  return api.get(`/transmission-types/${id}`);
};

const deleteOne = (id: string) => {
  return api.delete(`/transmission-types/${id}`);
};

export const TransmissionTypesService = {
  editTransmissionType,
  getTransmitionTypes,
  createTransmissionType,
  getTransmitionTypeImage,
  getOne,
  deleteOne,
};
