import { useState } from 'react';
import { Play, Zap, Trophy } from 'lucide-react';

const symbols = [
  { id: 1, emoji: '🎈', type: 'product', name: 'Баллон', value: 1000 },
  { id: 2, emoji: '💎', type: 'escort', name: 'VIP Эскорт', value: 5000 },
  { id: 3, emoji: '💰', type: 'money', name: 'Деньги', value: 3000 },
  { id: 4, emoji: '🎁', type: 'product', name: 'Подарок', value: 1500 },
  { id: 5, emoji: '👑', type: 'escort', name: 'Премиум', value: 7000 },
  { id: 6, emoji: '💸', type: 'money', name: 'Джекпот', value: 10000 },
  { id: 7, emoji: '🔥', type: 'bonus', name: 'Бонус', value: 2000 },
];

export default function ComboSlot() {
  const [spinning, setSpinning] = useState(false);
  const [slots, setSlots] = useState([symbols[0], symbols[1], symbols[2]]);
  const [result, setResult] = useState<{ win: boolean; prize?: typeof symbols[0]; multiplier?: number } | null>(null);
  const [balance, setBalance] = useState(15000);
  const [totalWins, setTotalWins] = useState(0);

  const spin = () => {
    if (spinning || balance < 1000) return;
    
    setSpinning(true);
    setBalance(balance - 1000);
    setResult(null);

    // Анимация вращения
    const interval = setInterval(() => {
      setSlots([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      
      // Определяем результат
      const finalSlots = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ];
      
      setSlots(finalSlots);
      
      // Проверка выигрыша
      if (finalSlots[0].id === finalSlots[1].id && finalSlots[1].id === finalSlots[2].id) {
        // Три одинаковых
        const winAmount = finalSlots[0].value * 3;
        setBalance(prev => prev + winAmount);
        setTotalWins(prev => prev + winAmount);
        setResult({ win: true, prize: finalSlots[0], multiplier: 3 });
      } else if (finalSlots[0].type === finalSlots[1].type && finalSlots[1].type === finalSlots[2].type) {
        // Три одного типа
        const winAmount = Math.max(...finalSlots.map(s => s.value)) * 2;
        setBalance(prev => prev + winAmount);
        setTotalWins(prev => prev + winAmount);
        setResult({ win: true, prize: finalSlots[0], multiplier: 2 });
      } else if (finalSlots[0].id === finalSlots[1].id || finalSlots[1].id === finalSlots[2].id || finalSlots[0].id === finalSlots[2].id) {
        // Два одинаковых
        const matchedSymbol = finalSlots[0].id === finalSlots[1].id ? finalSlots[0] : 
                             finalSlots[1].id === finalSlots[2].id ? finalSlots[1] : finalSlots[0];
        const winAmount = matchedSymbol.value;
        setBalance(prev => prev + winAmount);
        setTotalWins(prev => prev + winAmount);
        setResult({ win: true, prize: matchedSymbol, multiplier: 1 });
      } else {
        setResult({ win: false });
      }
      
      setSpinning(false);
    }, 3000);
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 sm:p-6 lg:p-8 border border-amber-500/30 shadow-2xl">
      <div className="text-center mb-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-amber-400 mb-2 flex items-center justify-center gap-2">
          <Zap className="w-6 h-6 sm:w-8 sm:h-8" />
          Комбо Слот 3в1
        </h3>
        <p className="text-slate-400 text-sm sm:text-base">Товары + Эскорт + Деньги в одной игре!</p>
        
        <div className="mt-4 flex justify-center gap-4 flex-wrap">
          <div className="bg-slate-800/50 rounded-xl px-4 py-2">
            <span className="text-amber-400 font-bold text-base sm:text-lg">
              Баланс: {balance.toLocaleString('ru-RU')} ₽
            </span>
          </div>
          <div className="bg-slate-800/50 rounded-xl px-4 py-2">
            <span className="text-green-400 font-bold text-base sm:text-lg">
              Выигрыш: {totalWins.toLocaleString('ru-RU')} ₽
            </span>
          </div>
        </div>
      </div>

      {/* Слоты */}
      <div className="flex justify-center gap-2 sm:gap-4 mb-6">
        {slots.map((slot, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br from-amber-600 to-orange-800 rounded-2xl w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 flex items-center justify-center border-4 border-amber-400/50 shadow-lg ${
              spinning ? 'animate-spin' : ''
            }`}
          >
            <span className="text-4xl sm:text-5xl lg:text-6xl">{slot.emoji}</span>
          </div>
        ))}
      </div>

      {/* Результат */}
      {result && (
        <div className={`mb-6 rounded-xl p-4 border ${
          result.win 
            ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50 animate-pulse' 
            : 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-500/50'
        }`}>
          <div className="text-center">
            {result.win ? (
              <>
                <Trophy className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-green-400 font-bold text-lg sm:text-xl mb-1">
                  🎊 Выигрыш! 🎊
                </p>
                <p className="text-white text-base sm:text-lg">
                  {result.prize?.emoji} {result.prize?.name}
                </p>
                <p className="text-green-400 font-semibold mt-1">
                  x{result.multiplier} = +{((result.prize?.value || 0) * (result.multiplier || 1)).toLocaleString('ru-RU')} ₽
                </p>
              </>
            ) : (
              <>
                <p className="text-red-400 font-bold text-lg">
                  Не повезло 😔
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Попробуйте еще раз!
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Кнопка */}
      <button
        onClick={spin}
        disabled={spinning || balance < 1000}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 shadow-lg hover:shadow-amber-500/50"
      >
        <Play className="w-5 h-5 sm:w-6 sm:h-6" />
        <span>{spinning ? 'Крутим...' : 'Крутить (1000 ₽)'}</span>
      </button>

      {balance < 1000 && (
        <p className="text-red-400 text-center mt-3 text-sm">
          Недостаточно средств для игры
        </p>
      )}

      {/* Правила */}
      <div className="mt-6 bg-slate-800/30 rounded-xl p-4 border border-slate-700">
        <h4 className="text-slate-300 font-semibold mb-3 text-sm sm:text-base">Выигрыши:</h4>
        <div className="space-y-2 text-xs sm:text-sm text-slate-400">
          <div className="flex justify-between">
            <span>🎯 Три одинаковых символа:</span>
            <span className="text-green-400 font-semibold">x3</span>
          </div>
          <div className="flex justify-between">
            <span>🎲 Три символа одного типа:</span>
            <span className="text-green-400 font-semibold">x2</span>
          </div>
          <div className="flex justify-between">
            <span>🎪 Два одинаковых символа:</span>
            <span className="text-green-400 font-semibold">x1</span>
          </div>
        </div>
      </div>

      {/* Символы */}
      <div className="mt-4 bg-slate-800/30 rounded-xl p-4 border border-slate-700">
        <h4 className="text-slate-300 font-semibold mb-3 text-sm sm:text-base">Символы:</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
          {symbols.map((symbol) => (
            <div key={symbol.id} className="flex items-center gap-2 text-slate-400">
              <span className="text-lg">{symbol.emoji}</span>
              <span>{symbol.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
