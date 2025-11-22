import { api } from '../../../services/api';
import type { IDetection } from '../../../types/types';
import { FILTER_SEARCH_KEY } from '../constants';
import type { MyNetworksResponse } from '../types';

const getNetworksList = (
  userId: string,
  filter: string
): Promise<MyNetworksResponse> => {
  return api.get(`network/list/${userId}?${FILTER_SEARCH_KEY}=${filter}`);
};

const getOneDetection = (detectionId: string): Promise<IDetection> => {
  return api.get(`detection/${detectionId}`);
};

const getLastDetections = ({
  skip,
  limit,
  userId,
}: {
  skip: number;
  limit: number;
  userId: string;
}): Promise<IDetection[]> => {
  const params = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString(),
  });
  return api.get(`detection/last/${userId}?${params}`);
};

export const DetectionsService = {
  getNetworksList,
  getOneDetection,
  getLastDetections,
};
