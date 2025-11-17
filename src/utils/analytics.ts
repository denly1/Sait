import { supabase } from '../lib/supabase';

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

    const { error } = await supabase
      .from('analytics_events')
      .insert(event);

    if (error) {
      console.error('Error logging event:', error);
    }
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
export async function getAnalytics(startDate?: string, endDate?: string) {
  try {
    let query = supabase
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: false });

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error } = await query.limit(1000);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error getting analytics:', error);
    return [];
  }
}

// Получить уникальных посетителей
export async function getUniqueVisitors(days: number = 7) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('analytics_events')
      .select('ip_address')
      .gte('created_at', startDate.toISOString())
      .eq('event_type', 'page_view');

    if (error) throw error;

    const uniqueIPs = new Set(data?.map(event => event.ip_address) || []);
    return uniqueIPs.size;
  } catch (error) {
    console.error('Error getting unique visitors:', error);
    return 0;
  }
}

// Получить популярные страницы
export async function getPopularPages(days: number = 7) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('analytics_events')
      .select('metadata')
      .eq('event_type', 'page_view')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const pageCounts: { [key: string]: number } = {};
    data?.forEach(event => {
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
