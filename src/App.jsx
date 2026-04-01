import React, { useState, useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { Dashboard } from './views/Dashboard';
import { AddExpense } from './views/AddExpense';
import { ManageCategories } from './views/ManageCategories';
import { ChartsView } from './views/ChartsView';
import { LoginView } from './views/LoginView';
import { BottomNav } from './components/BottomNav';
import { LogOut } from 'lucide-react';

const MainApp = () => {
  const { isAuthenticated, isLoading, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="text-muted">Cargando de forma segura...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <ExpenseProvider>
      <main style={{ minHeight: '100vh', width: '100%', position: 'relative' }}>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'add' && <AddExpense setActiveTab={setActiveTab} />}
        {activeTab === 'charts' && <ChartsView />}
        {activeTab === 'categories' && <ManageCategories />}
        
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
    </ExpenseProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
