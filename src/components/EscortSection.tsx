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
        .eq('available', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      
      // Если база пуста, используем тестовые данные
      if (!data || data.length === 0) {
        const testEscorts = [
          {
            id: '1',
            name: 'Анастасия',
            age: 23,
            description: 'Элегантная и утонченная спутница для особых мероприятий',
            price: 5000,
            rating: 4.9,
            available: true,
            image_url: ''
          },
          {
            id: '2',
            name: 'Виктория',
            age: 25,
            description: 'Профессиональная модель с безупречными манерами',
            price: 6000,
            rating: 4.8,
            available: true,
            image_url: ''
          },
          {
            id: '3',
            name: 'Екатерина',
            age: 22,
            description: 'Яркая и общительная, создаст незабываемую атмосферу',
            price: 7000,
            rating: 5.0,
            available: true,
            image_url: ''
          },
          {
            id: '4',
            name: 'Мария',
            age: 24,
            description: 'Интеллигентная собеседница для деловых встреч',
            price: 8000,
            rating: 4.7,
            available: false,
            image_url: ''
          },
          {
            id: '5',
            name: 'Ольга VIP',
            age: 26,
            description: 'Премиум-класс. Эксклюзивное сопровождение',
            price: 12000,
            rating: 5.0,
            available: true,
            image_url: ''
          },
        ];
        setEscorts(testEscorts as any);
      } else {
        setEscorts(data || []);
      }
    } catch (error) {
      console.error('Error loading escorts:', error);
      // В случае ошибки также используем тестовые данные
      const testEscorts = [
        {
          id: '1',
          name: 'Анастасия',
          age: 23,
          description: 'Элегантная и утонченная спутница для особых мероприятий',
          price: 5000,
          rating: 4.9,
          available: true,
          image_url: ''
        },
        {
          id: '2',
          name: 'Виктория',
          age: 25,
          description: 'Профессиональная модель с безупречными манерами',
          price: 6000,
          rating: 4.8,
          available: true,
          image_url: ''
        },
        {
          id: '3',
          name: 'Екатерина',
          age: 22,
          description: 'Яркая и общительная, создаст незабываемую атмосферу',
          price: 7000,
          rating: 5.0,
          available: true,
          image_url: ''
        },
      ];
      setEscorts(testEscorts as any);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-14 sm:py-18 lg:py-24 px-3 sm:px-4 pb-28">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mb-3 sm:mb-4">
            Премиум Эскорт
          </h2>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-slate-300 max-w-2xl mx-auto px-2 sm:px-4">
            Элитные спутницы для незабываемого времяпрепровождения
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {escorts.map((escort) => (
            <div
              key={escort.id}
              className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 border border-slate-700 hover:border-amber-500/50 active:scale-98"
            >
              <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
                <div className="text-7xl sm:text-8xl lg:text-9xl">👤</div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

                {escort.available ? (
                  <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 bg-green-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg">
                    <span className="hidden sm:inline">Доступна</span>
                    <span className="sm:hidden">✓</span>
                  </div>
                ) : (
                  <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg">
                    <span className="hidden sm:inline">Занята</span>
                    <span className="sm:hidden">✗</span>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400" />
                    <span className="text-white font-bold text-base sm:text-lg">{escort.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 lg:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{escort.name}</h3>
                <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4 line-clamp-2">{escort.description}</p>
                
                <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2 text-slate-300 text-xs sm:text-sm">
                    <span className="text-amber-400">•</span>
                    <span>Возраст: {escort.age} лет</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-400">
                    {escort.price.toLocaleString('ru-RU')} ₽<span className="text-sm sm:text-base">/час</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEscort(escort)}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base hover:from-amber-600 hover:to-amber-700 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
                  disabled={!escort.available}
                >
                  Забронировать
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
