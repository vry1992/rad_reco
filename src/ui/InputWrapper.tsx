import { Form } from 'antd';
import type { Rule } from 'antd/es/form';
import type { FC, PropsWithChildren } from 'react';

type Props = {
  name: string;
  label: string;
  rules?: Rule[];
} & PropsWithChildren;

export const InputWrapper: FC<Props> = ({
  label,
  name,
  rules,
  children,
}: Props) => {
  return (
    <Form.Item rules={rules} name={name} className="floating-item">
      <div className="floating-container">
        {children}
        <label>{label}</label>
      </div>
    </Form.Item>
  );
};
