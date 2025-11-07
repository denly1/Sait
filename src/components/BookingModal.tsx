import { useState } from 'react';
import { X, Calendar, Clock, Phone, User, CheckCircle } from 'lucide-react';
import { supabase, Escort } from '../lib/supabase';

interface BookingModalProps {
  escort: Escort;
  onClose: () => void;
}

export default function BookingModal({ escort, onClose }: BookingModalProps) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    booking_date: '',
    duration: 1,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const total_price = escort.price * formData.duration;

      const { error } = await supabase.from('bookings').insert([
        {
          escort_id: escort.id,
          customer_name: formData.customer_name,
          customer_phone: formData.customer_phone,
          booking_date: formData.booking_date,
          duration: formData.duration,
          total_price,
        },
      ]);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Ошибка при создании брони. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-700 relative overflow-hidden my-8">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-4 sm:p-6 lg:p-8">
          {success ? (
            <div className="text-center py-12">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Бронирование успешно!</h3>
              <p className="text-slate-300">Мы свяжемся с вами в ближайшее время</p>
            </div>
          ) : (
            <>
              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mb-6">
                Бронирование: {escort.name}
              </h3>

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
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 transition-colors"
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
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Дата и время</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.booking_date}
                    onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-2 flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Продолжительность (часов)</span>
                  </label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 transition-colors"
                  >
                    {[1, 2, 3, 4, 6, 8, 12, 24].map((hours) => (
                      <option key={hours} value={hours}>
                        {hours} {hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Итого:</span>
                    <span className="text-3xl font-bold text-amber-400">
                      {(escort.price * formData.duration).toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Обработка...' : 'Подтвердить бронирование'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
