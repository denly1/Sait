import { storage } from '../lib/localStorage';

export interface AnalyticsEvent {
  id?: string;
  event_type: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  page_url?: string;
  metadata?: any;
  created_at?: string;
}

// Получить IP адрес пользователя
export async function getUserIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting IP:', error);
    return 'unknown';
  }
}

// Логирование события
export async function logEvent(eventType: string, metadata?: any) {
  try {
    const ip = await getUserIP();
    const userAgent = navigator.userAgent;
    const pageUrl = window.location.href;

    const event: AnalyticsEvent = {
      event_type: eventType,
      ip_address: ip,
      user_agent: userAgent,
      page_url: pageUrl,
      metadata: metadata || {},
      created_at: new Date().toISOString()
    };

    storage.logEvent(event);
  } catch (error) {
    console.error('Error in logEvent:', error);
  }
}

// Логирование посещения страницы
export async function logPageView(pageName: string) {
  await logEvent('page_view', { page: pageName });
}

// Логирование клика
export async function logClick(elementName: string, elementType: string) {
  await logEvent('click', { element: elementName, type: elementType });
}

// Логирование заказа
export async function logOrder(orderData: any) {
  await logEvent('order', orderData);
}

// Логирование входа
export async function logLogin(username: string, role: string) {
  await logEvent('login', { username, role });
}

// Получить статистику для админа
export async function getAnalytics() {
  try {
    return storage.getAnalytics();
  } catch (error) {
    console.error('Error getting analytics:', error);
    return [];
  }
}

// Получить уникальных посетителей
export async function getUniqueVisitors(days: number = 7) {
  try {
    const data = storage.getAnalytics();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const filtered = data.filter((event: any) => 
      event.event_type === 'page_view' && 
      new Date(event.created_at) >= startDate
    );

    const uniqueIPs = new Set(filtered.map((event: any) => event.ip_address));
    return uniqueIPs.size;
  } catch (error) {
    console.error('Error getting unique visitors:', error);
    return 0;
  }
}

// Получить популярные страницы
export async function getPopularPages(days: number = 7) {
  try {
    const data = storage.getAnalytics();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const filtered = data.filter((event: any) => 
      event.event_type === 'page_view' && 
      new Date(event.created_at) >= startDate
    );

    const pageCounts: { [key: string]: number } = {};
    filtered.forEach((event: any) => {
      const page = event.metadata?.page || 'unknown';
      pageCounts[page] = (pageCounts[page] || 0) + 1;
    });

    return Object.entries(pageCounts)
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error getting popular pages:', error);
    return [];
  }
}
