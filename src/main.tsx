import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App.tsx';
import CubeScanner from './features/cube3D/CubeScanner.tsx';
import SolutionPlayback from './features/cube3D/SolutionPlayback.tsx';

import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/solution-playback" element={<SolutionPlayback />} />
        <Route path="/scan" element={<CubeScanner />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
