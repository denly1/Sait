import { useState, useEffect } from 'react';
import { Star, Phone, Calendar, Clock } from 'lucide-react';
import { supabase, Escort } from '../lib/supabase';
import BookingModal from './BookingModal';

export default function EscortSection() {
  const [escorts, setEscorts] = useState<Escort[]>([]);
  const [selectedEscort, setSelectedEscort] = useState<Escort | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('EscortSection mounted');
    loadEscorts();
  }, []);

  const loadEscorts = async () => {
    try {
      console.log('Loading escorts...');
      const { data, error } = await supabase
        .from('escorts')
        .select('*')
        .order('rating', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      console.log('Escorts loaded:', data);
      setEscorts(data || []);
    } catch (error) {
      console.error('Error loading escorts:', error);
      setError('Ошибка загрузки данных. Проверьте подключение к базе данных.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              loadEscorts();
            }}
            className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (escorts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-slate-300 text-xl">
          <p>Нет доступных эскортов</p>
          <p className="text-sm text-slate-400 mt-2">База данных пуста</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mb-4">
            Премиум Эскорт
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Элитные спутницы для незабываемого времяпрепровождения
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {escorts.map((escort) => (
            <div
              key={escort.id}
              className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 border border-slate-700 hover:border-amber-500/50 hover:-translate-y-2"
            >
              <div className="relative h-80 overflow-hidden bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
                <div className="text-9xl">👤</div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

                {escort.available ? (
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    Доступна
                  </div>
                ) : (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    Занята
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span className="text-white font-bold text-lg">{escort.rating.toFixed(1)}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{escort.name}</h3>
                  <p className="text-slate-300 text-sm">{escort.age} лет</p>
                </div>
              </div>

              <div className="p-6">
                <p className="text-slate-300 mb-4 line-clamp-2">{escort.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Clock className="w-5 h-5" />
                    <span className="text-sm">1 час</span>
                  </div>
                  <div className="text-2xl font-bold text-amber-400">
                    {escort.price.toLocaleString('ru-RU')} ₽
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEscort(escort)}
                  disabled={!escort.available}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    escort.available
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 hover:shadow-lg hover:shadow-amber-500/50'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {escort.available ? 'Забронировать' : 'Недоступна'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedEscort && (
        <BookingModal
          escort={selectedEscort}
          onClose={() => setSelectedEscort(null)}
        />
      )}
    </div>
  );
}
