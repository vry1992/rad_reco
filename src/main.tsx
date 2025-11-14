import 'antd/dist/reset.css'; // для antd v5+
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import './index.scss';
import { Router } from './routing/Router.tsx';
import { store } from './store/store.ts';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider store={store}>
      <Router />
    </Provider>
  </BrowserRouter>
);
