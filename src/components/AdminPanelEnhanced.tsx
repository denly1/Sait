import { useState, useEffect } from 'react';
import { X, Users, ShoppingBag, DollarSign, Calendar, BarChart3, Plus, Edit, Trash2, Download } from 'lucide-react';
import { storage } from '../lib/localStorage';

interface AdminPanelEnhancedProps {
  onClose: () => void;
}

export default function AdminPanelEnhanced({ onClose }: AdminPanelEnhancedProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'escorts' | 'products' | 'orders' | 'bookings'>('overview');
  const [escorts, setEscorts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeEscorts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const escorts = storage.getEscorts();
      const orders = storage.getOrders();
      const bookings = storage.getBookings();

      setEscorts(escorts || []);
      setProducts([]); // Пока пустой массив для продуктов
      setOrders(orders || []);
      setBookings(bookings || []);

      const totalRevenue = [
        ...(bookings || []).map((b: any) => b.total_price || 0),
        ...(orders || []).map((o: any) => o.total_price || 0)
      ].reduce((sum, price) => sum + price, 0);

      setStats({
        totalBookings: bookings?.length || 0,
        totalOrders: orders?.length || 0,
        totalRevenue,
        activeEscorts: escorts?.filter((e: any) => e.available).length || 0,
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEscort = async (id: string) => {
    if (!confirm('Удалить этого эскорта?')) return;
    
    try {
      // TODO: Реализовать удаление в localStorage
      console.log('Delete escort:', id);
      loadData();
    } catch (error) {
      console.error('Error deleting escort:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Удалить этот товар?')) return;
    
    try {
      // TODO: Реализовать удаление в localStorage
      console.log('Delete product:', id);
      loadData();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm('Удалить этот заказ?')) return;
    
    try {
      // TODO: Реализовать удаление в localStorage
      console.log('Delete order:', id);
      loadData();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      // TODO: Реализовать обновление в localStorage
      console.log('Update order status:', id, status);
      loadData();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto border border-amber-500/30 my-8">
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm p-6 border-b border-amber-500/30 flex justify-between items-center z-10">
          <div>
            <h2 className="text-3xl font-bold text-amber-400 flex items-center gap-2">
              <BarChart3 className="w-8 h-8" />
              Админ-панель Pro
            </h2>
            <p className="text-slate-400">Полное управление системой</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {['overview', 'escorts', 'products', 'orders', 'bookings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {tab === 'overview' && '📊 Обзор'}
                {tab === 'escorts' && '👥 Эскорты'}
                {tab === 'products' && '📦 Товары'}
                {tab === 'orders' && '🛒 Заказы'}
                {tab === 'bookings' && '📅 Бронирования'}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
                  <Users className="w-12 h-12 opacity-80 mb-2" />
                  <div className="text-3xl font-bold">{stats.activeEscorts}</div>
                  <div className="text-blue-200 text-sm">Активных эскортов</div>
                </div>

                <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 text-white">
                  <Calendar className="w-12 h-12 opacity-80 mb-2" />
                  <div className="text-3xl font-bold">{stats.totalBookings}</div>
                  <div className="text-green-200 text-sm">Всего бронирований</div>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 text-white">
                  <ShoppingBag className="w-12 h-12 opacity-80 mb-2" />
                  <div className="text-3xl font-bold">{stats.totalOrders}</div>
                  <div className="text-purple-200 text-sm">Всего заказов</div>
                </div>

                <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl p-6 text-white">
                  <DollarSign className="w-12 h-12 opacity-80 mb-2" />
                  <div className="text-3xl font-bold">{stats.totalRevenue.toLocaleString('ru-RU')} ₽</div>
                  <div className="text-amber-200 text-sm">Общая выручка</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => exportToCSV(bookings, 'bookings')}
                  className="bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-5 h-5" />
                  Экспорт бронирований
                </button>
                <button
                  onClick={() => exportToCSV(orders, 'orders')}
                  className="bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-5 h-5" />
                  Экспорт заказов
                </button>
                <button
                  onClick={() => exportToCSV([...bookings, ...orders], 'all_transactions')}
                  className="bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-5 h-5" />
                  Экспорт всех данных
                </button>
              </div>
            </div>
          )}

          {activeTab === 'escorts' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Управление эскортами</h3>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Добавить
                </button>
              </div>
              <div className="space-y-4">
                {escorts.map((escort) => (
                  <div key={escort.id} className="bg-slate-800/50 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={escort.image_url} alt={escort.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div>
                        <div className="text-white font-bold">{escort.name}</div>
                        <div className="text-slate-400 text-sm">{escort.age} лет • {escort.price.toLocaleString('ru-RU')} ₽</div>
                        <div className={`text-sm ${escort.available ? 'text-green-400' : 'text-red-400'}`}>
                          {escort.available ? 'Доступна' : 'Занята'}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => deleteEscort(escort.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Управление товарами</h3>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Добавить
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="bg-slate-800/50 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-white font-bold">{product.name}</div>
                        <div className="text-slate-400 text-sm">{product.category}</div>
                        <div className="text-amber-400 font-bold mt-1">{product.price.toLocaleString('ru-RU')} ₽</div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteProduct(product.id)}
                          className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-slate-300 text-sm">{product.description}</div>
                    <div className={`text-sm mt-2 ${product.in_stock ? 'text-green-400' : 'text-red-400'}`}>
                      {product.in_stock ? `В наличии: ${product.quantity} шт.` : 'Нет в наличии'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Заказы товаров</h3>
                <button
                  onClick={() => exportToCSV(orders, 'orders')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Экспорт
                </button>
              </div>
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center text-slate-400 py-12">Заказов пока нет</div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="bg-slate-800/50 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="text-white font-bold">{order.customer_name}</div>
                        <div className="text-slate-400 text-sm">{order.customer_phone}</div>
                        <div className="text-amber-400 font-bold mt-1">{order.total_price?.toLocaleString('ru-RU')} ₽</div>
                      </div>
                      <button 
                        onClick={() => deleteOrder(order.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Бронирования эскортов</h3>
                <button
                  onClick={() => exportToCSV(bookings, 'bookings')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Экспорт
                </button>
              </div>
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="text-center text-slate-400 py-12">Бронирований пока нет</div>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking.id} className="bg-slate-800/50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-bold">{booking.customer_name}</div>
                          <div className="text-slate-400 text-sm">{booking.customer_phone}</div>
                          <div className="text-slate-300 text-sm mt-1">
                            Дата: {new Date(booking.booking_date).toLocaleDateString('ru-RU')}
                          </div>
                          <div className="text-amber-400 font-bold mt-1">
                            {booking.total_price?.toLocaleString('ru-RU')} ₽ • {booking.duration} час(а)
                          </div>
                        </div>
                        <button className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
