import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Row } from 'antd';
import { useEffect, type FC } from 'react';
import { useNavigate } from 'react-router';
import { ValidationError } from '../../../errors.helper';
import { useLeaveWarning } from '../../../hooks/useLeaveWarning';
import type { ITransmitionTypes } from '../../../types/types';
import { InputWrapper } from '../../../ui/InputWrapper';
import { fileToUploadFile, isInstanceOf } from '../../../utils';
import { PasteImageField } from '../../AddDetection/Components/DetectionForm/PasteImageField';
import { DataStoreService } from '../services/DataStore.service';

type ValueType = {
  name: string;
  transmissionType: string;
  protocol: string;
  centralFrequency: string;
  usageNetworks: string[];
  bonents: string[];
  additionalInformation: string;
  images?: File[];
};

type Props = {
  defaultData?: {
    data: ITransmitionTypes;
    images: File[];
  };
};

export const TransmissionTypeForm: FC<Props> = (props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm<ValueType>();

  const { showLeaveModal } = useLeaveWarning(form.isFieldsTouched);

  const onSubmit = async (values: ValueType) => {
    const images: File[] = form.getFieldValue('images') || [];

    const formData = new FormData();

    for (const [key, value] of Object.entries(values)) {
      if (!value) {
        continue;
      }
      if (key === 'images') {
        images.forEach((file) => {
          formData.append('images', file, `${file.lastModified}_${file.name}`);
        });
      } else if (Array.isArray(value) && value.length) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value as string);
      }
    }

    try {
      if (props?.defaultData?.data) {
        await DataStoreService.transmisionTypes.put(
          props.defaultData.data.id,
          formData
        );
      } else {
        await DataStoreService.transmisionTypes.post(formData);
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

  useEffect(() => {
    if (props?.defaultData?.images) {
      form.setFieldValue('images', props.defaultData.images);
    }
  }, [props?.defaultData?.images]);

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
                  message: 'Введіть назву (умовну) виду передачі',
                },
              ]}>
              <Input placeholder="нс-1" />
            </Form.Item>
          </InputWrapper>

          <InputWrapper label="Вид передачі">
            <Form.Item
              name={'transmissionType'}
              rules={[
                {
                  required: true,
                  message: 'Введіть вид передачі',
                },
              ]}>
              <Input placeholder="ЧМ2-200//50-2с2" />
            </Form.Item>
          </InputWrapper>

          <InputWrapper label="Протокол">
            <Form.Item
              name={'protocol'}
              rules={[
                {
                  required: true,
                  message: 'Введіть протокол',
                },
              ]}>
              <Input placeholder="CW" />
            </Form.Item>
          </InputWrapper>

          <InputWrapper label="Центральна частота налагодження">
            <Form.Item
              name={'centralFrequency'}
              rules={[
                {
                  required: true,
                  message: 'Вкажіть центральну частоту налагодження',
                },
              ]}>
              <InputNumber<string>
                min="1000"
                step="0.5"
                stringMode
                style={{ width: '100%' }}
                suffix={'Гц'}
                size="large"
                placeholder=" "
              />
            </Form.Item>
          </InputWrapper>

          <Form.Item
            label={'Радіомережі країн, що використовують:'}
            layout="vertical">
            <Form.List name={'usageNetworks'}>
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field) => {
                    return (
                      <div
                        key={field.key}
                        style={{
                          display: 'flex',
                          rowGap: 16,
                        }}>
                        <InputWrapper label="Мережа">
                          <Form.Item noStyle {...field} layout="vertical">
                            <Input placeholder=" " />
                          </Form.Item>
                        </InputWrapper>

                        {fields.length >= 1 ? (
                          <DeleteOutlined
                            style={{
                              color: 'red',
                              marginLeft: '10px',
                            }}
                            onClick={() => remove(field.name)}
                          />
                        ) : null}
                      </div>
                    );
                  })}
                  <Form.Item>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                      }}>
                      <Button onClick={() => add('')} icon={<PlusOutlined />}>
                        Додати
                      </Button>
                    </div>

                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Form.Item label={'Кореспонденти:'} layout="vertical">
            <Form.List name={'abonents'}>
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field) => {
                    return (
                      <div
                        key={field.key}
                        style={{
                          display: 'flex',
                          rowGap: 16,
                        }}>
                        <InputWrapper label="Абонент">
                          <Form.Item noStyle {...field} layout="vertical">
                            <Input placeholder=" " />
                          </Form.Item>
                        </InputWrapper>

                        {fields.length >= 1 ? (
                          <DeleteOutlined
                            style={{
                              color: 'red',
                              marginLeft: '10px',
                            }}
                            onClick={() => remove(field.name)}
                          />
                        ) : null}
                      </div>
                    );
                  })}
                  <Form.Item>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                      }}>
                      <Button onClick={() => add('')} icon={<PlusOutlined />}>
                        Додати
                      </Button>
                    </div>

                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>

          <InputWrapper label="Додаткова інформація">
            <Form.Item name={'additionalInformation'} noStyle>
              <Input.TextArea rows={5} />
            </Form.Item>
          </InputWrapper>

          <>
            <Form.Item name="images" hidden></Form.Item>
            <PasteImageField
              onChange={(files) => {
                const originalFileObjects = files.map(
                  ({ originFileObj }) => originFileObj
                );
                form.setFieldValue('images', originalFileObjects);
              }}
              title="Додайте зображення спектру"
              limit={3}
              initFileList={props?.defaultData?.images?.map(fileToUploadFile)}
            />
          </>

          <Button type="primary" htmlType="submit">
            {props?.defaultData?.data ? 'Оновити' : 'Зберегти'}
          </Button>
        </Form>
      </Col>
      {showLeaveModal()}
    </Row>
  );
};
