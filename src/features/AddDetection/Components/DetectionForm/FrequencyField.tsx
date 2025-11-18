import { Form, InputNumber } from 'antd';
import type { BaseFieldProps, DetectionFormValues } from './DetectionForm';

type FrequencyInputProps = BaseFieldProps & {
  onChange?: (value: DetectionFormValues['frequency']) => void;
  defaultValue?: string | null;
};

export const FrequencyField = (props: FrequencyInputProps) => {
  const onChange = (value: number | string | null) => {
    props.onChange?.(value ? value.toString() : null);
  };

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
        value={props.defaultValue || null}
        min="1000"
        step="0.5"
        stringMode
        style={{ width: '100%' }}
        onChange={onChange}
      />
    </Form.Item>
  );
};
