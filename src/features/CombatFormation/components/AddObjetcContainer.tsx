import { Button, Drawer, Space, Tabs } from 'antd';
import type { FC } from 'react';

type Props = {
  onClose: () => void;
  open: boolean;
};

export const AddObjetcContainer: FC<Props> = ({ onClose, open }) => {
  return (
    <Drawer
      title="Створити обʼєкт"
      onClose={onClose}
      open={open}
      size="large"
      styles={{
        body: {
          paddingBottom: 80,
        },
      }}
      extra={
        <Space>
          <Button onClick={onClose}>Назад</Button>
        </Space>
      }>
      <Tabs
        defaultActiveKey="1"
        tabPosition="top"
        items={Array.from({ length: 3 }, (_, i) => {
          const id = String(i);
          return {
            label: `Tab-${id}`,
            key: id,
            disabled: i === 28,
            children: `Content of tab ${id}`,
          };
        })}
      />
    </Drawer>
  );
};
