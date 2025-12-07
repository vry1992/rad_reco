import { Select } from 'antd';
import 'dayjs/locale/uk';
import type {
  ITransmitionTypes,
  SelectOptionType,
} from '../../../../types/types';

type TransmissionTypeFieldProps = {
  types: ITransmitionTypes[];
  defaultValue: string;
  onChange: (value: string) => void;
};

export const TransmisionTypeField = (props: TransmissionTypeFieldProps) => {
  const options = props.types.reduce<Record<string, SelectOptionType>>(
    (acc, curr) => {
      acc[curr.id] = {
        value: curr.id,
        label: curr.name,
      };
      return acc;
    },
    {}
  );

  return (
    <Select<string>
      defaultValue={props.defaultValue}
      onChange={props.onChange}
      style={{ width: '100%' }}
      options={Object.values(options)}
      size="large"
      placeholder=" "
    />
  );
};
