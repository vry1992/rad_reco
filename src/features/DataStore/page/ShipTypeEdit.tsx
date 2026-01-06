import { Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import type { IShipType } from '../../../types/types';
import { ShipTypeForm } from '../components/ShipTypeForm';
import { DataStoreService } from '../services/DataStore.service';

export const ShipTypeEdit = () => {
  const [shipType, setShipType] = useState<IShipType | null>(null);
  const params = useParams<{ id: string }>();
  useEffect(() => {
    if (params?.id) {
      const fetch = async () => {
        try {
          const data = await DataStoreService.shipTypes.getOne(params.id!);
          setShipType(data);
        } catch (error) {
        } finally {
        }
      };

      fetch();
    }
  }, [params.id]);
  return (
    <div>
      <Typography.Title level={3}>Редагування типу НК / ПЧ: </Typography.Title>
      {shipType && <ShipTypeForm defaultData={{ data: shipType }} />}
    </div>
  );
};
