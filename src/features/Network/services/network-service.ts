import { api } from '../../../services/api';
import type { IDetection, INetwork, ITemplate } from '../../../types/types';

const getNetwork = async (networkId: string): Promise<INetwork> => {
  return api.get(`/network/${networkId}`);
};

const getNetworkTemplate = async (networkId: string): Promise<ITemplate> => {
  return api.get(`/network/${networkId}/template`);
};

const getNetworkFrequencies = async (
  networkId: string
): Promise<Pick<IDetection, 'frequency'>[]> => {
  return api.get(`/network/${networkId}/frequencies`);
};

export const NetworkService = {
  getNetwork,
  getNetworkTemplate,
  getNetworkFrequencies,
};
