import { api } from '../../../services/api';
import type { IAbonent, IDetection } from '../../../types/types';
import { FILTER_SEARCH_KEY } from '../constants';
import type { MyNetworksResponse } from '../types';

const getNetworksList = (
  userId: string,
  filter: string
): Promise<MyNetworksResponse> => {
  return api.get(`network/list/${userId}?${FILTER_SEARCH_KEY}=${filter}`);
};

const getScreenshot = (
  networkId: string,
  detectionId: string,
  filename: string
): Promise<Blob> => {
  const params = new URLSearchParams({
    networkId,
    detectionId,
  });
  return api.get(`detection/screenshot/${filename}?${params}`, {
    responseType: 'blob',
  });
};

const getOneDetection = (detectionId: string): Promise<IDetection> => {
  return api.get(`detection/${detectionId}`);
};

const getLastDetections = ({
  skip,
  limit,
  userId,
  filter,
}: {
  skip: number;
  limit: number;
  userId: string;
  filter: string;
}): Promise<IDetection[]> => {
  const params = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString(),
    filter,
  });
  return api.get(`detection/last/${userId}?${params}`);
};

const getCallsigns = async (
  networkId: string
): Promise<Pick<IAbonent, 'callsign'>[]> => {
  return api.get(`/detection/${networkId}/callsigns`);
};

const getCallsignAbonents = async (
  networkId: string,
  callsign: string
): Promise<IAbonent[]> => {
  const query = new URLSearchParams({
    callsign,
  });
  return api.get(`/detection/${networkId}/callsign-abonents?${query}`);
};

export const DetectionsService = {
  getNetworksList,
  getOneDetection,
  getLastDetections,
  getScreenshot,
  getCallsigns,
  getCallsignAbonents,
};
