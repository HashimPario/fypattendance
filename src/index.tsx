import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthUserProvider } from 'Context/authContext';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <BrowserRouter>
    <AuthUserProvider>
      <App />
    </AuthUserProvider>
  </BrowserRouter>,
);
