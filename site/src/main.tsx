import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import CardSum from './games/CardSum';
import Craps from './games/Craps';
import FindMarket from './games/FindMarket';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter
      basename={
        import.meta.env.PROD ? '/Trading-Interview-Questions' : ''
      }
    >
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/cardsum" element={<CardSum />} />
        <Route path="/craps" element={<Craps />} />
        <Route path="/findmarket" element={<FindMarket />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
