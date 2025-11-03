import { useState } from 'react';
import { X } from 'lucide-react';

interface SlotsGameProps {
  onClose: () => void;
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const symbols = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '7️⃣'];

export default function SlotsGame({ onClose, balance, onBalanceChange }: SlotsGameProps) {
  const [reels, setReels] = useState(['🍒', '🍋', '🍊']);
  const [spinning, setSpinning] = useState(false);
  const [bet] = useState(100);
  const [message, setMessage] = useState('');

  const spin = () => {
    if (bet > balance) {
      setMessage('Недостаточно средств!');
      return;
    }

    setSpinning(true);
    onBalanceChange(balance - bet);
    setMessage('');

    let counter = 0;
    const interval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ]);
      counter++;
      if (counter > 20) {
        clearInterval(interval);
        checkWin();
      }
    }, 100);
  };

  const checkWin = () => {
    setSpinning(false);
    const [r1, r2, r3] = reels;
    
    if (r1 === r2 && r2 === r3) {
      const winAmount = bet * 10;
      onBalanceChange(balance + winAmount);
      setMessage(`🎉 ДЖЕКПОТ! Выигрыш: ${winAmount}₽`);
    } else if (r1 === r2 || r2 === r3) {
      const winAmount = bet * 2;
      onBalanceChange(balance + winAmount);
      setMessage(`Выигрыш: ${winAmount}₽`);
    } else {
      setMessage('Попробуйте еще раз!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-2xl w-full p-8 border border-amber-500/30">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-amber-400">Слоты</h2>
            <p className="text-slate-400">Баланс: {balance}₽</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="bg-slate-900 rounded-xl p-8 mb-6">
          <div className="flex justify-center gap-4 mb-8">
            {reels.map((symbol, i) => (
              <div key={i} className="w-32 h-32 bg-slate-800 rounded-xl flex items-center justify-center text-6xl border-4 border-amber-500">
                {symbol}
              </div>
            ))}
          </div>

          {message && (
            <div className={`text-center text-2xl font-bold mb-4 ${message.includes('ДЖЕКПОТ') ? 'text-green-400' : message.includes('Выигрыш') ? 'text-amber-400' : 'text-slate-400'}`}>
              {message}
            </div>
          )}

          <button
            onClick={spin}
            disabled={spinning}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold text-xl hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {spinning ? 'Крутится...' : `Крутить (${bet}₽)`}
          </button>
        </div>
      </div>
    </div>
  );
}
