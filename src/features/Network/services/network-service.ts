import { api } from '../../../services/api';
import type { Network } from '../../Detection/types';

const getNetwork = async (networkId: string): Promise<Network> => {
  return api.get(`/network/${networkId}`);
};

export const NetworkService = { getNetwork };
