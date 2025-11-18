// Система валидации форм v2.0

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  min?: number;
  max?: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Валидаторы для различных типов данных
export const validators = {
  // Проверка email
  email: (value: string): string | null => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      return 'Неверный формат email';
    }
    return null;
  },

  // Проверка телефона
  phone: (value: string): string | null => {
    const phonePattern = /^[\+]?[7|8][\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
    if (!phonePattern.test(value.replace(/\s/g, ''))) {
      return 'Неверный формат телефона. Пример: +7 (999) 123-45-67';
    }
    return null;
  },

  // Проверка имени
  name: (value: string): string | null => {
    if (!value || value.length < 2) {
      return 'Имя должно содержать минимум 2 символа';
    }
    if (value.length > 50) {
      return 'Имя не может содержать более 50 символов';
    }
    const namePattern = /^[а-яА-Яa-zA-Z\s\-]+$/;
    if (!namePattern.test(value)) {
      return 'Имя может содержать только буквы, пробелы и дефисы';
    }
    return null;
  },

  // Проверка пароля
  password: (value: string): string | null => {
    if (!value || value.length < 6) {
      return 'Пароль должен содержать минимум 6 символов';
    }
    if (value.length > 100) {
      return 'Пароль не может содержать более 100 символов';
    }
    return null;
  },

  // Проверка возраста
  age: (value: number): string | null => {
    if (!value || value < 18) {
      return 'Возраст должен быть не менее 18 лет';
    }
    if (value > 100) {
      return 'Возраст не может быть более 100 лет';
    }
    return null;
  },

  // Проверка цены
  price: (value: number): string | null => {
    if (!value || value < 0) {
      return 'Цена должна быть положительным числом';
    }
    if (value > 1000000) {
      return 'Цена не может превышать 1,000,000 рублей';
    }
    return null;
  },

  // Проверка рейтинга
  rating: (value: number): string | null => {
    if (value < 1 || value > 5) {
      return 'Рейтинг должен быть от 1 до 5';
    }
    return null;
  },

  // Проверка даты
  date: (value: string): string | null => {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return 'Неверный формат даты';
    }
    if (date < new Date()) {
      return 'Дата не может быть в прошлом';
    }
    return null;
  },

  // Проверка длительности (в часах)
  duration: (value: number): string | null => {
    if (!value || value < 0.5) {
      return 'Минимальная длительность 0.5 часа';
    }
    if (value > 24) {
      return 'Максимальная длительность 24 часа';
    }
    return null;
  }
};

// Основная функция валидации
export function validateField(value: any, rules: ValidationRule, fieldName: string): ValidationError[] {
  const errors: ValidationError[] = [];

  // Проверка на обязательность
  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    errors.push({
      field: fieldName,
      message: `Поле "${fieldName}" обязательно для заполнения`
    });
    return errors; // Если поле обязательное и пустое, остальные проверки не нужны
  }

  // Если поле не обязательное и пустое, валидация пройдена
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return errors;
  }

  // Проверка минимальной длины
  if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
    errors.push({
      field: fieldName,
      message: `Поле "${fieldName}" должно содержать минимум ${rules.minLength} символов`
    });
  }

  // Проверка максимальной длины
  if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
    errors.push({
      field: fieldName,
      message: `Поле "${fieldName}" не может содержать более ${rules.maxLength} символов`
    });
  }

  // Проверка минимального значения
  if (rules.min && typeof value === 'number' && value < rules.min) {
    errors.push({
      field: fieldName,
      message: `Значение поля "${fieldName}" должно быть не менее ${rules.min}`
    });
  }

  // Проверка максимального значения
  if (rules.max && typeof value === 'number' && value > rules.max) {
    errors.push({
      field: fieldName,
      message: `Значение поля "${fieldName}" не должно превышать ${rules.max}`
    });
  }

  // Проверка по регулярному выражению
  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    errors.push({
      field: fieldName,
      message: `Поле "${fieldName}" имеет неверный формат`
    });
  }

  // Кастомная валидация
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      errors.push({
        field: fieldName,
        message: customError
      });
    }
  }

  return errors;
}

// Валидация объекта с множественными полями
export function validateForm(
  data: Record<string, any>,
  rules: Record<string, ValidationRule>
): ValidationResult {
  const allErrors: ValidationError[] = [];

  Object.entries(rules).forEach(([fieldName, rule]) => {
    const fieldValue = data[fieldName];
    const fieldErrors = validateField(fieldValue, rule, fieldName);
    allErrors.push(...fieldErrors);
  });

  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
}

// Предустановленные схемы валидации для различных форм
export const validationSchemas = {
  // Схема для формы бронирования эскорта
  booking: {
    customer_name: {
      required: true,
      custom: validators.name
    },
    customer_phone: {
      required: true,
      custom: validators.phone
    },
    customer_email: {
      required: false,
      custom: (value: string) => value ? validators.email(value) : null
    },
    booking_date: {
      required: true,
      custom: validators.date
    },
    duration: {
      required: true,
      custom: validators.duration
    }
  },

  // Схема для формы заказа товаров
  order: {
    customer_name: {
      required: true,
      custom: validators.name
    },
    customer_phone: {
      required: true,
      custom: validators.phone
    },
    customer_email: {
      required: false,
      custom: (value: string) => value ? validators.email(value) : null
    },
    customer_address: {
      required: true,
      minLength: 10,
      maxLength: 200
    }
  },

  // Схема для формы входа
  login: {
    username: {
      required: true,
      minLength: 3,
      maxLength: 50
    },
    password: {
      required: true,
      custom: validators.password
    }
  },

  // Схема для формы регистрации
  registration: {
    username: {
      required: true,
      minLength: 3,
      maxLength: 50
    },
    email: {
      required: true,
      custom: validators.email
    },
    password: {
      required: true,
      custom: validators.password
    },
    confirmPassword: {
      required: true,
      custom: (value: string, formData?: Record<string, any>) => {
        if (formData && value !== formData.password) {
          return 'Пароли не совпадают';
        }
        return null;
      }
    },
    phone: {
      required: true,
      custom: validators.phone
    }
  },

  // Схема для формы отзыва
  review: {
    username: {
      required: true,
      custom: validators.name
    },
    rating: {
      required: true,
      custom: validators.rating
    },
    text: {
      required: true,
      minLength: 10,
      maxLength: 500
    },
    service: {
      required: true,
      minLength: 2,
      maxLength: 100
    }
  },

  // Схема для сообщения в чате поддержки
  supportMessage: {
    message: {
      required: true,
      minLength: 5,
      maxLength: 1000
    }
  }
};

// Утилита для отображения ошибок в удобном формате
export function formatValidationErrors(errors: ValidationError[]): Record<string, string> {
  const formatted: Record<string, string> = {};
  errors.forEach(error => {
    if (!formatted[error.field]) {
      formatted[error.field] = error.message;
    }
  });
  return formatted;
}

// Утилита для проверки, есть ли ошибки в конкретном поле
export function hasFieldError(errors: ValidationError[], fieldName: string): boolean {
  return errors.some(error => error.field === fieldName);
}

// Утилита для получения первой ошибки конкретного поля
export function getFieldError(errors: ValidationError[], fieldName: string): string | null {
  const error = errors.find(error => error.field === fieldName);
  return error ? error.message : null;
}
