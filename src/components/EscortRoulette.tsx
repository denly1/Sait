import { useState } from 'react';
import { Play, Heart, Sparkles } from 'lucide-react';

const escorts = [
  { id: 1, name: 'Анастасия', emoji: '👩‍🦰', price: 5000 },
  { id: 2, name: 'Виктория', emoji: '👱‍♀️', price: 6000 },
  { id: 3, name: 'Екатерина', emoji: '👩‍🦱', price: 7000 },
  { id: 4, name: 'Мария', emoji: '👩', price: 8000 },
  { id: 5, name: 'Ольга', emoji: '👸', price: 9000 },
  { id: 6, name: 'Премиум VIP', emoji: '💎', price: 15000 },
];

export default function EscortRoulette() {
  const [spinning, setSpinning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [winner, setWinner] = useState<typeof escorts[0] | null>(null);
  const [balance, setBalance] = useState(20000);

  const spin = () => {
    if (spinning || balance < 2000) return;
    
    setSpinning(true);
    setBalance(balance - 2000);
    setWinner(null);

    let counter = 0;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % escorts.length);
      counter++;
      
      if (counter > 30) {
        clearInterval(interval);
        const winnerIndex = Math.floor(Math.random() * escorts.length);
        setCurrentIndex(winnerIndex);
        setWinner(escorts[winnerIndex]);
        setSpinning(false);
      }
    }, 100);
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 sm:p-6 lg:p-8 border border-pink-500/30 shadow-2xl">
      <div className="text-center mb-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-pink-400 mb-2 flex items-center justify-center gap-2">
          <Heart className="w-6 h-6 sm:w-8 sm:h-8" />
          Рулетка Эскорт
        </h3>
        <p className="text-slate-400 text-sm sm:text-base">Выиграй встречу с девушкой мечты!</p>
        <div className="mt-4 bg-slate-800/50 rounded-xl px-4 py-2 inline-block">
          <span className="text-amber-400 font-bold text-lg sm:text-xl">
            Баланс: {balance.toLocaleString('ru-RU')} ₽
          </span>
        </div>
      </div>

      {/* Рулетка */}
      <div className="relative mb-6">
        <div className="bg-gradient-to-br from-pink-600 to-rose-800 rounded-2xl p-6 sm:p-8 border-4 border-pink-400/50 shadow-2xl">
          <div className="text-center">
            <div className={`text-6xl sm:text-7xl lg:text-8xl mb-4 ${spinning ? 'animate-bounce' : ''}`}>
              {escorts[currentIndex].emoji}
            </div>
            <h4 className="text-white text-xl sm:text-2xl font-bold mb-2">
              {escorts[currentIndex].name}
            </h4>
            <p className="text-pink-300 text-base sm:text-lg">
              Стоимость: {escorts[currentIndex].price.toLocaleString('ru-RU')} ₽/час
            </p>
          </div>
        </div>
        
        {/* Индикатор */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-amber-400"></div>
        </div>
      </div>

      {/* Результат */}
      {winner && !spinning && (
        <div className="mb-6 bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/50 rounded-xl p-4 animate-pulse">
          <div className="text-center">
            <Sparkles className="w-8 h-8 text-pink-400 mx-auto mb-2" />
            <p className="text-pink-400 font-bold text-lg sm:text-xl mb-1">
              💕 Поздравляем! 💕
            </p>
            <p className="text-white text-base sm:text-lg">
              Вы выиграли встречу с {winner.emoji} {winner.name}!
            </p>
            <p className="text-pink-400 font-semibold mt-1 text-sm">
              Бесплатный час (экономия {winner.price.toLocaleString('ru-RU')} ₽)
            </p>
          </div>
        </div>
      )}

      {/* Кнопка */}
      <button
        onClick={spin}
        disabled={spinning || balance < 2000}
        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 shadow-lg hover:shadow-pink-500/50"
      >
        <Play className="w-5 h-5 sm:w-6 sm:h-6" />
        <span>{spinning ? 'Крутим...' : 'Крутить (2000 ₽)'}</span>
      </button>

      {balance < 2000 && (
        <p className="text-red-400 text-center mt-3 text-sm">
          Недостаточно средств для игры
        </p>
      )}

      {/* Список участниц */}
      <div className="mt-6 bg-slate-800/30 rounded-xl p-4 border border-slate-700">
        <h4 className="text-slate-300 font-semibold mb-3 text-sm sm:text-base">Участницы:</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
          {escorts.map((escort) => (
            <div key={escort.id} className="flex items-center gap-2 text-slate-400">
              <span className="text-lg">{escort.emoji}</span>
              <span>{escort.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
