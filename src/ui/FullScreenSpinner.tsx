import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';
import React from 'react';

export const FullScreenSpinner: React.FC = () => (
  <Flex
    align="center"
    gap="middle"
    justify="center"
    style={{
      position: 'absolute',
      width: '100vw',
      height: '100vh',
      zIndex: 10,
      background: '#ffffff50',
      top: 0,
    }}>
    <Spin
      indicator={<LoadingOutlined style={{ fontSize: 50, margin: 0 }} spin />}
    />
  </Flex>
);
