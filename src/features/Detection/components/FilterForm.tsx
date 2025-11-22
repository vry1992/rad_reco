import { FilterOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';
import type { ChangeEvent } from 'react';
import { useSearchParams } from 'react-router';
import { FILTER_SEARCH_KEY } from '../constants';

export const FilterForm = () => {
  const [, setSearchParams] = useSearchParams();
  return (
    <Form
      name="layout-multiple-horizontal"
      layout="vertical"
      style={{
        width: '100%',
      }}>
      <Form.Item label="Назва мережі, частота, абоненти" name="filter">
        <Input
          prefix={<FilterOutlined />}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchParams({ [FILTER_SEARCH_KEY]: e.target.value })
          }
        />
      </Form.Item>
    </Form>
  );
};
