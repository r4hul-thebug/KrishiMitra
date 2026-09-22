import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import AuthScreen from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Suggestions from './pages/Suggestions';
import YieldCalculator from './pages/YieldCalculator';
import MandiPrices from './pages/MandiPrices';
import SatelliteView from './pages/SatelliteView';
import CropRotation from './pages/CropRotation';
import CropDoctor from './pages/CropDoctor';
import GovtSchemes from './pages/GovtSchemes';
import SoilHealthCard from './pages/SoilHealthCard';
import KisanHelpline from './pages/KisanHelpline';
import Sidebar from './components/Sidebar';
import GovtHeader from './components/GovtHeader';
import GovtFooter from './components/GovtFooter';
import FloatingChat from './components/FloatingChat';
import NotFound from './pages/NotFound';

function App() {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('krishimitraaz_token');
  });
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <LanguageProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
          <GovtHeader token={token} setToken={setToken} />

          <Routes>
            <Route 
              path="/login" 
              element={
                token ? <Navigate to="/dashboard" replace /> : (
                  <>
                    <AuthScreen setToken={setToken} />
                    <GovtFooter />
                  </>
                )
              } 
            />
            <Route 
              path="/" 
              element={
                token ? <Navigate to="/dashboard" replace /> : (
                  <>
                    <AuthScreen setToken={setToken} />
                    <GovtFooter />
                  </>
                )
              } 
            />
            <Route 
              path="/*"
              element={
                !token ? <Navigate to="/" replace /> : (
                  <div className="app-portal-layout" style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 54.5px)' }}>
                    <Sidebar 
                      setToken={setToken} 
                      isCollapsed={isCollapsed} 
                      setIsCollapsed={setIsCollapsed} 
                    />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <main 
                        className="portal-main-area"
                        style={{ 
                          flex: 1, 
                          padding: '1.5rem', 
                          background: '#F8FAFC'
                        }}
                      >
                        <Routes>
                          <Route path="dashboard" element={<Dashboard setToken={setToken} />} />
                          <Route path="mandi" element={<MandiPrices />} />
                          <Route path="satellite" element={<SatelliteView />} />
                          <Route path="rotation" element={<CropRotation />} />
                          <Route path="disease" element={<CropDoctor />} />
                          <Route path="calculator" element={<YieldCalculator />} />
                          <Route path="schemes" element={<GovtSchemes />} />
                          <Route path="suggestions" element={<Suggestions />} />
                          <Route path="soil" element={<SoilHealthCard />} />
                          <Route path="helpline" element={<KisanHelpline />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                      <GovtFooter />
                    </div>
                    <FloatingChat />
                  </div>
                )
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
