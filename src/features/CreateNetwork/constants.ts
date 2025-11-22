import { FieldsEnum } from '../AddDetection/Components/AddFieldsToDetectionForm/types';

export type FieldBaseFields = {
  label: string;
  groupOrder: number;
  name: string;
  description: string;
};

export const FIELD_NAME_MAP: {
  [key: string]: FieldBaseFields;
} = {
  timeOfDetection: {
    label: 'Час виявлення',
    groupOrder: 1,
    name: 'timeOfDetection',
    description: 'Додати пояснення до поля',
  },
  timeFrom: {
    label: 'Час із',
    groupOrder: 2,
    name: 'timeFrom',
    description: 'Додати пояснення до поля',
  },
  timeTo: {
    label: 'Час по',
    groupOrder: 3,
    name: 'timeTo',
    description: 'Додати пояснення до поля',
  },
  abonentsFrom: {
    label: 'Хто',
    groupOrder: 4,
    name: 'abonentsFrom',
    description: 'Додати пояснення до поля',
  },
  abonentsTo: {
    label: 'Кого',
    groupOrder: 5,
    name: 'abonentsTo',
    description: 'Додати пояснення до поля',
  },
  abonentsCircular: {
    label: 'Циркуляр',
    groupOrder: 6,
    name: 'abonentsCircular',
    description: 'Додати пояснення до поля',
  },
  frequency: {
    label: 'Частота',
    groupOrder: 7,
    name: 'frequency',
    description: 'Додати пояснення до поля',
  },
  pelengsImg: {
    label: 'Скриз з пеленгами',
    groupOrder: 8,
    name: 'pelengsImg',
    description: 'Додати пояснення до поля',
  },
  transmissionType: {
    label: 'Вид передачі',
    groupOrder: 9,
    name: 'transmissionType',
    description: 'Додати пояснення до поля',
  },
  additionalInformation: {
    label: 'Додаткова інформація',
    groupOrder: 10,
    name: 'additionalInformation',
    description: 'Додати пояснення до поля',
  },
  lat: {
    label: 'Широта',
    groupOrder: 11,
    name: 'lat',
    description: 'Додати пояснення до поля',
  },
  lng: {
    label: 'Довгота',
    groupOrder: 12,
    name: 'lng',
    description: 'Додати пояснення до поля',
  },
  map: {
    label: 'Карта',
    groupOrder: 13,
    name: 'map',
    description: 'Додати пояснення до поля',
  },
};

export const DEFAULT_FIELDS_STATE: Record<
  keyof typeof FIELD_NAME_MAP,
  FieldsEnum
> = {
  [FIELD_NAME_MAP.timeOfDetection.name]: FieldsEnum.REQUIRED,
  [FIELD_NAME_MAP.frequency.name]: FieldsEnum.REQUIRED,
  [FIELD_NAME_MAP.transmissionType.name]: FieldsEnum.REQUIRED,
  [FIELD_NAME_MAP.timeFrom.name]: FieldsEnum.OFF,
  [FIELD_NAME_MAP.timeTo.name]: FieldsEnum.OFF,
  [FIELD_NAME_MAP.abonentsFrom.name]: FieldsEnum.OFF,
  [FIELD_NAME_MAP.abonentsTo.name]: FieldsEnum.OFF,
  [FIELD_NAME_MAP.abonentsCircular.name]: FieldsEnum.OFF,
  [FIELD_NAME_MAP.pelengsImg.name]: FieldsEnum.OFF,
  [FIELD_NAME_MAP.additionalInformation.name]: FieldsEnum.OFF,
  [FIELD_NAME_MAP.lat.name]: FieldsEnum.OFF,
  [FIELD_NAME_MAP.lng.name]: FieldsEnum.OFF,
  [FIELD_NAME_MAP.map.name]: FieldsEnum.OFF,
};
