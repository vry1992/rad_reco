import { api } from '../../../services/api';
import type { MyNetworksResponse } from '../types';

const getMyNetworks = async (userId: string): Promise<MyNetworksResponse> => {
  return api.get(`network/my/${userId}`);
};

export const DetectionsService = {
  getMyNetworks,
};
