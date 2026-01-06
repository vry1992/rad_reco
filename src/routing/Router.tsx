import { type MenuProps } from 'antd';
import {
  NavLink,
  createBrowserRouter,
  redirect,
  useNavigate,
  type MiddlewareFunction,
} from 'react-router';

import {
  ApartmentOutlined,
  CustomerServiceOutlined,
  DatabaseOutlined,
  WifiOutlined,
} from '@ant-design/icons';
import React, { useEffect } from 'react';
import { AddDetection } from '../features/AddDetection/page/AddDetection';
import { CombatFormation } from '../features/CombatFormation/page/CombatFormation';
import { CreateNetwork } from '../features/CreateNetwork/page/CreateNetwork';
import { DataStore } from '../features/DataStore/page/DataStore';
import { ShipType } from '../features/DataStore/page/ShipType';
import { ShipTypeCreate } from '../features/DataStore/page/ShipTypeCreate';
import { ShipTypeEdit } from '../features/DataStore/page/ShipTypeEdit';
import { TransmissionType } from '../features/DataStore/page/TransmissionType';
import { TransmissionTypeCreate } from '../features/DataStore/page/TransmissionTypeCreate';
import { TransmissionTypeEdit } from '../features/DataStore/page/TransmissionTypeEdit';
import { Detection } from '../features/Detection/page/Detection';
import { STORAGE_AUTH_TOKEN_KEY } from '../features/Login/constants';
import { Login } from '../features/Login/page/Login';
import {
  useLoginActionCreators,
  useLoginSelectors,
} from '../features/Login/store/slice';
import { StateStatus } from '../store/types';
import { Layout } from '../ui/Layout';

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
  {
    key: 'combat-formation',
    icon: React.createElement(ApartmentOutlined),
    label: <NavLink to="/combat-formation">БЧС</NavLink>,
  },
  {
    key: 'data-store',
    icon: React.createElement(DatabaseOutlined),
    label: <NavLink to="/data-store">Дані</NavLink>,
  },
];

const AuthLayout = () => {
  const { status } = useLoginSelectors();
  useAuth();

  if (status === StateStatus.LOADING) return 'Loading';
  return <Layout />;
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

const checkTokenPresent: MiddlewareFunction<unknown> = (_, next) => {
  const token = sessionStorage.getItem(STORAGE_AUTH_TOKEN_KEY);

  if (!token) {
    throw redirect('/login');
  } else {
    next();
  }
};

export const router = createBrowserRouter([
  {
    path: 'login',
    Component: Login,
  },
  {
    Component: AuthLayout,
    middleware: [checkTokenPresent],
    children: [
      {
        path: 'detection',
        children: [
          {
            index: true,
            Component: Detection,
          },
          {
            path: ':networkId',
            Component: AddDetection,
          },
        ],
      },
      {
        path: 'combat-formation',
        Component: CombatFormation,
      },
      {
        path: 'create-network',
        Component: CreateNetwork,
      },
      {
        path: 'data-store',
        children: [
          { index: true, Component: DataStore },
          {
            path: 'transmission-type',
            children: [
              {
                path: ':id',
                Component: TransmissionType,
              },
              {
                path: 'edit/:id',
                Component: TransmissionTypeEdit,
              },
              {
                path: 'create',
                Component: TransmissionTypeCreate,
              },
            ],
          },
          {
            path: 'ship-types',
            children: [
              {
                path: ':id',
                Component: ShipType,
              },
              {
                path: 'create',
                Component: ShipTypeCreate,
              },
              {
                path: 'edit/:id',
                Component: ShipTypeEdit,
              },
            ],
          },
        ],
      },
    ],
  },
]);
