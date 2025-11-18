import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { AppNotification, notificationManager } from '../utils/errorHandling';

interface NotificationItemProps {
  notification: AppNotification;
  onClose: (id: string) => void;
}

function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Анимация появления
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => onClose(notification.id), 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
      default:
        return <Info className="w-5 h-5 text-gray-400" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'from-green-500/90 to-emerald-600/90 border-green-400/50';
      case 'error':
        return 'from-red-500/90 to-red-600/90 border-red-400/50';
      case 'warning':
        return 'from-yellow-500/90 to-orange-600/90 border-yellow-400/50';
      case 'info':
        return 'from-blue-500/90 to-blue-600/90 border-blue-400/50';
      default:
        return 'from-gray-500/90 to-gray-600/90 border-gray-400/50';
    }
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        bg-gradient-to-r ${getBackgroundColor()}
        backdrop-blur-sm rounded-lg border p-4 shadow-2xl min-w-[300px] max-w-[400px]
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-sm mb-1">
            {notification.title}
          </h4>
          <p className="text-white/90 text-sm break-words">
            {notification.message}
          </p>
          
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="mt-2 text-xs font-medium text-white underline hover:no-underline transition-all"
            >
              {notification.action.label}
            </button>
          )}
        </div>

        <button
          onClick={handleClose}
          className="flex-shrink-0 text-white/70 hover:text-white transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Прогресс-бар для автоматически исчезающих уведомлений */}
      {notification.duration && (
        <div 
          className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-lg animate-progress"
          style={{
            animationDuration: `${notification.duration}ms`
          }}
        />
      )}
    </div>
  );
}

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    // Подписываемся на изменения уведомлений
    const unsubscribe = notificationManager.subscribe((newNotifications) => {
      setNotifications(newNotifications);
    });

    // Получаем текущие уведомления
    setNotifications(notificationManager.getNotifications());

    return unsubscribe;
  }, []);

  const handleClose = (id: string) => {
    notificationManager.removeNotification(id);
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <NotificationItem
            notification={notification}
            onClose={handleClose}
          />
        </div>
      ))}
    </div>
  );
}

// Хук для удобного использования уведомлений в компонентах
export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    const unsubscribe = notificationManager.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  return {
    notifications,
    success: (title: string, message: string, duration?: number) => 
      notificationManager.success(title, message, duration),
    error: (title: string, message: string, duration?: number) => 
      notificationManager.error(title, message, duration),
    warning: (title: string, message: string, duration?: number) => 
      notificationManager.warning(title, message, duration),
    info: (title: string, message: string, duration?: number) => 
      notificationManager.info(title, message, duration),
    remove: (id: string) => notificationManager.removeNotification(id),
    clearAll: () => notificationManager.clearAll()
  };
}

// Компонент для тестирования уведомлений (только в development)
export function NotificationTestPanel() {
  const { success, error, warning, info } = useNotifications();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 border border-slate-600">
      <h3 className="text-white font-semibold mb-3 text-sm">Test Notifications</h3>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => success('Успех!', 'Операция выполнена успешно')}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs transition-colors"
        >
          Success
        </button>
        <button
          onClick={() => error('Ошибка!', 'Что-то пошло не так')}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors"
        >
          Error
        </button>
        <button
          onClick={() => warning('Предупреждение!', 'Обратите внимание на это')}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs transition-colors"
        >
          Warning
        </button>
        <button
          onClick={() => info('Информация', 'Полезная информация для вас')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors"
        >
          Info
        </button>
      </div>
    </div>
  );
}
