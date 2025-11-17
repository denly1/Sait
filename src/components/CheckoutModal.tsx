import { useState } from 'react';
import { X, Receipt, Phone, MapPin, User, Check } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji?: string;
}

interface CheckoutModalProps {
  items: CartItem[];
  total: number;
  onClose: () => void;
  onConfirm: (orderData: OrderData) => void;
}

export interface OrderData {
  name: string;
  phone: string;
  address: string;
  comment: string;
  items: CartItem[];
  total: number;
}

export default function CheckoutModal({ items, total, onClose, onConfirm }: CheckoutModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const orderData: OrderData = {
      name,
      phone,
      address,
      comment,
      items,
      total
    };

    onConfirm(orderData);
    setShowReceipt(true);
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
                  <span className="text-white font-medium">{name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Телефон:</span>
                  <span className="text-white font-medium">{phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Адрес:</span>
                  <span className="text-white font-medium text-right">{address}</span>
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
                      {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
              placeholder="+7 (___) ___-__-__"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Адрес доставки *
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
              placeholder="Улица, дом, квартира"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-2 text-sm font-medium">
              Комментарий к заказу
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
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
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-blue-500/50 active:scale-98"
          >
            <Check className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>Подтвердить заказ</span>
          </button>
        </form>
      </div>
    </div>
  );
}
