import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Settings from './pages/Settings';
import Popup from './pages/Popup';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/settings" element={<Settings />} />
        <Route path="/popup" element={<Popup />} />
        <Route path="/" element={<Settings />} />
      </Routes>
    </HashRouter>
  );
};

export default App;

