import { useState } from 'react';
import { X, Phone, User, ShoppingCart, CheckCircle, Package } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';

interface OrderModalProps {
  product: Product;
  onClose: () => void;
}

export default function OrderModal({ product, onClose }: OrderModalProps) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    quantity: 1,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const total_price = product.price * formData.quantity;

      const { error } = await supabase.from('orders').insert([
        {
          product_id: product.id,
          customer_name: formData.customer_name,
          customer_phone: formData.customer_phone,
          quantity: formData.quantity,
          total_price,
        },
      ]);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Ошибка при создании заказа. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          {success ? (
            <div className="text-center py-12">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Заказ оформлен!</h3>
              <p className="text-slate-300">Мы свяжемся с вами для подтверждения</p>
            </div>
          ) : (
            <>
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-slate-400 text-sm mb-2">{product.description}</p>
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <Package className="w-4 h-4" />
                    <span>Доступно: {product.quantity} шт.</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-slate-300 mb-2 flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Ваше имя</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Введите имя"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Телефон</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 flex items-center space-x-2">
                    <ShoppingCart className="w-4 h-4" />
                    <span>Количество</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={product.quantity}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300">Цена за единицу:</span>
                    <span className="text-white font-semibold">
                      {product.price.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Итого:</span>
                    <span className="text-3xl font-bold text-blue-400">
                      {(product.price * formData.quantity).toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Обработка...' : 'Оформить заказ'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
