import { Button, Col, Form, Input, Row } from 'antd';
import { useEffect, type FC } from 'react';
import { useNavigate } from 'react-router';
import { ValidationError } from '../../../errors.helper';
import { useLeaveWarning } from '../../../hooks/useLeaveWarning';
import type { IShipType } from '../../../types/types';
import { InputWrapper } from '../../../ui/InputWrapper';
import { isInstanceOf } from '../../../utils';

type ValueType = {
  name: string;
  abbreviatedType: string;
};

type Props = {
  defaultData?: {
    data: IShipType;
  };
};

export const ShipTypeForm: FC<Props> = (props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm<ValueType>();

  const { showLeaveModal } = useLeaveWarning(form.isFieldsTouched);

  const onSubmit = async (values: ValueType) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(values)) {
      if (!value) {
        continue;
      }
      formData.append(key, value);
    }

    try {
      if (props?.defaultData?.data) {
        // await DataStoreService.transmisionTypes.put(
        //   props.defaultData.data.id,
        //   formData
        // );
      } else {
        // await DataStoreService.transmisionTypes.post(formData);
      }
      form.resetFields();
      navigate(-1);
    } catch (error) {
      if (isInstanceOf(error, ValidationError)) {
      }
    } finally {
    }
  };

  useEffect(() => {
    if (props?.defaultData?.data) {
      for (const [key, value] of Object.entries(props.defaultData.data)) {
        form.setFieldValue(key as keyof ValueType, value);
      }
    }
  }, [props?.defaultData?.data]);

  return (
    <Row>
      <Col xs={{ span: 22, offset: 1 }} sm={{ span: 18, offset: 3 }}>
        <Form name="transmissionTypeCreateForm" form={form} onFinish={onSubmit}>
          <InputWrapper label="Назва">
            <Form.Item
              name={'name'}
              rules={[
                {
                  required: true,
                  message: 'Введіть назву типу НК / ПЧ',
                },
              ]}>
              <Input placeholder="Малий ракетний корабель" />
            </Form.Item>
          </InputWrapper>

          <InputWrapper label="Абревіатура">
            <Form.Item
              name={'abbreviatedType'}
              rules={[
                {
                  required: true,
                  message: 'Введіть абревыатуру',
                },
              ]}>
              <Input placeholder="мрк" />
            </Form.Item>
          </InputWrapper>

          <Button type="primary" htmlType="submit">
            {props?.defaultData?.data ? 'Оновити' : 'Зберегти'}
          </Button>
        </Form>
      </Col>
      {showLeaveModal()}
    </Row>
  );
};
