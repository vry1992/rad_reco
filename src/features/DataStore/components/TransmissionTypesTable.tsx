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
import type { IPagination, ITransmitionTypes } from '../../../types/types';
import { useFetch } from '../hooks/useFetch';

interface DataType extends ITransmitionTypes {}

type Props = {
  action: (pagination: IPagination) => Promise<[ITransmitionTypes[], number]>;
};

export const TransmissionTypesTable: FC<Props> = ({ action }) => {
  const navigate = useNavigate();
  const { loading, data, pagination, handleTableChange } = useFetch({ action });
  const columns: TableColumnsType<DataType> = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Протокол',
      dataIndex: 'protocol',
      key: 'protocol',
    },
    {
      title: 'Дія',
      dataIndex: '',
      key: 'edit',
      fixed: 'left',
      width: 100,
      render: (_, record: DataType) => (
        <Button onClick={() => navigate(`transmission-type/${record.id}`)}>
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
              Перелік збережених видів передач:
            </Typography.Title>
            <Button
              onClick={() => navigate('transmission-type/create')}
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
