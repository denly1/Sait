import { useState } from 'react';
import { X, Calendar, Package, User, Phone } from 'lucide-react';

interface UserHistoryProps {
  onClose: () => void;
}

interface HistoryItem {
  id: string;
  type: 'booking' | 'order';
  date: string;
  name: string;
  phone: string;
  total: number;
  status: string;
}

export default function UserHistory({ onClose }: UserHistoryProps) {
  const [history] = useState<HistoryItem[]>([
    {
      id: '1',
      type: 'booking',
      date: '2025-10-28',
      name: 'Анна',
      phone: '+7 999 123-45-67',
      total: 15000,
      status: 'Завершено'
    },
    {
      id: '2',
      type: 'order',
      date: '2025-10-25',
      name: 'Баллон с гелием 5L',
      phone: '+7 999 123-45-67',
      total: 3500,
      status: 'Доставлено'
    }
  ]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-amber-500/30">
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm p-6 border-b border-amber-500/30 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-amber-400">История заказов</h2>
            <p className="text-slate-400">Ваши бронирования и покупки</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">История пуста</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-amber-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {item.type === 'booking' ? (
                      <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                        <User className="w-6 h-6 text-amber-400" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-blue-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-white font-bold text-lg">{item.name}</h3>
                      <p className="text-slate-400 text-sm">
                        {item.type === 'booking' ? 'Бронирование эскорта' : 'Заказ товара'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-amber-400">
                      {item.total.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="text-green-400 text-sm font-semibold">{item.status}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(item.date).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="w-4 h-4" />
                    <span>{item.phone}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
