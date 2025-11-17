import { useState } from 'react';
import { Sparkles, Settings, History, Menu, X } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onAdminClick?: () => void;
  onHistoryClick?: () => void;
}

export default function Header({ activeSection, onSectionChange, onAdminClick, onHistoryClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sections = ['escort', 'casino', 'products'];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 shadow-2xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          <div className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer" onClick={() => { onSectionChange('escort'); setMobileMenuOpen(false); }}>
            <div className="relative">
              <Sparkles className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-amber-400 group-hover:text-amber-300 transition-all duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-amber-400 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 group-hover:from-amber-300 group-hover:via-amber-200 group-hover:to-amber-300 transition-all duration-300">
                EMPTY GAZ
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400 tracking-wider hidden sm:block">PREMIUM SERVICES</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2 items-center">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => onSectionChange(section)}
                className={`px-6 py-2.5 rounded-lg font-medium text-sm tracking-wide uppercase transition-all duration-300 ${
                  activeSection === section
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/50 scale-105'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/70 hover:text-white hover:shadow-lg'
                }`}
              >
                {section === 'escort' && 'Эскорт'}
                {section === 'casino' && 'Казино'}
                {section === 'products' && 'Магазин'}
              </button>
            ))}
            {onHistoryClick && (
              <button
                onClick={onHistoryClick}
                className="p-2.5 rounded-lg bg-slate-800/50 text-slate-300 hover:bg-blue-500 hover:text-white transition-all duration-300 hover:shadow-lg"
                title="История заказов"
              >
                <History className="w-5 h-5" />
              </button>
            )}
            {onAdminClick && (
              <button
                onClick={onAdminClick}
                className="p-2.5 rounded-lg bg-slate-800/50 text-slate-300 hover:bg-amber-500 hover:text-white transition-all duration-300 hover:shadow-lg"
                title="Админ-панель"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-lg bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white transition-all active:scale-95"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-700 animate-slide-down">
            <div className="flex flex-col space-y-2.5">
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => { onSectionChange(section); setMobileMenuOpen(false); }}
                  className={`px-4 py-4 rounded-xl font-semibold text-base tracking-wide uppercase transition-all duration-300 text-left active:scale-98 ${
                    activeSection === section
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30'
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/70 hover:text-white'
                  }`}
                >
                  {section === 'escort' && '👥 Эскорт'}
                  {section === 'casino' && '🎰 Казино'}
                  {section === 'products' && '🛍️ Магазин'}
                </button>
              ))}
              <div className="flex space-x-2.5 pt-2">
                {onHistoryClick && (
                  <button
                    onClick={() => { onHistoryClick(); setMobileMenuOpen(false); }}
                    className="flex-1 px-4 py-4 rounded-xl bg-slate-800/50 text-slate-300 hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 active:scale-98 font-medium"
                  >
                    <History className="w-5 h-5" />
                    <span className="text-base">История</span>
                  </button>
                )}
                {onAdminClick && (
                  <button
                    onClick={() => { onAdminClick(); setMobileMenuOpen(false); }}
                    className="flex-1 px-4 py-4 rounded-xl bg-slate-800/50 text-slate-300 hover:bg-amber-500 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 active:scale-98 font-medium"
                  >
                    <Settings className="w-5 h-5" />
                    <span className="text-base">Админ</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
