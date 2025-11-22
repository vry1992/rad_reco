import type { FieldBaseFields } from '../CreateNetwork/constants';

export const TMP_FIELD_NAME_MAP: {
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
  timeTo: { label: 'Час по', groupOrder: 3, name: 'timeTo', description: '' },
  abonentsFrom: {
    label: 'Хто',
    groupOrder: 4,
    name: 'abonentFrom',
    description: 'Додати пояснення до поля',
  },
  abonentsTo: {
    label: 'Кого',
    groupOrder: 5,
    name: 'abonentTo',
    description: 'Додати пояснення до поля',
  },
  abonentCircular: {
    label: 'Циркуляр',
    groupOrder: 6,
    name: 'abonentCircular',
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
