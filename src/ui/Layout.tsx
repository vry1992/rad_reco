import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout as AntLayout, Button, Menu, theme } from 'antd';
import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { useLoadingSpinner } from '../hooks/useLoadingSpinner';
import { MAIN_MENU_CONFIG } from '../routing/Router';

const { Header, Content, Sider } = AntLayout;

const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};

export const Layout: React.FC = () => {
  console.log(2);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { Spinner, showSpinner } = useLoadingSpinner();

  return (
    <AntLayout hasSider>
      {showSpinner ? Spinner : null}
      <Sider
        trigger={null}
        style={siderStyle}
        collapsible
        collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['detection']}
          items={MAIN_MENU_CONFIG}
        />
      </Sider>
      <AntLayout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '12px 8px 0',
            overflow: 'initial',
            height: '100%',
          }}>
          <div
            style={{
              padding: 5,
              textAlign: 'center',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              height: '100%',
            }}>
            <Outlet />
          </div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};
