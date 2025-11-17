import { useState, useRef } from 'react';
import { X, Play, Trophy, Gift } from 'lucide-react';

interface Prize {
  id: number;
  name: string;
  emoji: string;
  value: number;
  color: string;
  probability: number;
}

const prizes: Prize[] = [
  { id: 1, name: 'Баллон 5L', emoji: '🎈', value: 3500, color: '#FF6B6B', probability: 15 },
  { id: 2, name: 'Скидка 50%', emoji: '💰', value: 0, color: '#4ECDC4', probability: 20 },
  { id: 3, name: 'Поперс', emoji: '🧴', value: 800, color: '#45B7D1', probability: 15 },
  { id: 4, name: 'Бесплатный час', emoji: '⏰', value: 5000, color: '#FFA07A', probability: 10 },
  { id: 5, name: 'Стикеры', emoji: '🎯', value: 300, color: '#98D8C8', probability: 20 },
  { id: 6, name: 'Джекпот!', emoji: '💎', value: 15000, color: '#FFD700', probability: 5 },
  { id: 7, name: 'Футболка', emoji: '👕', value: 1000, color: '#F7B731', probability: 15 },
];

interface WheelOfFortuneProps {
  onClose: () => void;
}

export default function WheelOfFortune({ onClose }: WheelOfFortuneProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<Prize | null>(null);
  const [spinsLeft, setSpinsLeft] = useState(3);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spinWheel = () => {
    if (spinning || spinsLeft <= 0) return;

    setSpinning(true);
    setWinner(null);
    setSpinsLeft(prev => prev - 1);

    // Выбираем победителя на основе вероятности
    const random = Math.random() * 100;
    let cumulative = 0;
    let selectedPrize = prizes[0];

    for (const prize of prizes) {
      cumulative += prize.probability;
      if (random <= cumulative) {
        selectedPrize = prize;
        break;
      }
    }

    // Вычисляем угол для выбранного приза
    const prizeIndex = prizes.indexOf(selectedPrize);
    const segmentAngle = 360 / prizes.length;
    const targetAngle = prizeIndex * segmentAngle;
    
    // Добавляем несколько полных оборотов + целевой угол
    const spins = 5 + Math.random() * 3;
    const finalRotation = rotation + (360 * spins) + (360 - targetAngle);

    setRotation(finalRotation);

    setTimeout(() => {
      setSpinning(false);
      setWinner(selectedPrize);
    }, 5000);
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-4xl w-full border border-amber-500/30 my-4 sm:my-8">
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm p-4 sm:p-6 border-b border-amber-500/30 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 flex items-center gap-2">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8" />
              Колесо Фортуны
            </h2>
            <p className="text-slate-400 text-sm">Крути и выигрывай призы!</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors active:scale-95">
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Счетчик попыток */}
          <div className="text-center mb-6">
            <div className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 rounded-full px-6 py-3 shadow-lg">
              <span className="text-white font-bold text-lg">
                Попыток осталось: {spinsLeft}
              </span>
            </div>
          </div>

          {/* Колесо */}
          <div className="relative max-w-lg mx-auto mb-6">
            {/* Указатель */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-red-500 drop-shadow-lg"></div>
            </div>

            {/* Само колесо */}
            <div className="relative">
              <div
                ref={wheelRef}
                className="relative w-full aspect-square rounded-full shadow-2xl border-8 border-amber-400"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                }}
              >
                {prizes.map((prize, index) => {
                  const angle = (360 / prizes.length) * index;
                  return (
                    <div
                      key={prize.id}
                      className="absolute w-full h-full"
                      style={{
                        transform: `rotate(${angle}deg)`,
                        clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin((2 * Math.PI) / prizes.length)}% ${50 - 50 * Math.cos((2 * Math.PI) / prizes.length)}%)`,
                        backgroundColor: prize.color,
                      }}
                    >
                      <div
                        className="absolute top-[15%] left-1/2 transform -translate-x-1/2 text-center"
                        style={{ transform: `translateX(-50%) rotate(${180 / prizes.length}deg)` }}
                      >
                        <div className="text-3xl sm:text-4xl mb-1">{prize.emoji}</div>
                        <div className="text-white font-bold text-xs sm:text-sm whitespace-nowrap">
                          {prize.name}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Центр колеса */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                  <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Результат */}
          {winner && !spinning && (
            <div className="mb-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-xl p-6 animate-pulse">
              <div className="text-center">
                <div className="text-6xl mb-3">{winner.emoji}</div>
                <p className="text-green-400 font-bold text-2xl mb-2">
                  🎉 Поздравляем! 🎉
                </p>
                <p className="text-white text-xl mb-2">
                  Вы выиграли: {winner.name}
                </p>
                {winner.value > 0 && (
                  <p className="text-green-400 font-semibold text-lg">
                    Стоимость: {winner.value.toLocaleString('ru-RU')} ₽
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Кнопка */}
          <button
            onClick={spinWheel}
            disabled={spinning || spinsLeft <= 0}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 shadow-lg hover:shadow-amber-500/50"
          >
            <Play className="w-6 h-6" />
            <span>{spinning ? 'Крутим...' : spinsLeft > 0 ? 'Крутить колесо!' : 'Попытки закончились'}</span>
          </button>

          {spinsLeft <= 0 && (
            <p className="text-center text-slate-400 mt-4">
              Попытки закончились. Приходите завтра!
            </p>
          )}

          {/* Список призов */}
          <div className="mt-6 bg-slate-800/30 rounded-xl p-4 border border-slate-700">
            <h4 className="text-slate-300 font-semibold mb-3 text-sm sm:text-base">Возможные призы:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {prizes.map((prize) => (
                <div key={prize.id} className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <div className="text-2xl mb-1">{prize.emoji}</div>
                  <div className="text-white text-xs font-medium">{prize.name}</div>
                  {prize.value > 0 && (
                    <div className="text-green-400 text-xs mt-1">
                      {prize.value.toLocaleString('ru-RU')} ₽
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
