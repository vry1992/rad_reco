import { BulbOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Flex,
  Skeleton,
  Table,
  Typography,
  type TableColumnsType,
} from 'antd';
import { type FC } from 'react';
import { useNavigate } from 'react-router';
import type { IPagination, IShipType } from '../../../types/types';
import { useFetch } from '../hooks/useFetch';

interface DataType extends IShipType {}

type Props = {
  action: (pagination: IPagination) => Promise<[IShipType[], number]>;
};

export const ShipTypesTable: FC<Props> = ({ action }) => {
  const navigate = useNavigate();
  const { loading, data, pagination, handleTableChange } = useFetch({ action });
  const columns: TableColumnsType<DataType> = [
    { title: 'Назва', dataIndex: 'name', key: 'name' },
    {
      title: 'Скорочена назва',
      dataIndex: 'abbreviatedType',
      key: 'abbreviatedType',
    },
    {
      title: 'Дія',
      dataIndex: '',
      key: 'edit',
      fixed: 'left',
      width: 100,
      render: (_, record: DataType) => (
        <Button onClick={() => navigate(`/data-store/ship-types/${record.id}`)}>
          <BulbOutlined />
        </Button>
      ),
    },
  ];
  return (
    <>
      {loading ? (
        <Skeleton />
      ) : (
        <>
          <Flex justify="space-between">
            <Typography.Title
              level={3}
              style={{
                textAlign: 'left',
              }}>
              Перелік збережених типів НК та ПЧ:
            </Typography.Title>
            <Button
              onClick={() => navigate('ship-types/create')}
              color="cyan"
              variant="solid">
              Створити новий <PlusOutlined />
            </Button>
          </Flex>

          <Table<DataType>
            onChange={handleTableChange}
            columns={columns}
            dataSource={data}
            pagination={pagination}
          />
        </>
      )}
    </>
  );
};
