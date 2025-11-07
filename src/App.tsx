import { useState, useEffect } from 'react';
import Header from './components/Header';
import EscortSection from './components/EscortSection';
import CasinoSectionSimple from './components/CasinoSectionSimple';
import ProductsSection from './components/ProductsSection';
import AdminPanelEnhanced from './components/AdminPanelEnhanced';
import UserHistory from './components/UserHistory';
import LoginModal from './components/LoginModal';

function App() {
  const [activeSection, setActiveSection] = useState('escort');
  const [showAdmin, setShowAdmin] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState<{ username: string; role: 'admin' | 'user' } | null>(null);

  useEffect(() => {
    console.log('App mounted successfully');
    console.log('Active section:', activeSection);
    console.log('User:', user);
  }, [activeSection, user]);

  const handleLogin = (username: string, role: 'admin' | 'user') => {
    setUser({ username, role });
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUser(null);
    setShowLogin(true);
    setShowAdmin(false);
    setShowHistory(false);
  };

  const handleAdminClick = () => {
    if (user?.role === 'admin') {
      setShowAdmin(true);
    } else {
      alert('Доступ запрещен! Только для администраторов.');
    }
  };

  if (!user) {
    return showLogin ? <LoginModal onClose={() => {}} onLogin={handleLogin} /> : null;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        onAdminClick={handleAdminClick}
        onHistoryClick={() => setShowHistory(true)}
      />

      <main className="pt-20">
        {activeSection === 'escort' && <EscortSection />}
        {activeSection === 'casino' && <CasinoSectionSimple />}
        {activeSection === 'products' && <ProductsSection />}
      </main>

      {showAdmin && <AdminPanelEnhanced onClose={() => setShowAdmin(false)} />}
      {showHistory && <UserHistory onClose={() => setShowHistory(false)} />}

      <div className="fixed bottom-4 right-4 left-4 sm:left-auto bg-slate-800 rounded-lg px-3 sm:px-4 py-2 border border-amber-500/30 shadow-lg max-w-sm sm:max-w-none mx-auto sm:mx-0">
        <div className="text-white text-xs sm:text-sm flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <span className="text-amber-400 font-bold">{user.username}</span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className={user.role === 'admin' ? 'text-green-400' : 'text-blue-400'}>
            {user.role === 'admin' ? '👑 Админ' : '👤 Пользователь'}
          </span>
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 transition-colors font-medium"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
