// Локальное хранилище данных v2.0 (улучшенная версия)

export interface Escort {
  id: string;
  name: string;
  age: number;
  description: string;
  price: number;
  image_url: string;
  rating: number;
  available: boolean;
  created_at: string;
  services?: string[];
  location?: string;
  phone?: string;
}

export interface CasinoGame {
  id: string;
  name: string;
  type: string;
  description: string;
  min_bet: number;
  max_bet: number;
  image_url: string;
  active: boolean;
  created_at: string;
  rtp?: number;
  max_win?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  in_stock: boolean;
  quantity: number;
  emoji: string;
  created_at: string;
  discount?: number;
  tags?: string[];
}

export interface Booking {
  id: string;
  escort_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  booking_date: string;
  duration: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  notes?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address?: string;
  customer_comment?: string;
  items: OrderItem[];
  total_price: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  type: 'delivery' | 'pickup';
  created_at: string;
  delivery_date?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  emoji?: string;
}

export interface AnalyticsEvent {
  id: string;
  event_type: 'page_view' | 'login' | 'order' | 'click' | 'wheel_spin' | 'chat_message';
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  page_url?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  user_id?: string;
  read: boolean;
  action_url?: string;
  created_at: string;
  expires_at?: string;
}

export interface Review {
  id: string;
  user_id?: string;
  username: string;
  rating: number;
  text: string;
  service: string;
  likes: number;
  created_at: string;
  verified: boolean;
}

export interface LoyaltyTransaction {
  id: string;
  user_id: string;
  points_change: number;
  reason: string;
  type: 'earned' | 'spent' | 'bonus' | 'refund';
  metadata?: Record<string, any>;
  created_at: string;
}

export interface SupportMessage {
  id: string;
  user_id: string;
  message: string;
  sender: 'user' | 'support' | 'bot';
  read: boolean;
  created_at: string;
  attachments?: string[];
}

// Локальное хранилище
class LocalStorage {
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setItem(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  // Escorts
  getEscorts(): Escort[] {
    return this.getItem('escorts', [
      {
        id: '1',
        name: 'Анастасия',
        age: 23,
        description: 'Элегантная и утонченная спутница для особых мероприятий',
        price: 5000,
        rating: 4.9,
        available: true,
        image_url: '',
        created_at: new Date().toISOString(),
        services: ['Сопровождение', 'Деловые встречи'],
        location: 'Центр города'
      },
      {
        id: '2',
        name: 'Виктория',
        age: 25,
        description: 'Профессиональная модель с безупречными манерами',
        price: 6000,
        rating: 4.8,
        available: true,
        image_url: '',
        created_at: new Date().toISOString(),
        services: ['Фотосессии', 'Показы мод'],
        location: 'Любой район'
      },
      {
        id: '3',
        name: 'Екатерина',
        age: 22,
        description: 'Яркая и общительная, создаст незабываемую атмосферу',
        price: 7000,
        rating: 5.0,
        available: true,
        image_url: '',
        created_at: new Date().toISOString(),
        services: ['Вечеринки', 'События'],
        location: 'Центр'
      },
      {
        id: '4',
        name: 'Мария',
        age: 24,
        description: 'Интеллигентная собеседница для деловых встреч',
        price: 8000,
        rating: 4.7,
        available: false,
        image_url: '',
        created_at: new Date().toISOString(),
        services: ['Деловые встречи', 'Переговоры'],
        location: 'Деловой центр'
      },
      {
        id: '5',
        name: 'Ольга VIP',
        age: 26,
        description: 'Премиум-класс. Эксклюзивное сопровождение',
        price: 12000,
        rating: 5.0,
        available: true,
        image_url: '',
        created_at: new Date().toISOString(),
        services: ['VIP сопровождение', 'Эксклюзив'],
        location: 'По договоренности',
        phone: '+7 (999) 123-45-67'
      },
    ]);
  }

  // Bookings
  getBookings(): Booking[] {
    return this.getItem('bookings', []);
  }

  addBooking(booking: Omit<Booking, 'id' | 'status' | 'created_at'>): void {
    const bookings = this.getBookings();
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      status: 'pending',
      created_at: new Date().toISOString()
    };
    bookings.push(newBooking);
    this.setItem('bookings', bookings);
  }

  // Orders
  getOrders(): Order[] {
    return this.getItem('orders', []);
  }

  addOrder(order: Omit<Order, 'id' | 'status' | 'created_at'>): void {
    const orders = this.getOrders();
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      status: 'pending',
      created_at: new Date().toISOString()
    };
    orders.push(newOrder);
    this.setItem('orders', orders);
  }

  // Analytics
  logEvent(event: any): void {
    const events = this.getItem('analytics_events', [] as any[]);
    events.push({
      ...event,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    });
    // Храним только последние 1000 событий
    if (events.length > 1000) {
      events.shift();
    }
    this.setItem('analytics_events', events);
  }

  getAnalytics(): any[] {
    return this.getItem('analytics_events', [] as any[]);
  }

  // Reviews
  getReviews(): any[] {
    return this.getItem('reviews', []);
  }

  addReview(review: any): void {
    const reviews = this.getReviews();
    reviews.push({
      ...review,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    });
    this.setItem('reviews', reviews);
  }

  // Loyalty
  getLoyaltyPoints(userId: string): { points: number; level: string; updated_at?: string } {
    const loyalty = this.getItem('loyalty_points', {} as Record<string, any>);
    return loyalty[userId] || { points: 0, level: 'Бронза' };
  }

  updateLoyaltyPoints(userId: string, points: number): void {
    const loyalty = this.getItem('loyalty_points', {} as Record<string, any>);
    loyalty[userId] = {
      points,
      level: points >= 5000 ? 'Платина' : points >= 2000 ? 'Золото' : points >= 1000 ? 'Серебро' : 'Бронза',
      updated_at: new Date().toISOString()
    };
    this.setItem('loyalty_points', loyalty);
  }

  // Support messages
  getMessages(userId: string): any[] {
    const messages = this.getItem('support_messages', {} as Record<string, any[]>);
    return messages[userId] || [];
  }

  addMessage(userId: string, message: any): void {
    const messages = this.getItem('support_messages', {} as Record<string, any[]>);
    if (!messages[userId]) {
      messages[userId] = [];
    }
    messages[userId].push({
      ...message,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    });
    this.setItem('support_messages', messages);
  }

  // Wheel wins
  getWheelWins(userId: string): any[] {
    const wins = this.getItem('wheel_wins', {} as Record<string, any[]>);
    return wins[userId] || [];
  }

  addWheelWin(userId: string, win: any): void {
    const wins = this.getItem('wheel_wins', {} as Record<string, any[]>);
    if (!wins[userId]) {
      wins[userId] = [];
    }
    wins[userId].push({
      ...win,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    });
    this.setItem('wheel_wins', wins);
  }

  // Clear all data
  clearAll(): void {
    localStorage.clear();
  }
}

export const storage = new LocalStorage();

// Совместимость с старым API
export const supabase = {
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        order: (column: string, options?: any) => ({
          then: (callback: (result: any) => void) => {
            let data: any[] = [];
            
            if (table === 'escorts') {
              data = storage.getEscorts();
            } else if (table === 'bookings') {
              data = storage.getBookings();
            } else if (table === 'orders') {
              data = storage.getOrders();
            }
            
            callback({ data, error: null });
            return Promise.resolve({ data, error: null });
          }
        }),
        then: (callback: (result: any) => void) => {
          let data: any[] = [];
          
          if (table === 'escorts') {
            data = storage.getEscorts();
          }
          
          callback({ data, error: null });
          return Promise.resolve({ data, error: null });
        }
      }),
      then: (callback: (result: any) => void) => {
        let data: any[] = [];
        
        if (table === 'escorts') {
          data = storage.getEscorts();
        } else if (table === 'analytics_events') {
          data = storage.getAnalytics();
        }
        
        callback({ data, error: null });
        return Promise.resolve({ data, error: null });
      }
    }),
    insert: (data: any) => ({
      then: (callback: (result: any) => void) => {
        if (table === 'bookings') {
          storage.addBooking(data);
        } else if (table === 'orders') {
          storage.addOrder(data);
        } else if (table === 'analytics_events') {
          storage.logEvent(data);
        }
        
        callback({ data, error: null });
        return Promise.resolve({ data, error: null });
      }
    })
  })
};
