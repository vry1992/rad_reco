import type { MenuProps } from 'antd';
import { NavLink, Route, Routes } from 'react-router';
import { Layout } from '../ui/Layout';

import { CustomerServiceOutlined } from '@ant-design/icons';
import React from 'react';
import { AddDetection } from '../features/AddDetection/page/AddDetection';
import { Detection } from '../features/Detection/page';

export const MAIN_MENU_CONFIG: MenuProps['items'] = [
  {
    key: 'detection',
    icon: React.createElement(CustomerServiceOutlined),
    label: <NavLink to="/detection">Виявлення</NavLink>,
  },
];

export const Router = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/detection" element={<Detection />} />
        <Route path="/detection/:id" element={<AddDetection />} />
      </Route>
    </Routes>
  );
};
