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

export type SelectOptionType = { value: string; label: string };

export enum ObjectTypeEnum {
  SHIP,
  UNIT,
}
