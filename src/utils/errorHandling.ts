// Система обработки ошибок и уведомлений v2.0

export type ErrorType = 'validation' | 'network' | 'auth' | 'permission' | 'server' | 'unknown';

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: any;
  timestamp: string;
  userFriendly: boolean;
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // в миллисекундах, undefined = не скрывать автоматически
  action?: {
    label: string;
    onClick: () => void;
  };
  timestamp: string;
}

// Класс для управления ошибками
class ErrorManager {
  private errorLog: AppError[] = [];
  private maxLogSize = 100;

  // Создание ошибки
  createError(
    type: ErrorType,
    message: string,
    userFriendly = true,
    code?: string,
    details?: any
  ): AppError {
    const error: AppError = {
      type,
      message,
      code,
      details,
      timestamp: new Date().toISOString(),
      userFriendly
    };

    // Добавляем в лог
    this.logError(error);
    
    return error;
  }

  // Логирование ошибки
  private logError(error: AppError): void {
    this.errorLog.push(error);
    
    // Ограничиваем размер лога
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }

    // Отправляем в консоль для разработки
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorManager]', error);
    }

    // Здесь можно добавить отправку в внешний сервис логирования
    // например, Sentry или собственную аналитику
  }

  // Получение лога ошибок
  getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  // Очистка лога ошибок
  clearErrorLog(): void {
    this.errorLog = [];
  }

  // Обработка различных типов ошибок
  handleValidationError(fields: Record<string, string>): AppError {
    const fieldNames = Object.keys(fields);
    const message = `Ошибка валидации в полях: ${fieldNames.join(', ')}`;
    
    return this.createError('validation', message, true, 'VALIDATION_ERROR', fields);
  }

  handleNetworkError(originalError?: any): AppError {
    let message = 'Ошибка сети. Проверьте подключение к интернету.';
    
    if (originalError?.code === 'NETWORK_ERROR') {
      message = 'Нет подключения к интернету.';
    } else if (originalError?.status === 404) {
      message = 'Запрашиваемая страница не найдена.';
    } else if (originalError?.status >= 500) {
      message = 'Ошибка сервера. Попробуйте позже.';
    }

    return this.createError('network', message, true, 'NETWORK_ERROR', originalError);
  }

  handleAuthError(code?: string): AppError {
    let message = 'Ошибка авторизации.';
    
    switch (code) {
      case 'INVALID_CREDENTIALS':
        message = 'Неверный логин или пароль.';
        break;
      case 'SESSION_EXPIRED':
        message = 'Сессия истекла. Войдите в систему заново.';
        break;
      case 'ACCESS_DENIED':
        message = 'Доступ запрещен.';
        break;
    }

    return this.createError('auth', message, true, code);
  }

  handleServerError(statusCode: number, originalMessage?: string): AppError {
    let message = 'Внутренняя ошибка сервера.';
    
    switch (statusCode) {
      case 400:
        message = 'Неверный запрос.';
        break;
      case 403:
        message = 'Доступ запрещен.';
        break;
      case 404:
        message = 'Ресурс не найден.';
        break;
      case 409:
        message = 'Конфликт данных.';
        break;
      case 429:
        message = 'Слишком много запросов. Попробуйте позже.';
        break;
      case 500:
        message = 'Внутренняя ошибка сервера.';
        break;
      case 502:
        message = 'Сервис временно недоступен.';
        break;
      case 503:
        message = 'Сервис находится на техническом обслуживании.';
        break;
    }

    return this.createError('server', message, true, `HTTP_${statusCode}`, originalMessage);
  }
}

// Класс для управления уведомлениями
class NotificationManager {
  private notifications: AppNotification[] = [];
  private listeners: Array<(notifications: AppNotification[]) => void> = [];

  // Добавление уведомления
  addNotification(
    type: NotificationType,
    title: string,
    message: string,
    duration?: number,
    action?: AppNotification['action']
  ): string {
    const notification: AppNotification = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      title,
      message,
      duration,
      action,
      timestamp: new Date().toISOString()
    };

    this.notifications.push(notification);
    this.notifyListeners();

    // Автоматическое удаление уведомления через заданное время
    if (duration) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, duration);
    }

    return notification.id;
  }

  // Удаление уведомления
  removeNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  // Получение всех уведомлений
  getNotifications(): AppNotification[] {
    return [...this.notifications];
  }

  // Очистка всех уведомлений
  clearAll(): void {
    this.notifications = [];
    this.notifyListeners();
  }

  // Подписка на изменения уведомлений
  subscribe(callback: (notifications: AppNotification[]) => void): () => void {
    this.listeners.push(callback);
    
    // Возвращаем функцию для отписки
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  // Быстрые методы для различных типов уведомлений
  success(title: string, message: string, duration = 3000): string {
    return this.addNotification('success', title, message, duration);
  }

  error(title: string, message: string, duration?: number): string {
    return this.addNotification('error', title, message, duration);
  }

  warning(title: string, message: string, duration = 5000): string {
    return this.addNotification('warning', title, message, duration);
  }

  info(title: string, message: string, duration = 4000): string {
    return this.addNotification('info', title, message, duration);
  }
}

// Глобальные экземпляры
export const errorManager = new ErrorManager();
export const notificationManager = new NotificationManager();

// Утилиты для удобной работы с ошибками и уведомлениями
export const showError = (message: string, title = 'Ошибка') => {
  notificationManager.error(title, message);
};

export const showSuccess = (message: string, title = 'Успешно') => {
  notificationManager.success(title, message);
};

export const showWarning = (message: string, title = 'Предупреждение') => {
  notificationManager.warning(title, message);
};

export const showInfo = (message: string, title = 'Информация') => {
  notificationManager.info(title, message);
};

// Обработчик для Promise с автоматическим показом ошибок
export const handleAsync = async <T>(
  promise: Promise<T>,
  successMessage?: string,
  errorMessage?: string
): Promise<T | null> => {
  try {
    const result = await promise;
    
    if (successMessage) {
      showSuccess(successMessage);
    }
    
    return result;
  } catch (error: any) {
    console.error('Async error:', error);
    
    let errorToShow: AppError;
    
    if (error.name === 'ValidationError') {
      errorToShow = errorManager.handleValidationError(error.fields || {});
    } else if (error.code === 'NETWORK_ERROR') {
      errorToShow = errorManager.handleNetworkError(error);
    } else if (error.status) {
      errorToShow = errorManager.handleServerError(error.status, error.message);
    } else {
      errorToShow = errorManager.createError('unknown', errorMessage || 'Произошла неизвестная ошибка');
    }
    
    if (errorToShow.userFriendly) {
      showError(errorToShow.message);
    }
    
    return null;
  }
};

// Декоратор для автоматической обработки ошибок в функциях
export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorMessage?: string
): T => {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error('Function error:', error);
      showError(errorMessage || 'Произошла ошибка при выполнении операции');
      throw error;
    }
  }) as T;
};

// Хук React для использования уведомлений (будет использоваться в компонентах)
export const createNotificationHook = () => {
  let currentNotifications: AppNotification[] = [];
  const subscribers: Array<(notifications: AppNotification[]) => void> = [];

  const subscribe = (callback: (notifications: AppNotification[]) => void) => {
    subscribers.push(callback);
    callback(currentNotifications);
    
    return () => {
      const index = subscribers.indexOf(callback);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
    };
  };

  // Подписываемся на глобальный менеджер уведомлений
  notificationManager.subscribe((notifications) => {
    currentNotifications = notifications;
    subscribers.forEach(callback => callback(notifications));
  });

  return {
    subscribe,
    addNotification: notificationManager.addNotification.bind(notificationManager),
    removeNotification: notificationManager.removeNotification.bind(notificationManager),
    clearAll: notificationManager.clearAll.bind(notificationManager),
    success: notificationManager.success.bind(notificationManager),
    error: notificationManager.error.bind(notificationManager),
    warning: notificationManager.warning.bind(notificationManager),
    info: notificationManager.info.bind(notificationManager)
  };
};
