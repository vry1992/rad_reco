import { api } from '../../../services/api';
import type { CreateNewtorkPayload } from '../types';

const createNetwork = async (payload: CreateNewtorkPayload, userId: string) => {
  return api.post(`network/${userId}`, payload);
};

export const CreateNetworkService = { createNetwork };
