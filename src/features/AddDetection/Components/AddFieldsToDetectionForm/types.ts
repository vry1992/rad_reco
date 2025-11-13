export type TNetworkDetectionTemplate = {
  id: string;
  networkId: string;
  timeOfDetection: FieldsEnum;
  timeFrom: FieldsEnum;
  timeTo: FieldsEnum;
  abonentFrom: FieldsEnum;
  abonentTo: FieldsEnum;
  abonentCircular: FieldsEnum;
  frequency: FieldsEnum;
  pelengsImg: FieldsEnum;
  lat: FieldsEnum;
  lng: FieldsEnum;
  map: FieldsEnum;
  additionalInformation: FieldsEnum;
  transmissionType: FieldsEnum;
};

export enum FieldsEnum {
  REQUIRED,
  ON,
  OFF,
}
