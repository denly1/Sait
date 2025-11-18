import { useState, useEffect } from 'react';
import Header from './components/Header';
import { logPageView, logLogin } from './utils/analytics';
import EscortSection from './components/EscortSection';
import CasinoSectionNew from './components/CasinoSectionNew';
import ProductsSection from './components/ProductsSection';
import AdminPanelEnhanced from './components/AdminPanelEnhanced';
import UserHistory from './components/UserHistory';
import LoginModal from './components/LoginModal';
import WheelOfFortune from './components/WheelOfFortune';
import SupportChat from './components/SupportChat';
import ReviewsSection from './components/ReviewsSection';
import LoyaltyProgram from './components/LoyaltyProgram';
import NotificationSystem, { NotificationTestPanel } from './components/NotificationSystem';
import { showSuccess } from './utils/errorHandling';

function App() {
  const [activeSection, setActiveSection] = useState('escort');
  const [showAdmin, setShowAdmin] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [showWheel, setShowWheel] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showLoyalty, setShowLoyalty] = useState(false);
  const [user, setUser] = useState<{ username: string; role: 'admin' | 'user' } | null>(null);

  useEffect(() => {
    console.log('App mounted successfully');
    console.log('Active section:', activeSection);
    console.log('User:', user);
    
    // Логируем просмотр страницы
    logPageView(activeSection);
  }, [activeSection, user]);

  const handleLogin = (username: string, role: 'admin' | 'user') => {
    setUser({ username, role });
    setShowLogin(false);
    
    // Логируем вход пользователя
    logLogin(username, role);
    
    // Показываем уведомление об успешном входе
    showSuccess(`Добро пожаловать, ${username}!`, 'Вход выполнен');
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
        onWheelClick={() => setShowWheel(true)}
      />

      <main className="pt-14 sm:pt-16 lg:pt-20">
        {activeSection === 'escort' && <EscortSection />}
        {activeSection === 'casino' && <CasinoSectionNew />}
        {activeSection === 'products' && <ProductsSection />}
      </main>

      {/* Модальные окна */}
      {showAdmin && <AdminPanelEnhanced onClose={() => setShowAdmin(false)} />}
      {showHistory && <UserHistory onClose={() => setShowHistory(false)} />}
      {showWheel && <WheelOfFortune onClose={() => setShowWheel(false)} />}
      {showChat && <SupportChat onClose={() => setShowChat(false)} />}
      {showReviews && <ReviewsSection onClose={() => setShowReviews(false)} />}
      {showLoyalty && <LoyaltyProgram onClose={() => setShowLoyalty(false)} />}
      {showLogin && <LoginModal onLogin={handleLogin} onClose={() => setShowLogin(false)} />}

      {/* Плавающие кнопки */}
      <div className="fixed bottom-20 sm:bottom-24 right-3 sm:right-4 z-40 flex flex-col gap-3">
        <button
          onClick={() => setShowChat(true)}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all animate-bounce"
          title="Чат поддержки"
        >
          💬
        </button>
        <button
          onClick={() => setShowReviews(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all"
          title="Отзывы"
        >
          ⭐
        </button>
        <button
          onClick={() => setShowLoyalty(true)}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all"
          title="Программа лояльности"
        >
          🎁
        </button>
      </div>

      <div className="fixed bottom-3 sm:bottom-4 right-3 sm:right-4 left-3 sm:left-auto bg-slate-800/95 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 border border-amber-500/30 shadow-2xl max-w-sm sm:max-w-none mx-auto sm:mx-0 z-40">
        <div className="text-white text-xs sm:text-sm flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
          <span className="text-amber-400 font-bold text-sm sm:text-base">{user.username}</span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className={`text-xs sm:text-sm font-medium ${user.role === 'admin' ? 'text-green-400' : 'text-blue-400'}`}>
            {user.role === 'admin' ? '👑 Админ' : '👤 Пользователь'}
          </span>
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 transition-colors font-semibold text-xs sm:text-sm px-2 py-1 rounded active:scale-95"
          >
            Выйти
          </button>
        </div>
      </div>

      {/* Система уведомлений v2.0 - поверх всех элементов */}
      <NotificationSystem />
      
      {/* Панель тестирования уведомлений (только в development) */}
      <NotificationTestPanel />
    </div>
  );
}

export default App;
