import type { FieldsEnum } from '../AddDetection/Components/AddFieldsToDetectionForm/types';

export type Network = {
  id: string;
  name: string;
  template: NetworkTemplate;
};

export type NetworkTemplate = {
  id: string;
  timeOfDetection: FieldsEnum;
  timeFrom: FieldsEnum;
  timeTo: FieldsEnum;
  abonentFrom: FieldsEnum;
  abonentTo: FieldsEnum;
  abonentCircular: FieldsEnum;
  frequency: FieldsEnum;
  pelengsImg: FieldsEnum;
  transmissionType: FieldsEnum;
  additionalInformation: FieldsEnum;
  lat: FieldsEnum;
  lng: FieldsEnum;
  map: FieldsEnum;
};

export type MyNetworksResponse = Network[];
