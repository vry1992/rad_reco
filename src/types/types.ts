export interface IShip {
  id: string;
  unitId: string;
  project: string;
  abbreviatedType: string;
  type: string;
  name: string;
  objectType: ObjectTypeEnum;
}

export interface IUnit {
  id: string;
  abbreviatedName: string;
  name: string;
  parent: IUnit | null;
  children: IUnit[];
  objectType: ObjectTypeEnum;
  ships: IShip[];
}

export interface ITransmitionTypes {
  id: string;
  name: string;
}

export interface IDetection {
  id: string;
  timeOfDetection: string;
  timeFrom: any;
  timeTo: any;
  frequency: string;
  pelengsImg: any;
  lat: any;
  lng: any;
  additionalInformation: boolean;
  abonents: IAbonent[];
  transmissionType: ITransmitionTypes;
  network: INetwork;
}

export interface IAbonent {
  id: string;
  peleng: string;
  callsign?: string;
  role: AbonentDirectionEnum;
  ship?: IShip;
  unit?: IUnit;
}

export interface ITemplate {
  id: string;
  timeOfDetection: number;
  timeFrom: number;
  timeTo: number;
  abonentFrom: number;
  abonentTo: number;
  abonentCircular: number;
  frequency: number;
  pelengsImg: number;
  lat: number;
  lng: number;
  map: number;
  additionalInformation: number;
  transmissionType: number;
}

export interface INetwork {
  id: string;
  name: string;
  template: ITemplate;
  detections: IDetection[];
}

export type SelectOptionType = { value: string; label: string };

export enum ObjectTypeEnum {
  SHIP,
  UNIT,
}

export enum AbonentDirectionEnum {
  FROM,
  TO,
  CIRCULAR,
}
