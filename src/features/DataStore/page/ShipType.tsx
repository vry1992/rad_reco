import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { IShipType } from '../../../types/types';
import { DataStoreService } from '../services/DataStore.service';

export const ShipType = () => {
  const navigate = useNavigate();
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

  const actions: React.ReactNode[] = [
    <Button
      color="primary"
      onClick={() => navigate(`/data-store/ship-types/edit/${params?.id}`)}>
      <EditOutlined />
    </Button>,
    <Popconfirm
      title="Видалення типу НК / ПЧ"
      description="Ви дійсно бажаєте видалити тип НК / ПЧ? Він не буде відображатись в списку типів НК / ПЧ, але залишиться в історичних перехопленнях."
      okText="Так"
      cancelText="Відміна"
      onConfirm={async () => {
        if (shipType?.id) {
          await DataStoreService.shipTypes.deleteOne(shipType.id);
          navigate(-1);
        }
      }}>
      <Button danger variant="solid" disabled>
        <DeleteOutlined />
      </Button>
    </Popconfirm>,
  ];

  return (
    <div>
      <Card actions={actions}>
        <Card.Meta title={'Опис типу корабля:'} />
        {shipType ? (
          <>
            <Typography.Text
              style={{ textAlign: 'left', display: 'block', marginBottom: 10 }}>
              <b>Назва:</b> {shipType.name}
            </Typography.Text>
            <Typography.Text
              style={{ textAlign: 'left', display: 'block', marginBottom: 10 }}>
              <b>Скорочена назва (абревіатура): </b>
              {shipType.abbreviatedType}
            </Typography.Text>
          </>
        ) : null}
      </Card>
    </div>
  );
};
