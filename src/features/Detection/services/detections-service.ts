import { api } from '../../../services/api';
import type { IDetection } from '../../../types/types';
import type { MyNetworksResponse } from '../types';

const getMyNetworks = (userId: string): Promise<MyNetworksResponse> => {
  return api.get(`network/my/${userId}`);
};

const getOneDetection = (detectionId: string): Promise<IDetection> => {
  return api.get(`detection/${detectionId}`);
};

export const DetectionsService = {
  getMyNetworks,
  getOneDetection,
};
