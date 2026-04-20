import React from 'react';
import ReactDOM from 'react-dom/client';
import { inject } from '@vercel/analytics';
import App from './App.jsx';
import './index.css';

// Framework-agnostic Vercel Analytics. The React component wrapper
// (`@vercel/analytics/react`) conflicts with some Vite setups via a
// duplicated React copy — inject() attaches the beacon script directly
// with no hooks required.
if (import.meta.env.PROD) {
  inject();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
