import { useState, useEffect } from 'react';
import { X, TrendingUp, Users, ShoppingBag, DollarSign, Calendar, BarChart3 } from 'lucide-react';
import { supabase } from '../lib/localStorage';

interface AdminPanelProps {
  onClose: () => void;
}

interface Stats {
  totalBookings: number;
  totalOrders: number;
  totalRevenue: number;
  activeEscorts: number;
  todayBookings: number;
  todayOrders: number;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  const [stats, setStats] = useState<Stats>({
    totalBookings: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeEscorts: 0,
    todayBookings: 0,
    todayOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'orders'>('overview');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const [bookingsRes, ordersRes, escortsRes] = await Promise.all([
        supabase.from('bookings').select('*'),
        supabase.from('orders').select('*'),
        supabase.from('escorts').select('*').eq('available', true),
      ]);

      const bookings = bookingsRes.data || [];
      const orders = ordersRes.data || [];
      const escorts = escortsRes.data || [];

      const todayBookings = bookings.filter((b: any) => 
        b.booking_date?.startsWith(today)
      ).length;

      const todayOrders = orders.filter((o: any) => 
        o.created_at?.startsWith(today)
      ).length;

      const totalRevenue = [
        ...bookings.map((b: any) => b.total_price || 0),
        ...orders.map((o: any) => o.total_price || 0)
      ].reduce((sum, price) => sum + price, 0);

      setStats({
        totalBookings: bookings.length,
        totalOrders: orders.length,
        totalRevenue,
        activeEscorts: escorts.length,
        todayBookings,
        todayOrders,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-amber-500/30">
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm p-6 border-b border-amber-500/30 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-amber-400 flex items-center gap-2">
              <BarChart3 className="w-8 h-8" />
              Админ-панель
            </h2>
            <p className="text-slate-400">Статистика и отчеты</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-6">
            {['overview', 'bookings', 'orders'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {tab === 'overview' && 'Обзор'}
                {tab === 'bookings' && 'Бронирования'}
                {tab === 'orders' && 'Заказы'}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-12 h-12 opacity-80" />
                    <div className="text-right">
                      <div className="text-3xl font-bold">{stats.activeEscorts}</div>
                      <div className="text-blue-200 text-sm">Активных эскортов</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Calendar className="w-12 h-12 opacity-80" />
                    <div className="text-right">
                      <div className="text-3xl font-bold">{stats.totalBookings}</div>
                      <div className="text-green-200 text-sm">Всего бронирований</div>
                    </div>
                  </div>
                  <div className="text-green-200 text-sm">Сегодня: {stats.todayBookings}</div>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <ShoppingBag className="w-12 h-12 opacity-80" />
                    <div className="text-right">
                      <div className="text-3xl font-bold">{stats.totalOrders}</div>
                      <div className="text-purple-200 text-sm">Всего заказов</div>
                    </div>
                  </div>
                  <div className="text-purple-200 text-sm">Сегодня: {stats.todayOrders}</div>
                </div>

                <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl p-6 text-white md:col-span-2 lg:col-span-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <DollarSign className="w-16 h-16 opacity-80" />
                      <div>
                        <div className="text-4xl font-bold">{stats.totalRevenue.toLocaleString('ru-RU')} ₽</div>
                        <div className="text-amber-200">Общая выручка</div>
                      </div>
                    </div>
                    <TrendingUp className="w-12 h-12 text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-white mb-4">Быстрая статистика</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Средний чек (бронирования)</span>
                    <span className="text-white font-bold">
                      {stats.totalBookings > 0 
                        ? Math.round(stats.totalRevenue / (stats.totalBookings + stats.totalOrders)).toLocaleString('ru-RU')
                        : 0} ₽
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Активность сегодня</span>
                    <span className="text-green-400 font-bold">
                      {stats.todayBookings + stats.todayOrders} операций
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Загруженность эскортов</span>
                    <span className="text-amber-400 font-bold">
                      {stats.activeEscorts > 0 ? Math.round((stats.totalBookings / stats.activeEscorts) * 100) / 100 : 0} заказов/эскорт
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bg-slate-800/50 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">История бронирований</h3>
              <p className="text-slate-400">Всего бронирований: {stats.totalBookings}</p>
              <p className="text-green-400 mt-2">Сегодня: {stats.todayBookings}</p>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-slate-800/50 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">История заказов</h3>
              <p className="text-slate-400">Всего заказов: {stats.totalOrders}</p>
              <p className="text-green-400 mt-2">Сегодня: {stats.todayOrders}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
