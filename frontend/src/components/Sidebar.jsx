import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Lightbulb, Calculator, User } from 'lucide-react';
import axios from 'axios';
import '../index.css';
import { API_URL } from '../config';
import ProfileModal from './ProfileModal';
import { useLanguage } from '../contexts/LanguageContext';

export default function Sidebar({ setToken }) {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [farmerData, setFarmerData] = useState({ name: 'Farmer', locationStr: 'Detecting location...' });
  
  const farmerId = localStorage.getItem('krishimitraaz_farmer_id');

  useEffect(() => {
    if (!farmerId) return;

    const fetchFarmer = () => {
      axios.get(`${API_URL}/farmers/${farmerId}`)
        .then(res => {
          const f = res.data;
          let loc = '';
          if (f.village && f.state) loc = `${f.village}, ${f.state}`;
          else if (f.location) loc = `Lat: ${f.location.lat.toFixed(2)}, Lon: ${f.location.lon.toFixed(2)}`;
          setFarmerData(prev => ({ ...f, ...prev, name: f.name, locationStr: loc || 'Unknown Location' }));
        })
        .catch(err => console.error('Failed to load farmer info', err));
    };

    const updateLocationOnServer = async (lat, lon) => {
      try {
        await axios.patch(`${API_URL}/farmers/${farmerId}`, {
          location: { lat, lon }
        });
        
        try {
          const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          if (res.data && res.data.display_name) {
            const address = res.data.address;
            const components = [
              address.road,
              address.village || address.neighbourhood || address.suburb,
              address.city || address.town || address.county || address.state_district,
              address.state
            ].filter(Boolean);
            
            // Limit to max 3 components so it fits nicely, preferring the most specific ones
            const preciseLocation = components.slice(0, 3).join(', ');
            
            setFarmerData(prev => ({ ...prev, locationStr: preciseLocation || 'Local Area' }));
          } else {
            setFarmerData(prev => ({ ...prev, locationStr: `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}` }));
          }
        } catch {
          setFarmerData(prev => ({ ...prev, locationStr: `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}` }));
        }
      } catch {
        setFarmerData(prev => ({ ...prev, locationStr: 'Location update failed' }));
      }
    };

    // Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetchFarmer(); // Fetch farmer name first
          updateLocationOnServer(lat, lon); // Then update location and get nominatim
        },
        (err) => {
          console.warn('Geolocation blocked or failed:', err.message);
          fetchFarmer();
        }
      );
    } else {
      fetchFarmer();
    }
  }, [farmerId]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('krishimitraaz_token');
    localStorage.removeItem('krishimitraaz_farmer_id');
    if (setToken) setToken(null);
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <>
    <div className="sidebar">
      <div 
        className="sidebar-header" 
        style={{ cursor: 'pointer', transition: 'background 0.2s ease' }}
        onClick={() => setIsProfileOpen(true)}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <div className="profile-icon-wrapper">
          <User size={28} className="profile-icon" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="sidebar-text title">KrishiMitraaz</span>
          <span className="sidebar-text" style={{ fontSize: '0.9rem', color: 'var(--sidebar-text)', fontWeight: 'bold' }}>
            {farmerData.name}
          </span>
          {farmerData.locationStr && (
            <span className="sidebar-text" style={{ fontSize: '0.75rem', color: 'var(--sidebar-text-muted)', fontWeight: 'normal' }}>
              {farmerData.locationStr}
            </span>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link to="/dashboard" className={`sidebar-item ${isActive('/dashboard') ? 'active' : ''}`}>
          <Home size={24} className="sidebar-icon" />
          <span className="sidebar-text">{t('menuDashboard')}</span>
        </Link>
        
        <Link to="/suggestions" className={`sidebar-item ${isActive('/suggestions') ? 'active' : ''}`}>
          <Lightbulb size={24} className="sidebar-icon" />
          <span className="sidebar-text">{t('menuSuggestions')}</span>
        </Link>
        
        <Link to="/calculator" className={`sidebar-item ${isActive('/calculator') ? 'active' : ''}`}>
          <Calculator size={24} className="sidebar-icon" />
          <span className="sidebar-text">{t('menuCalculator')}</span>
        </Link>
      </nav>
    </div>
    
    <ProfileModal 
      isOpen={isProfileOpen} 
      onClose={() => setIsProfileOpen(false)} 
      farmerData={farmerData} 
      onLogout={handleLogout} 
    />
    </>
  );
}
