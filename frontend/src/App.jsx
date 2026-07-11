import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import AuthScreen from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Suggestions from './pages/Suggestions';
import YieldCalculator from './pages/YieldCalculator';
import Sidebar from './components/Sidebar';
import FloatingChat from './components/FloatingChat';

import NotFound from './pages/NotFound';

function App() {
  const [token, setToken] = useState(localStorage.getItem('krishimitraaz_token'));

  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              token ? <Navigate to="/dashboard" replace /> : <AuthScreen setToken={setToken} />
            } 
          />
          <Route 
            path="/*"
            element={
              token ? (
                <div className="app-container">
                  <Sidebar setToken={setToken} />
                  <div className="main-content">
                    <Routes>
                      <Route path="dashboard" element={<Dashboard setToken={setToken} />} />
                      <Route path="suggestions" element={<Suggestions />} />
                      <Route path="calculator" element={<YieldCalculator />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                  <FloatingChat />
                </div>
              ) : <Navigate to="/" replace />
            }
          />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
