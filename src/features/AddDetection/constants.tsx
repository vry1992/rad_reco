export type FieldBaseFields = { label: string; groupOrder: number };

export const FIELD_NAME_MAP: {
  [key: string]: FieldBaseFields;
} = {
  timeOfDetection: {
    label: 'Час виявлення',
    groupOrder: 1,
  },
  timeFrom: { label: 'Час із', groupOrder: 2 },
  timeTo: { label: 'Час по', groupOrder: 3 },
  abonentFrom: {
    label: 'Хто',
    groupOrder: 4,
  },
  abonentTo: { label: 'Кого', groupOrder: 5 },
  abonentCircular: { label: 'Циркуляр', groupOrder: 6 },
  frequency: { label: 'Частота', groupOrder: 7 },
  pelengsImg: {
    label: 'Скриз з пеленгами',
    groupOrder: 8,
  },
  transmissionType: {
    label: 'Вид передачі',
    groupOrder: 9,
  },
  additionalInformation: {
    label: 'Додаткова інформація',
    groupOrder: 10,
  },

  lat: { label: 'Широта', groupOrder: 11 },
  lng: { label: 'Довгота', groupOrder: 12 },
  map: { label: 'Карта', groupOrder: 13 },
};
