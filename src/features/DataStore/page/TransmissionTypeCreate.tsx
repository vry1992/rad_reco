import { Typography } from 'antd';
import { TransmissionTypeForm } from '../components/TransmissionTypeForm';

export const TransmissionTypeCreate = () => {
  return (
    <div>
      <Typography.Title level={3}>Створення виду передачі: </Typography.Title>
      <TransmissionTypeForm />
    </div>
  );
};
