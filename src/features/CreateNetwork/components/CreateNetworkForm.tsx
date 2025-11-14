import type { FormProps, RadioChangeEvent } from 'antd';
import { Button, Flex, Form, Input, Radio, Typography } from 'antd';
import { useEffect, type FC } from 'react';
import { FieldsEnum } from '../../AddDetection/Components/AddFieldsToDetectionForm/types';
import { DEFAULT_FIELDS_STATE, FIELD_NAME_MAP } from '../constants';
import { CreateNetworkService } from '../services/create-network.service';

type Props = {
  userId: string;
};

export type FieldType = {
  name: string;
  timeOfDetection: FieldsEnum;
  timeFrom: FieldsEnum;
  timeTo: FieldsEnum;
  abonentFrom: FieldsEnum;
  abonentTo: FieldsEnum;
  abonentCircular: FieldsEnum;
  frequency: FieldsEnum;
  pelengsImg: FieldsEnum;
  transmissionType: FieldsEnum;
  additionalInformation: FieldsEnum;
  lat: FieldsEnum;
  lng: FieldsEnum;
  map: FieldsEnum;
};

export const CreateNetworkForm: FC<Props> = ({ userId }) => {
  const listOfFields = Object.keys(
    DEFAULT_FIELDS_STATE
  ) as unknown as (keyof FieldType)[];

  const disabledFields = [
    FIELD_NAME_MAP.frequency.name,
    FIELD_NAME_MAP.transmissionType.name,
  ];

  const [form] = Form.useForm<FieldType>();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      await CreateNetworkService.createNetwork(values, userId);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const changeNetworkProps = (name: keyof FieldType, value: FieldsEnum) => {
    form.setFieldValue(name, value);
  };

  useEffect(() => {
    listOfFields.forEach((field) => {
      form.setFieldValue(field, DEFAULT_FIELDS_STATE[field]);
    });
  }, []);

  return (
    <Form
      form={form}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      style={{ width: '100%' }}
      onFinish={onFinish}>
      <Form.Item<FieldType>
        label="Назва радіомережі"
        name="name"
        layout="vertical"
        rules={[{ required: true, message: 'Введіть назву радіомережі!' }]}>
        <Input
          placeholder="КХ радіомережа підарського підрозділу"
          size="large"
        />
      </Form.Item>

      {listOfFields.map((field) => {
        const defaultValue = DEFAULT_FIELDS_STATE[field];
        return (
          <Form.Item<FieldType>
            name={field}
            key={field}
            normalize={(value) => Number(value)}>
            <Flex justify="space-between" style={{ width: '40%' }}>
              <Typography.Title level={5}>
                {FIELD_NAME_MAP[field].label}
              </Typography.Title>

              <Radio.Group
                onChange={(e: RadioChangeEvent) =>
                  changeNetworkProps(field, +e.target.value)
                }
                disabled={disabledFields.includes(field)}
                block
                options={[
                  {
                    value: FieldsEnum.REQUIRED,
                    label: 'Обов`язкове',
                  },
                  {
                    value: FieldsEnum.ON,
                    label: 'Увімкнене',
                  },
                  {
                    value: FieldsEnum.OFF,
                    label: 'Вимкнене',
                  },
                ]}
                defaultValue={defaultValue}
                optionType="button"
                buttonStyle="solid"
              />
            </Flex>
          </Form.Item>
        );
      })}

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Зберегти
        </Button>
      </Form.Item>
    </Form>
  );
};
