import { Form, Input } from 'antd';
import { type FC } from 'react';

type Props = {
  label: string;
  name: string | string[];
};

export const AdditionalInfoField: FC<Props> = (props) => {
  return (
    <Form.Item layout="vertical" name={props.name} label={props.label}>
      <Input.TextArea />
    </Form.Item>
  );
};
