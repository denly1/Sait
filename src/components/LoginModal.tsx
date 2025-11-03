import { useState } from 'react';
import { X, Lock, User, Eye, EyeOff } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (username: string, role: 'admin' | 'user') => void;
}

export default function LoginModal({ onClose, onLogin }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Простая проверка (в реальном приложении это должно быть на сервере)
    if (username === 'admin' && password === 'admin123') {
      onLogin(username, 'admin');
      onClose();
    } else if (username && password.length >= 4) {
      onLogin(username, 'user');
      onClose();
    } else {
      setError('Неверный логин или пароль (мин. 4 символа)');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-md w-full p-8 border border-amber-500/30 animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-amber-400">
              {isRegistering ? 'Регистрация' : 'Вход'}
            </h2>
            <p className="text-slate-400 text-sm">
              {isRegistering ? 'Создайте новый аккаунт' : 'Войдите в систему'}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 mb-2 text-sm font-semibold">
              Логин
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-10 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="Введите логин"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-2 text-sm font-semibold">
              Пароль
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-10 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="Введите пароль"
                required
                minLength={4}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3 text-blue-300 text-sm">
            <strong>Тестовые данные:</strong><br />
            Админ: admin / admin123<br />
            Пользователь: любой логин / мин. 4 символа
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-bold text-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-amber-500/50"
          >
            {isRegistering ? 'Зарегистрироваться' : 'Войти'}
          </button>

          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="w-full text-slate-400 hover:text-amber-400 text-sm transition-colors"
          >
            {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
          </button>
        </form>
      </div>
    </div>
  );
}
