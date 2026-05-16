import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from './contexts/ConfigContext';
import ThemeCustomization from './theme';
import App from './App';
import './index.css';
import './assets/scss/style.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider>
      <ThemeCustomization>
        <App />
      </ThemeCustomization>
    </ConfigProvider>
  </StrictMode>
);
