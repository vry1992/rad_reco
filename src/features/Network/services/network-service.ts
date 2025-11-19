import { api } from '../../../services/api';
import type { INetwork, ITemplate } from '../../../types/types';

const getNetwork = async (networkId: string): Promise<INetwork> => {
  return api.get(`/network/${networkId}`);
};

const getNetworkTemplate = async (networkId: string): Promise<ITemplate> => {
  return api.get(`/network/${networkId}/template`);
};

export const NetworkService = { getNetwork, getNetworkTemplate };
