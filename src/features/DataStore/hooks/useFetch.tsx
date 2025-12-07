import type { TablePaginationConfig } from 'antd';
import type { PaginationData } from 'rc-pagination/lib/interface';
import { useEffect, useState } from 'react';
import type { IPagination } from '../../../types/types';

export function useFetch<T extends object>({
  action,
}: {
  action: (pagination: IPagination) => Promise<[T[], number]>;
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<
    Pick<PaginationData, 'current' | 'pageSize' | 'total'>
  >({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    setLoading(true);
    action({
      skip: 0,
      take: pagination.pageSize,
    })
      .then((response) => {
        const [payload, total] = response;
        setData(payload);
        setPagination((prev) => {
          return {
            ...prev,
            total,
          };
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    const curr = newPagination.current ? newPagination.current - 1 : 0;
    setLoading(true);
    action({
      skip: curr * pagination.pageSize,
      take: pagination.pageSize,
    })
      .then((response) => {
        const [payload, total] = response;
        setData(payload);
        setPagination({
          current: curr + 1 || pagination.current,
          pageSize: newPagination.pageSize || pagination.pageSize,
          total,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { loading, data, pagination, handleTableChange };
}
