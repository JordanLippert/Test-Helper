import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Settings from './pages/Settings';
import Popup from './pages/Popup';

const App: React.FC = () => {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/settings" element={<Settings />} />
        <Route path="/popup" element={<Popup />} />
      </Routes>
    </MemoryRouter>
  );
};

export default App;