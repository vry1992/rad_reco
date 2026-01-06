import { api } from '../../../services/api';
import type {
  IPagination,
  IShipType,
  ITransmitionTypes,
} from '../../../types/types';
import { TransmissionTypesService } from '../../AddDetection/services/transmission-type.service';

const shipTypes = {
  getAll: (pagination: IPagination): Promise<[IShipType[], number]> => {
    const query = new URLSearchParams({
      take: pagination.take.toString(),
      skip: pagination.skip.toString(),
    });
    return api.get(`ship-types?${query}`);
  },
  getOne: (id: string): Promise<IShipType> => {
    return api.get(`ship-types/${id}`);
  },
  deleteOne: (id: string): Promise<void> => {
    return api.delete(`ship-types/${id}`);
  },
};

const transmisionTypes = {
  get: (pagination: IPagination): Promise<[ITransmitionTypes[], number]> => {
    return TransmissionTypesService.getTransmitionTypes(pagination);
  },
  post: (data: FormData) => {
    return TransmissionTypesService.createTransmissionType(data);
  },
  put: (id: string, data: FormData) => {
    return TransmissionTypesService.editTransmissionType(id, data);
  },
  delete: (id: string) => {
    return TransmissionTypesService.deleteOne(id);
  },
  getOne: (id: string): Promise<ITransmitionTypes> => {
    return TransmissionTypesService.getOne(id);
  },
  getImages: (id: string, name: string) => {
    return TransmissionTypesService.getTransmitionTypeImage(id, name);
  },
};

export const DataStoreService = {
  shipTypes,
  transmisionTypes,
};
