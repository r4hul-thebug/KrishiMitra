import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Sidebar from './components/Sidebar';
import GovtHeader from './components/GovtHeader';
import GovtFooter from './components/GovtFooter';
import PageSkeleton from './components/PageSkeleton';
import ErrorBoundary from './components/ErrorBoundary';
import MonitoringDrawer from './components/MonitoringDrawer';
import { ProtectedRoute, MissingRouteFallback } from './components/RouteController';

// Route-level code-splitting for optimal Lighthouse FCP/LCP performance
const AuthScreen = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Suggestions = lazy(() => import('./pages/Suggestions'));
const YieldCalculator = lazy(() => import('./pages/YieldCalculator'));
const MandiPrices = lazy(() => import('./pages/MandiPrices'));
const SatelliteView = lazy(() => import('./pages/SatelliteView'));
const CropRotation = lazy(() => import('./pages/CropRotation'));
const CropDoctor = lazy(() => import('./pages/CropDoctor'));
const GovtSchemes = lazy(() => import('./pages/GovtSchemes'));
const SoilHealthCard = lazy(() => import('./pages/SoilHealthCard'));
const KisanHelpline = lazy(() => import('./pages/KisanHelpline'));
const FloatingChat = lazy(() => import('./components/FloatingChat'));

function PortalLayout({ token, setToken, isCollapsed, setIsCollapsed }) {
  return (
    <div className="app-portal-layout" style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 54.5px)' }}>
      <Sidebar 
        token={token}
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
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
        <GovtFooter />
      </div>
      <Suspense fallback={null}>
        <FloatingChat />
      </Suspense>
    </div>
  );
}

function App() {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('krishimitraaz_token');
  });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMonitoringOpen, setIsMonitoringOpen] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('krishimitraaz_token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Shortcut Ctrl+Shift+L to toggle Real-time Telemetry Monitor
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'L' || e.key === 'l')) {
        e.preventDefault();
        setIsMonitoringOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <LanguageProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
            <GovtHeader token={token} setToken={setToken} onOpenMonitoring={() => setIsMonitoringOpen(true)} />

            <Routes>
              {/* Public Authentication Screen */}
              <Route 
                path="/login" 
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <AuthScreen token={token} setToken={setToken} />
                    <GovtFooter />
                  </Suspense>
                } 
              />

              {/* Root index route: sends unauthorized users to /login and authorized users to /dashboard */}
              <Route 
                path="/" 
                element={<MissingRouteFallback token={token} />} 
              />
              
              {/* Protected Portal Routes - All unauthorized attempts are redirected back to sign-in */}
              <Route 
                element={
                  <ProtectedRoute token={token}>
                    <PortalLayout 
                      token={token} 
                      setToken={setToken} 
                      isCollapsed={isCollapsed} 
                      setIsCollapsed={setIsCollapsed} 
                    />
                  </ProtectedRoute>
                } 
              >
                <Route path="/dashboard" element={<Dashboard token={token} setToken={setToken} />} />
                <Route path="/mandi" element={<MandiPrices />} />
                <Route path="/satellite" element={<SatelliteView />} />
                <Route path="/rotation" element={<CropRotation />} />
                <Route path="/disease" element={<CropDoctor />} />
                <Route path="/calculator" element={<YieldCalculator />} />
                <Route path="/schemes" element={<GovtSchemes />} />
                <Route path="/suggestions" element={<Suggestions />} />
                <Route path="/soil" element={<SoilHealthCard />} />
                <Route path="/helpline" element={<KisanHelpline />} />
              </Route>

              {/* Unified Route Controller fallback: redirects invalid URLs to sign-in without recursion */}
              <Route path="*" element={<MissingRouteFallback token={token} />} />
            </Routes>

            {/* Real-Time Telemetry & Monitoring Drawer */}
            <MonitoringDrawer 
              isOpen={isMonitoringOpen} 
              onClose={() => setIsMonitoringOpen(false)} 
            />
          </div>
        </ErrorBoundary>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
