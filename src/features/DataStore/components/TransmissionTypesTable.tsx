import { Button, Collapse, Skeleton, Table, type TableColumnsType } from 'antd';
import { type FC } from 'react';
import type { IPagination, ITransmitionTypes } from '../../../types/types';
import { useFetch } from '../hooks/useFetch';
import { TransmissionTypeForm } from './TransmissionTypeForm';

interface DataType extends ITransmitionTypes {}

const columns: TableColumnsType<DataType> = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  // {
  //   title: 'Скорочена назва',
  //   dataIndex: 'abbreviatedType',
  //   key: 'abbreviatedType',
  // },
  {
    title: 'Action',
    dataIndex: '',
    key: 'x',
    render: () => <Button>Редагувати</Button>,
  },
];

type Props = {
  action: (pagination: IPagination) => Promise<[ITransmitionTypes[], number]>;
};

export const TransmissionTypesTable: FC<Props> = ({ action }) => {
  const { loading, data, pagination, handleTableChange } = useFetch({ action });

  return (
    <>
      {loading ? (
        <Skeleton />
      ) : (
        <>
          <Collapse
            items={[
              {
                key: 'form',
                label: 'Додати новий вид передачі',
                children: <TransmissionTypeForm />,
              },
              {
                key: 'table',
                label: 'Перелік збережених видів передач:',
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
            defaultActiveKey={['table']}
          />
        </>
      )}
    </>
  );
};
