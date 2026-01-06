import { Typography } from 'antd';
import { ShipTypeForm } from '../components/ShipTypeForm';

export const ShipTypeCreate = () => {
  return (
    <div>
      <Typography.Title level={3}>Створення типу НК / ПЧ: </Typography.Title>
      <ShipTypeForm />
    </div>
  );
};
