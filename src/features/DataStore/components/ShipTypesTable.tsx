import { Button, Collapse, Skeleton, Table, type TableColumnsType } from 'antd';
import { type FC } from 'react';
import type { IPagination, IShipType } from '../../../types/types';
import { useFetch } from '../hooks/useFetch';
import { TransmissionTypeForm } from './TransmissionTypeForm';

interface DataType extends IShipType {}

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
    key: 'x',
    render: () => <Button>Редагувати</Button>,
  },
];

type Props = {
  action: (pagination: IPagination) => Promise<[IShipType[], number]>;
};

export const ShipTypesTable: FC<Props> = ({ action }) => {
  const { loading, data, pagination, handleTableChange } = useFetch({ action });

  return (
    <>
      {loading ? (
        <Skeleton />
      ) : (
        <Collapse
          defaultActiveKey={'table'}
          items={[
            {
              key: 'form',
              label: 'Додати новий тип корабля',
              children: <TransmissionTypeForm />,
            },
            {
              key: 'table',
              label: 'Перелік збережених типів кораблів:',
              children: (
                <Table<DataType>
                  onChange={handleTableChange}
                  columns={columns}
                  dataSource={data}
                  pagination={pagination}
                />
              ),
            },
          ]}
        />
      )}
    </>
  );
};
