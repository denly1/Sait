import { useState } from 'react';
import { X, Gift } from 'lucide-react';

interface PrizeWheelProps {
  onClose: () => void;
  onPrizeWon: (prize: string) => void;
}

const prizes = [
  { name: '10% скидка', color: '#ef4444', value: 'discount_10' },
  { name: '1 шар', color: '#f59e0b', value: 'balloon_1' },
  { name: '20% скидка', color: '#10b981', value: 'discount_20' },
  { name: '3 шара', color: '#3b82f6', value: 'balloon_3' },
  { name: '30% скидка', color: '#8b5cf6', value: 'discount_30' },
  { name: '5 шаров', color: '#ec4899', value: 'balloon_5' },
  { name: '50% скидка', color: '#f97316', value: 'discount_50' },
  { name: 'Джекпот!', color: '#fbbf24', value: 'jackpot' },
];

export default function PrizeWheel({ onClose, onPrizeWon }: PrizeWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<string | null>(null);
  const [canSpin, setCanSpin] = useState(true);

  const spin = () => {
    if (!canSpin || spinning) return;

    setSpinning(true);
    setWonPrize(null);
    
    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const baseRotation = 360 * 5;
    const prizeRotation = (360 / prizes.length) * prizeIndex;
    const finalRotation = rotation + baseRotation + prizeRotation;
    
    setRotation(finalRotation);

    setTimeout(() => {
      setSpinning(false);
      setWonPrize(prizes[prizeIndex].name);
      onPrizeWon(prizes[prizeIndex].value);
      setCanSpin(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-2xl w-full p-8 border border-amber-500/30">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-amber-400 flex items-center gap-2">
              <Gift className="w-8 h-8" />
              Колесо Фортуны
            </h2>
            <p className="text-slate-400">Крутите и выигрывайте призы!</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="relative flex justify-center items-center mb-8">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-10">
            <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-amber-500"></div>
          </div>
          
          <div 
            className="w-96 h-96 rounded-full relative overflow-hidden border-8 border-amber-500 shadow-2xl"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
            }}
          >
            {prizes.map((prize, i) => (
              <div
                key={i}
                className="absolute w-full h-full"
                style={{
                  transform: `rotate(${(360 / prizes.length) * i}deg)`,
                  clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%)',
                  transformOrigin: 'center',
                }}
              >
                <div 
                  className="w-full h-full flex items-start justify-center pt-8"
                  style={{ backgroundColor: prize.color }}
                >
                  <span 
                    className="text-white font-bold text-sm transform -rotate-45"
                    style={{ transform: `rotate(${22.5}deg)` }}
                  >
                    {prize.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {wonPrize && (
          <div className="text-center mb-6 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-xl p-6 border border-amber-500/50">
            <div className="text-3xl font-bold text-amber-400 mb-2">🎉 Поздравляем!</div>
            <div className="text-2xl text-white">Вы выиграли: {wonPrize}</div>
          </div>
        )}

        <button
          onClick={spin}
          disabled={!canSpin || spinning}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold text-xl hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-amber-500/50"
        >
          {spinning ? 'Крутится...' : canSpin ? 'Крутить колесо!' : 'Использовано'}
        </button>

        {!canSpin && !spinning && (
          <p className="text-center text-slate-400 mt-4 text-sm">
            Вы уже использовали свою попытку. Приходите завтра!
          </p>
        )}
      </div>
    </div>
  );
}
