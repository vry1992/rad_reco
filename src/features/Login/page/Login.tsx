import type { FormProps } from 'antd';
import { Button, Col, Form, Input, Row } from 'antd';
import { useLoginActionCreators } from '../store/slice';

type FieldType = {
  username: string;
  password: string;
};

export const Login = () => {
  const loginActionCreators = useLoginActionCreators();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    loginActionCreators.login({
      name: values.username,
      password: values.password,
    });
  };

  return (
    <Row>
      <Col span={12} offset={6}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ username: '4001', password: '111111' }}
          onFinish={onFinish}
          autoComplete="off">
          <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={[
              { required: true, message: 'Please input your username!' },
            ]}>
            <Input value={'4001'} />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
            ]}>
            <Input.Password value={'111111'} />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};
