import React from 'react';
import ReactDOM from 'react-dom/client';
import { inject } from '@vercel/analytics';
import App from './App.jsx';
import { initSentry } from './lib/sentry.js';
import './index.css';

// Before render, so errors during the first render are caught too.
initSentry();

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
