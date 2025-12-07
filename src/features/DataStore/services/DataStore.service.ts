import { api } from '../../../services/api';
import type {
  IPagination,
  IShipType,
  ITransmitionTypes,
} from '../../../types/types';
import { TransmissionTypesService } from '../../AddDetection/services/transmission-type.service';

const shipTypes = {
  get: (pagination: IPagination): Promise<[IShipType[], number]> => {
    const query = new URLSearchParams({
      take: pagination.take.toString(),
      skip: pagination.skip.toString(),
    });
    return api.get(`ships/types?${query}`);
  },
};

const transmisionTypes = {
  get: (pagination: IPagination): Promise<[ITransmitionTypes[], number]> => {
    return TransmissionTypesService.getTransmitionTypes(pagination);
  },
  post: (data: FormData) => {
    return TransmissionTypesService.createTransmissionType(data);
  },
};

export const DataStoreService = {
  shipTypes,
  transmisionTypes,
};
