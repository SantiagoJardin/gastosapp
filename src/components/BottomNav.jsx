import { useContext } from 'react';
import { Home, PlusCircle, Tags, PieChart, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export const BottomNav = ({ activeTab, setActiveTab }) => {
  const { logout } = useContext(AuthContext);

  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Inicio' },
    { id: 'charts', icon: PieChart, label: 'Consumos' },
    { id: 'add', icon: PlusCircle, label: 'Agregar' },
    { id: 'categories', icon: Tags, label: 'Categorías' }
  ];

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '500px',
        background: 'rgba(13, 15, 20, 0.85)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--glass-border)',
        padding: '12px 24px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        zIndex: 50
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: isActive ? 'var(--accent-blue)' : 'var(--text-muted)'
            }}
          >
            <Icon 
              size={isActive ? 28 : 24} 
              strokeWidth={isActive ? 2.5 : 2}
              style={{ transition: 'all 0.3s ease' }}
            />
            <span style={{ fontSize: '0.75rem', fontWeight: isActive ? '600' : '400' }}>
              {tab.label}
            </span>
          </button>
        );
      })}
      
      <button 
        onClick={logout}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          color: 'var(--text-muted)'
        }}
      >
        <LogOut 
          size={24} 
          strokeWidth={2}
          style={{ transition: 'all 0.3s ease' }}
        />
        <span style={{ fontSize: '0.75rem', fontWeight: '400' }}>
          Salir
        </span>
      </button>

    </div>
  );
};
