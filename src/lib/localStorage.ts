// Локальное хранилище данных (замена Supabase)

export interface Escort {
  id: string;
  name: string;
  age: number;
  description: string;
  price: number;
  image_url: string;
  rating: number;
  available: boolean;
  created_at?: string;
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
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  in_stock: boolean;
  quantity?: number;
  emoji?: string;
  created_at?: string;
}

export interface Booking {
  id?: string;
  escort_id: string;
  customer_name: string;
  customer_phone: string;
  booking_date: string;
  duration: number;
  total_price: number;
  status?: string;
  created_at?: string;
}

export interface Order {
  id?: string;
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  customer_comment?: string;
  items: any[];
  total_price: number;
  status?: string;
  type?: string;
  created_at?: string;
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
        image_url: ''
      },
      {
        id: '2',
        name: 'Виктория',
        age: 25,
        description: 'Профессиональная модель с безупречными манерами',
        price: 6000,
        rating: 4.8,
        available: true,
        image_url: ''
      },
      {
        id: '3',
        name: 'Екатерина',
        age: 22,
        description: 'Яркая и общительная, создаст незабываемую атмосферу',
        price: 7000,
        rating: 5.0,
        available: true,
        image_url: ''
      },
      {
        id: '4',
        name: 'Мария',
        age: 24,
        description: 'Интеллигентная собеседница для деловых встреч',
        price: 8000,
        rating: 4.7,
        available: false,
        image_url: ''
      },
      {
        id: '5',
        name: 'Ольга VIP',
        age: 26,
        description: 'Премиум-класс. Эксклюзивное сопровождение',
        price: 12000,
        rating: 5.0,
        available: true,
        image_url: ''
      },
    ]);
  }

  // Bookings
  getBookings(): Booking[] {
    return this.getItem('bookings', []);
  }

  addBooking(booking: Booking): void {
    const bookings = this.getBookings();
    const newBooking = {
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

  addOrder(order: Order): void {
    const orders = this.getOrders();
    const newOrder = {
      ...order,
      id: Date.now().toString(),
      status: 'pending',
      created_at: new Date().toISOString()
    };
    orders.push(newOrder);
    this.setItem('orders', newOrder);
  }

  // Analytics
  logEvent(event: any): void {
    const events = this.getItem('analytics_events', []);
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
    return this.getItem('analytics_events', []);
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
  getLoyaltyPoints(userId: string): any {
    const loyalty = this.getItem('loyalty_points', {});
    return loyalty[userId] || { points: 0, level: 'Бронза' };
  }

  updateLoyaltyPoints(userId: string, points: number): void {
    const loyalty = this.getItem('loyalty_points', {});
    loyalty[userId] = {
      points,
      level: points >= 5000 ? 'Платина' : points >= 2000 ? 'Золото' : points >= 1000 ? 'Серебро' : 'Бронза',
      updated_at: new Date().toISOString()
    };
    this.setItem('loyalty_points', loyalty);
  }

  // Support messages
  getMessages(userId: string): any[] {
    const messages = this.getItem('support_messages', {});
    return messages[userId] || [];
  }

  addMessage(userId: string, message: any): void {
    const messages = this.getItem('support_messages', {});
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
    const wins = this.getItem('wheel_wins', {});
    return wins[userId] || [];
  }

  addWheelWin(userId: string, win: any): void {
    const wins = this.getItem('wheel_wins', {});
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
