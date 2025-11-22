import { Form, InputNumber } from 'antd';
import type { BaseFieldProps, DetectionFormValues } from './DetectionForm';

type FrequencyInputProps = BaseFieldProps;

export const FrequencyField = (props: FrequencyInputProps) => {
  return (
    <Form.Item<DetectionFormValues>
      layout="vertical"
      label={props.label}
      name={props.name}
      rules={[
        {
          required: props.required,
          message: 'Вкажіть частоту',
        },
      ]}>
      <InputNumber<string>
        min="1000"
        step="0.5"
        stringMode
        style={{ width: '100%' }}
      />
    </Form.Item>
  );
};
