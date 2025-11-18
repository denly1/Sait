import { useState } from 'react';
import { X, Receipt, Phone, MapPin, User, Check, Mail } from 'lucide-react';
import { OrderItem } from '../lib/localStorage';

interface CheckoutModalProps {
  items: OrderItem[];
  total: number;
  onClose: () => void;
  onConfirm: (orderData: OrderFormData) => void;
}

export interface OrderFormData {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address: string;
  customer_comment: string;
  items: OrderItem[];
  total_price: number;
  type: 'delivery' | 'pickup';
}

export default function CheckoutModal({ items, total, onClose, onConfirm }: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_address: '',
    customer_comment: '',
    type: 'delivery' as 'delivery' | 'pickup'
  });
  const [showReceipt, setShowReceipt] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData: OrderFormData = {
        ...formData,
        items,
        total_price: total,
      };

      onConfirm(orderData);
      setShowReceipt(true);
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Ошибка при оформлении заказа');
    } finally {
      setLoading(false);
    }
  };

  if (showReceipt) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-3 sm:p-4 overflow-y-auto">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-lg w-full border border-green-500/30 my-4 sm:my-8">
          <div className="p-6 sm:p-8 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">Заказ оформлен!</h2>
            <p className="text-slate-300 mb-6">Мы свяжемся с вами в ближайшее время</p>

            <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6 border border-slate-700 text-left mb-6">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-700">
                <Receipt className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Чек заказа</h3>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Имя:</span>
                  <span className="text-white font-medium">{formData.customer_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Телефон:</span>
                  <span className="text-white font-medium">{formData.customer_phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Адрес:</span>
                  <span className="text-white font-medium text-right">{formData.customer_address}</span>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-3 mb-3">
                <p className="text-slate-400 text-xs mb-2">Товары:</p>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">
                      {item.emoji} {item.name} x{item.quantity}
                    </span>
                    <span className="text-white font-medium">
                      {item.total.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-700 pt-3">
                <div className="flex justify-between text-lg">
                  <span className="text-slate-300 font-semibold">Итого:</span>
                  <span className="text-blue-400 font-bold text-xl">
                    {total.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 sm:py-4 rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 active:scale-98"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-3 sm:p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-blue-500/30 my-4 sm:my-8">
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm p-4 sm:p-6 border-b border-blue-500/30 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-400 flex items-center gap-2">
              <Receipt className="w-6 h-6 sm:w-8 sm:h-8" />
              Оформление заказа
            </h2>
            <p className="text-slate-400 text-sm">Заполните данные для доставки</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors active:scale-95">
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div>
            <label className="block text-slate-300 mb-2 text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              Ваше имя *
            </label>
            <input
              type="text"
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              required
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
              placeholder="Введите ваше имя"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 text-sm font-medium flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Телефон *
            </label>
            <input
              type="tel"
              value={formData.customer_phone}
              onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
              required
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
              placeholder="+7 (999) 123-45-67"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email (необязательно)
            </label>
            <input
              type="email"
              value={formData.customer_email}
              onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Адрес доставки *
            </label>
            <input
              type="text"
              value={formData.customer_address}
              onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
              required
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
              placeholder="Улица, дом, квартира"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 text-sm font-medium">
              Комментарий к заказу
            </label>
            <textarea
              value={formData.customer_comment}
              onChange={(e) => setFormData({ ...formData, customer_comment: e.target.value })}
              rows={3}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors resize-none text-sm sm:text-base"
              placeholder="Дополнительная информация..."
            />
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="flex justify-between items-center mb-3">
              <span className="text-slate-300 font-medium">Товаров:</span>
              <span className="text-white">{items.reduce((sum, item) => sum + item.quantity, 0)} шт.</span>
            </div>
            <div className="flex justify-between items-center text-lg sm:text-xl">
              <span className="text-slate-300 font-semibold">Итого:</span>
              <span className="text-blue-400 font-bold text-xl sm:text-2xl">
                {total.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-blue-500/50 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Обработка...</span>
              </>
            ) : (
              <>
                <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>Подтвердить заказ</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
