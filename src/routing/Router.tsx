import type { MenuProps } from 'antd';
import { NavLink, Outlet, Route, Routes, useNavigate } from 'react-router';
import { Layout } from '../ui/Layout';

import { CustomerServiceOutlined, WifiOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import { AddDetection } from '../features/AddDetection/page/AddDetection';
import { CreateNetwork } from '../features/CreateNetwork/page/CreateNetwork';
import { Detection } from '../features/Detection/page/Detection';
import { Login } from '../features/Login/page/Login';
import {
  useLoginActionCreators,
  useLoginSelectors,
} from '../features/Login/store/slice';
import { StateStatus } from '../store/types';

export const MAIN_MENU_CONFIG: MenuProps['items'] = [
  {
    key: 'detection',
    icon: React.createElement(CustomerServiceOutlined),
    label: <NavLink to="/detection">Виявлення</NavLink>,
  },
  {
    key: 'create-network',
    icon: React.createElement(WifiOutlined),
    label: <NavLink to="/create-network">Створення мережі</NavLink>,
  },
];

const AuthLayout = () => {
  const { status } = useLoginSelectors();
  useAuth();

  if (status === StateStatus.LOADING) return 'Loading';
  return <Outlet />;
};

export const useAuth = () => {
  const { status } = useLoginSelectors();
  const loginActions = useLoginActionCreators();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === StateStatus.INIT) {
      loginActions.me();
    }
  }, [status]);

  useEffect(() => {
    if (status === StateStatus.ERROR) {
      navigate('/login');
    }
  }, [status]);
};

const RedirectProvider = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login');
  }, []);

  return <></>;
};

export const Router = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected */}
      <Route element={<AuthLayout />}>
        <Route element={<Layout />}>
          <Route path="/detection" element={<Detection />} />
          <Route path="/detection/:id" element={<AddDetection />} />
          <Route path="/create-network" element={<CreateNetwork />} />
        </Route>
      </Route>

      {/* Redirect */}
      <Route path="*" element={<RedirectProvider />} />
    </Routes>
  );
};
