import { Form, Select } from 'antd';
import 'dayjs/locale/uk';
import { useState } from 'react';
import type { SelectOptionType } from '../../../../types/types';
import { transmissionTypes_MOCK } from '../mocks/mocksDetections';

export type BaseFieldProps = {
  placeholder?: string;
  name: string;
  label: string;
  required: boolean;
};

type TransmissionTypeFieldProps = BaseFieldProps;

export const TransmisionTypeField = (props: TransmissionTypeFieldProps) => {
  const [value, setValue] = useState<string | null>(null);
  const options = transmissionTypes_MOCK.reduce<
    Record<string, SelectOptionType>
  >((acc, curr) => {
    acc[curr.id] = {
      value: curr.id,
      label: curr.name,
    };
    return acc;
  }, {});

  return (
    <Form.Item
      layout="vertical"
      label={props.label}
      name={props.name}
      rules={[{ required: props.required, message: 'Оберіть вид передачі' }]}>
      <Select
        value={value}
        style={{ width: '100%' }}
        onChange={setValue}
        options={Object.values(options)}
      />
    </Form.Item>
  );
};
