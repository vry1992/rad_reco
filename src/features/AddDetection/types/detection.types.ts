import type { FieldsEnum } from '../Components/AddFieldsToDetectionForm/types';

export type TDetection = {
  id: string;
};

export type TFieldsSetupMap = {
  [key in FieldsEnum]: string[];
};

export type TTransmission = {
  id: string;
  name: string;
};
