import { useState } from 'react';
import { Play, Gift, Sparkles } from 'lucide-react';

const prizes = [
  { id: 1, emoji: '🎈', name: 'Баллон 2L', value: 1500 },
  { id: 2, emoji: '🧴', name: 'Поперс', value: 800 },
  { id: 3, emoji: '🔇', name: 'Глушитель', value: 1200 },
  { id: 4, emoji: '📱', name: 'Чехол', value: 500 },
  { id: 5, emoji: '👕', name: 'Футболка', value: 1000 },
  { id: 6, emoji: '🎯', name: 'Стикеры', value: 300 },
  { id: 7, emoji: '💎', name: 'Премиум пакет', value: 5000 },
];

export default function ProductSlot() {
  const [spinning, setSpinning] = useState(false);
  const [slots, setSlots] = useState([prizes[0], prizes[1], prizes[2]]);
  const [prize, setPrize] = useState<typeof prizes[0] | null>(null);
  const [balance, setBalance] = useState(10000);

  const spin = () => {
    if (spinning || balance < 500) return;
    
    setSpinning(true);
    setBalance(balance - 500);
    setPrize(null);

    // Анимация вращения
    const interval = setInterval(() => {
      setSlots([
        prizes[Math.floor(Math.random() * prizes.length)],
        prizes[Math.floor(Math.random() * prizes.length)],
        prizes[Math.floor(Math.random() * prizes.length)],
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      
      // Определяем выигрыш
      const finalSlots = [
        prizes[Math.floor(Math.random() * prizes.length)],
        prizes[Math.floor(Math.random() * prizes.length)],
        prizes[Math.floor(Math.random() * prizes.length)],
      ];
      
      setSlots(finalSlots);
      
      // Проверка на выигрыш
      if (finalSlots[0].id === finalSlots[1].id && finalSlots[1].id === finalSlots[2].id) {
        setPrize(finalSlots[0]);
        setBalance(balance + finalSlots[0].value);
      }
      
      setSpinning(false);
    }, 3000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 sm:p-6 lg:p-8 border border-purple-500/30 shadow-2xl">
      <div className="text-center mb-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-purple-400 mb-2 flex items-center justify-center gap-2">
          <Gift className="w-6 h-6 sm:w-8 sm:h-8" />
          Слот с Товарами
        </h3>
        <p className="text-slate-400 text-sm sm:text-base">Выиграй крутые призы!</p>
        <div className="mt-4 bg-slate-800/50 rounded-xl px-4 py-2 inline-block">
          <span className="text-amber-400 font-bold text-lg sm:text-xl">
            Баланс: {balance.toLocaleString('ru-RU')} ₽
          </span>
        </div>
      </div>

      {/* Слоты */}
      <div className="flex justify-center gap-2 sm:gap-4 mb-6">
        {slots.map((slot, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 flex items-center justify-center border-4 border-purple-400/50 shadow-lg ${
              spinning ? 'animate-pulse' : ''
            }`}
          >
            <span className="text-4xl sm:text-5xl lg:text-6xl">{slot.emoji}</span>
          </div>
        ))}
      </div>

      {/* Результат */}
      {prize && (
        <div className="mb-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-xl p-4 animate-pulse">
          <div className="text-center">
            <Sparkles className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-green-400 font-bold text-lg sm:text-xl mb-1">
              🎉 Поздравляем! 🎉
            </p>
            <p className="text-white text-base sm:text-lg">
              Вы выиграли: {prize.emoji} {prize.name}
            </p>
            <p className="text-green-400 font-semibold mt-1">
              +{prize.value.toLocaleString('ru-RU')} ₽
            </p>
          </div>
        </div>
      )}

      {/* Кнопка */}
      <button
        onClick={spin}
        disabled={spinning || balance < 500}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 shadow-lg hover:shadow-purple-500/50"
      >
        <Play className="w-5 h-5 sm:w-6 sm:h-6" />
        <span>{spinning ? 'Крутим...' : 'Крутить (500 ₽)'}</span>
      </button>

      {balance < 500 && (
        <p className="text-red-400 text-center mt-3 text-sm">
          Недостаточно средств для игры
        </p>
      )}

      {/* Таблица призов */}
      <div className="mt-6 bg-slate-800/30 rounded-xl p-4 border border-slate-700">
        <h4 className="text-slate-300 font-semibold mb-3 text-sm sm:text-base">Призы:</h4>
        <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
          {prizes.map((prize) => (
            <div key={prize.id} className="flex items-center gap-2 text-slate-400">
              <span className="text-lg">{prize.emoji}</span>
              <span>{prize.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
