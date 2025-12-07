import { Button, Form, Input } from 'antd';
import { InputWrapper } from '../../../ui/InputWrapper';
import { PasteImageField } from '../../AddDetection/Components/DetectionForm/PasteImageField';
import { DataStoreService } from '../services/DataStore.service';

type ValueType = {
  name: string;
  images?: File[];
};

export const TransmissionTypeForm = () => {
  const [form] = Form.useForm<ValueType>();

  const onSubmit = async (values: ValueType) => {
    const images: File[] = form.getFieldValue('images') || [];

    const formData = new FormData();
    formData.append('name', values.name);
    images.forEach((file) => {
      formData.append('images', file, `${file.lastModified}_${file.name}`);
    });
    await DataStoreService.transmisionTypes.post(formData);
  };

  return (
    <Form form={form} onFinish={onSubmit}>
      <InputWrapper
        name={'name'}
        label="Назва"
        rules={[
          {
            required: true,
            message: 'Введіть назву виду передачі',
          },
        ]}>
        <Input />
      </InputWrapper>
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
      />

      <Button type="primary" htmlType="submit">
        Зберегти
      </Button>
    </Form>
  );
};
