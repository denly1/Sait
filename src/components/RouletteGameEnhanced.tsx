import { useState } from 'react';
import { X, Coins } from 'lucide-react';

interface RouletteGameEnhancedProps {
  onClose: () => void;
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const numbers = Array.from({ length: 37 }, (_, i) => ({
  value: i,
  color: i === 0 ? 'green' : [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(i) ? 'red' : 'black'
}));

export default function RouletteGameEnhanced({ onClose, balance, onBalanceChange }: RouletteGameEnhancedProps) {
  const [bet, setBet] = useState(100);
  const [bets, setBets] = useState<{ type: string; amount: number; label: string }[]>([]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [message, setMessage] = useState('');

  const placeBet = (type: string, label: string) => {
    const totalBets = bets.reduce((sum, b) => sum + b.amount, 0);
    if (bet + totalBets > balance) {
      setMessage('❌ Недостаточно средств!');
      return;
    }
    setBets([...bets, { type, amount: bet, label }]);
    setMessage(`✅ Ставка ${bet}₽ на ${label}`);
  };

  const clearBets = () => {
    setBets([]);
    setMessage('');
  };

  const spin = () => {
    if (bets.length === 0) {
      setMessage('❌ Сделайте ставку!');
      return;
    }

    const totalBet = bets.reduce((sum, b) => sum + b.amount, 0);
    onBalanceChange(balance - totalBet);
    
    setSpinning(true);
    setMessage('🎰 Крутим...');
    
    const winningNumber = Math.floor(Math.random() * 37);
    
    setTimeout(() => {
      setResult(winningNumber);
      setHistory([winningNumber, ...history.slice(0, 9)]);
      setSpinning(false);
      calculateWinnings(winningNumber);
    }, 3000);
  };

  const calculateWinnings = (winningNumber: number) => {
    let totalWin = 0;
    const winningColor = numbers.find(n => n.value === winningNumber)?.color;
    const wins: string[] = [];

    bets.forEach(bet => {
      if (bet.type === `number-${winningNumber}`) {
        totalWin += bet.amount * 36;
        wins.push(`${bet.label} (x36)`);
      } else if (bet.type === winningColor) {
        totalWin += bet.amount * 2;
        wins.push(`${bet.label} (x2)`);
      } else if (bet.type === 'even' && winningNumber % 2 === 0 && winningNumber !== 0) {
        totalWin += bet.amount * 2;
        wins.push(`${bet.label} (x2)`);
      } else if (bet.type === 'odd' && winningNumber % 2 === 1) {
        totalWin += bet.amount * 2;
        wins.push(`${bet.label} (x2)`);
      } else if (bet.type === 'low' && winningNumber >= 1 && winningNumber <= 18) {
        totalWin += bet.amount * 2;
        wins.push(`${bet.label} (x2)`);
      } else if (bet.type === 'high' && winningNumber >= 19 && winningNumber <= 36) {
        totalWin += bet.amount * 2;
        wins.push(`${bet.label} (x2)`);
      }
    });

    if (totalWin > 0) {
      onBalanceChange(balance + totalWin);
      setMessage(`🎉 ВЫИГРЫШ ${totalWin}₽! ${wins.join(', ')}`);
    } else {
      setMessage('😢 Не повезло. Попробуйте еще!');
    }
    setBets([]);
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-green-900 to-green-950 rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto border border-amber-500/30">
        <div className="sticky top-0 bg-green-950/95 backdrop-blur-sm p-6 border-b border-amber-500/30 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-amber-400">🎰 Рулетка Pro</h2>
            <div className="flex items-center gap-4 mt-2">
              <div className="text-slate-300">Баланс: <span className="text-amber-400 font-bold">{balance}₽</span></div>
              <div className="text-slate-300">Ставок: <span className="text-blue-400 font-bold">{bets.length}</span></div>
              <div className="text-slate-300">Сумма: <span className="text-green-400 font-bold">{bets.reduce((s, b) => s + b.amount, 0)}₽</span></div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="p-6">
          {/* История */}
          {history.length > 0 && (
            <div className="mb-6 bg-slate-900/50 rounded-xl p-4">
              <div className="text-white font-bold mb-2">📊 История (последние 10)</div>
              <div className="flex gap-2 flex-wrap">
                {history.map((num, i) => {
                  const color = numbers.find(n => n.value === num)?.color;
                  return (
                    <div
                      key={i}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        color === 'red' ? 'bg-red-600' : color === 'black' ? 'bg-black' : 'bg-green-600'
                      }`}
                    >
                      {num}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Результат */}
          {result !== null && (
            <div className="mb-6 text-center bg-gradient-to-r from-amber-500/20 to-red-500/20 rounded-xl p-6 border border-amber-500/50">
              <div className="text-5xl font-bold text-amber-400 mb-2">Выпало: {result}</div>
              <div className={`text-2xl font-bold ${message.includes('ВЫИГРЫШ') ? 'text-green-400' : 'text-slate-400'}`}>
                {message}
              </div>
            </div>
          )}

          {/* Размер ставки */}
          <div className="mb-6 bg-slate-900/50 rounded-xl p-4">
            <div className="text-white font-bold mb-3">💰 Размер ставки</div>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {[50, 100, 500, 1000, 2000, 5000, 10000, 25000].map(amount => (
                <button
                  key={amount}
                  onClick={() => setBet(amount)}
                  disabled={spinning}
                  className={`px-4 py-3 rounded-lg font-bold transition-all ${
                    bet === amount
                      ? 'bg-amber-500 text-white scale-105'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  } disabled:opacity-50`}
                >
                  {amount}
                </button>
              ))}
            </div>
          </div>

          {/* Активные ставки */}
          {bets.length > 0 && (
            <div className="mb-6 bg-blue-900/30 rounded-xl p-4 border border-blue-500/30">
              <div className="flex justify-between items-center mb-3">
                <div className="text-white font-bold">🎯 Ваши ставки</div>
                <button
                  onClick={clearBets}
                  disabled={spinning}
                  className="text-red-400 hover:text-red-300 text-sm disabled:opacity-50"
                >
                  Очистить все
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {bets.map((bet, i) => (
                  <div key={i} className="bg-slate-700 rounded-lg px-3 py-2 text-sm">
                    <span className="text-white font-bold">{bet.label}</span>
                    <span className="text-amber-400 ml-2">{bet.amount}₽</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Поле для ставок */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Числа */}
            <div className="bg-slate-900/50 rounded-xl p-4">
              <div className="text-white font-bold mb-3">🔢 Числа (x36)</div>
              <div className="grid grid-cols-6 gap-1">
                {numbers.slice(1).map((num) => (
                  <button
                    key={num.value}
                    onClick={() => placeBet(`number-${num.value}`, `${num.value}`)}
                    disabled={spinning}
                    className={`h-12 rounded-lg font-bold text-white transition-all hover:scale-105 disabled:opacity-50 ${
                      num.color === 'red' ? 'bg-red-600 hover:bg-red-700' : 'bg-black hover:bg-gray-800'
                    }`}
                  >
                    {num.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Простые ставки */}
            <div className="space-y-3">
              <div className="bg-slate-900/50 rounded-xl p-4">
                <div className="text-white font-bold mb-3">🎨 Цвета (x2)</div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => placeBet('red', 'Красное')}
                    disabled={spinning}
                    className="bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold transition-all disabled:opacity-50"
                  >
                    Красное
                  </button>
                  <button
                    onClick={() => placeBet('black', 'Черное')}
                    disabled={spinning}
                    className="bg-black hover:bg-gray-800 text-white py-4 rounded-lg font-bold transition-all disabled:opacity-50"
                  >
                    Черное
                  </button>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-4">
                <div className="text-white font-bold mb-3">⚖️ Четность (x2)</div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => placeBet('even', 'Четное')}
                    disabled={spinning}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold transition-all disabled:opacity-50"
                  >
                    Четное
                  </button>
                  <button
                    onClick={() => placeBet('odd', 'Нечетное')}
                    disabled={spinning}
                    className="bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-lg font-bold transition-all disabled:opacity-50"
                  >
                    Нечетное
                  </button>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-4">
                <div className="text-white font-bold mb-3">📊 Диапазоны (x2)</div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => placeBet('low', '1-18')}
                    disabled={spinning}
                    className="bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold transition-all disabled:opacity-50"
                  >
                    1-18
                  </button>
                  <button
                    onClick={() => placeBet('high', '19-36')}
                    disabled={spinning}
                    className="bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-lg font-bold transition-all disabled:opacity-50"
                  >
                    19-36
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Кнопка крутить */}
          <button
            onClick={spin}
            disabled={spinning || bets.length === 0}
            className="w-full py-5 bg-gradient-to-r from-amber-500 to-red-500 text-white rounded-xl font-bold text-2xl hover:from-amber-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-amber-500/50"
          >
            {spinning ? '🎰 Крутим...' : bets.length === 0 ? 'Сделайте ставку' : `🎲 КРУТИТЬ (${bets.reduce((s, b) => s + b.amount, 0)}₽)`}
          </button>
        </div>
      </div>
    </div>
  );
}
