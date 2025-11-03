import { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, Zap } from 'lucide-react';

interface BananzaSlotsGameProps {
  onClose: () => void;
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const symbols = [
  { emoji: '🍌', name: 'Банан', multiplier: 2, color: '#FFD700' },
  { emoji: '🍇', name: 'Виноград', multiplier: 3, color: '#9370DB' },
  { emoji: '🍊', name: 'Апельсин', multiplier: 4, color: '#FF8C00' },
  { emoji: '🍉', name: 'Арбуз', multiplier: 5, color: '#FF1493' },
  { emoji: '🍓', name: 'Клубника', multiplier: 6, color: '#DC143C' },
  { emoji: '⭐', name: 'Звезда', multiplier: 10, color: '#FFD700' },
  { emoji: '💎', name: 'Алмаз', multiplier: 15, color: '#00CED1' },
  { emoji: '7️⃣', name: 'Семерка', multiplier: 50, color: '#FF0000' },
];

export default function BananzaSlotsGame({ onClose, balance, onBalanceChange }: BananzaSlotsGameProps) {
  const [reels, setReels] = useState([
    [symbols[0], symbols[1], symbols[2]],
    [symbols[1], symbols[2], symbols[3]],
    [symbols[2], symbols[3], symbols[4]],
    [symbols[3], symbols[4], symbols[5]],
    [symbols[4], symbols[5], symbols[0]],
  ]);
  const [spinning, setSpinning] = useState(false);
  const [bet, setBet] = useState(100);
  const [autoPlay, setAutoPlay] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [winAmount, setWinAmount] = useState(0);
  const [winLines, setWinLines] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const [totalWins, setTotalWins] = useState(0);
  const [spinCount, setSpinCount] = useState(0);

  useEffect(() => {
    if (autoPlay && !spinning && balance >= bet) {
      const timer = setTimeout(() => spin(), 1000);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, spinning, balance, bet]);

  const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

  const spin = async () => {
    if (bet > balance) {
      setMessage('❌ Недостаточно средств!');
      setAutoPlay(false);
      return;
    }

    setSpinning(true);
    setWinAmount(0);
    setWinLines([]);
    setMessage('');
    onBalanceChange(balance - bet);
    setSpinCount(spinCount + 1);

    // Анимация вращения
    const spinDuration = 2000;
    const spinInterval = 50;
    let elapsed = 0;

    const interval = setInterval(() => {
      setReels(prev => prev.map(reel => 
        reel.map(() => getRandomSymbol())
      ));
      elapsed += spinInterval;

      if (elapsed >= spinDuration) {
        clearInterval(interval);
        finalizeSpin();
      }
    }, spinInterval);
  };

  const finalizeSpin = () => {
    // Генерируем финальные барабаны
    const finalReels = Array(5).fill(null).map(() => 
      Array(3).fill(null).map(() => getRandomSymbol())
    );
    
    setReels(finalReels);
    setSpinning(false);
    
    // Проверяем выигрыши
    checkWins(finalReels);
  };

  const checkWins = (finalReels: typeof reels) => {
    let totalWin = 0;
    const winningLines: number[] = [];

    // Проверяем 5 линий выплат
    const lines = [
      [1, 1, 1, 1, 1], // Средняя линия
      [0, 0, 0, 0, 0], // Верхняя линия
      [2, 2, 2, 2, 2], // Нижняя линия
      [0, 1, 2, 1, 0], // V-образная
      [2, 1, 0, 1, 2], // Λ-образная
    ];

    lines.forEach((line, lineIndex) => {
      const lineSymbols = line.map((row, col) => finalReels[col][row]);
      const firstSymbol = lineSymbols[0];
      
      // Подсчитываем совпадения с начала
      let matchCount = 1;
      for (let i = 1; i < lineSymbols.length; i++) {
        if (lineSymbols[i].emoji === firstSymbol.emoji) {
          matchCount++;
        } else {
          break;
        }
      }

      // Минимум 3 совпадения для выигрыша
      if (matchCount >= 3) {
        const multiplier = firstSymbol.multiplier * matchCount;
        totalWin += bet * multiplier;
        winningLines.push(lineIndex);
      }
    });

    if (totalWin > 0) {
      setWinAmount(totalWin);
      setWinLines(winningLines);
      setTotalWins(totalWins + totalWin);
      onBalanceChange(balance + totalWin);
      setMessage(`🎉 ВЫИГРЫШ ${totalWin}₽! (x${Math.round(totalWin / bet)})`);
    } else {
      setMessage('Попробуйте еще раз!');
    }
  };

  const maxBet = () => {
    const maxPossible = Math.min(balance, 10000);
    setBet(maxPossible);
  };

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 rounded-3xl max-w-7xl w-full border-4 border-amber-500 shadow-2xl shadow-amber-500/50">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 p-4 rounded-t-2xl border-b-4 border-amber-600">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-black text-purple-900 drop-shadow-lg">🍌 BANANZA SLOTS</div>
              <div className="bg-purple-900 px-4 py-2 rounded-lg">
                <div className="text-amber-400 text-sm font-bold">БАЛАНС</div>
                <div className="text-white text-2xl font-black">{balance.toLocaleString('ru-RU')} ₽</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundOn(!soundOn)}
                className="p-3 bg-purple-900 hover:bg-purple-800 rounded-lg transition-all"
              >
                {soundOn ? <Volume2 className="w-6 h-6 text-amber-400" /> : <VolumeX className="w-6 h-6 text-slate-400" />}
              </button>
              <button
                onClick={onClose}
                className="p-3 bg-red-600 hover:bg-red-700 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-4 text-center">
              <div className="text-green-200 text-sm font-bold">ВСЕГО ВЫИГРЫШЕЙ</div>
              <div className="text-white text-3xl font-black">{totalWins.toLocaleString('ru-RU')} ₽</div>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 text-center">
              <div className="text-blue-200 text-sm font-bold">СПИНОВ</div>
              <div className="text-white text-3xl font-black">{spinCount}</div>
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-4 text-center">
              <div className="text-purple-200 text-sm font-bold">ПОСЛЕДНИЙ ВЫИГРЫШ</div>
              <div className="text-white text-3xl font-black">{winAmount.toLocaleString('ru-RU')} ₽</div>
            </div>
          </div>

          {/* Slot Machine */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl p-8 mb-6 border-4 border-amber-500 shadow-inner">
            {/* Win Lines Indicator */}
            <div className="flex justify-center gap-2 mb-4">
              {[0, 1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold transition-all ${
                    winLines.includes(i)
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-purple-900 scale-110 animate-pulse'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Reels */}
            <div className="flex justify-center gap-3 mb-6">
              {reels.map((reel, reelIndex) => (
                <div key={reelIndex} className="flex flex-col gap-2">
                  {reel.map((symbol, symbolIndex) => (
                    <div
                      key={symbolIndex}
                      className={`w-32 h-32 rounded-xl flex items-center justify-center text-7xl transition-all duration-100 ${
                        spinning
                          ? 'bg-gradient-to-br from-purple-600 to-pink-600 animate-pulse'
                          : 'bg-gradient-to-br from-slate-700 to-slate-800 hover:scale-105'
                      } border-4 border-amber-500/50 shadow-lg`}
                      style={{
                        boxShadow: spinning ? `0 0 30px ${symbol.color}` : 'none'
                      }}
                    >
                      {symbol.emoji}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Message */}
            {message && (
              <div className={`text-center text-3xl font-black mb-4 animate-bounce ${
                message.includes('ВЫИГРЫШ') ? 'text-amber-400' : 'text-slate-400'
              }`}>
                {message}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bet Controls */}
            <div className="bg-slate-800 rounded-xl p-6">
              <div className="text-amber-400 font-bold text-xl mb-4">💰 СТАВКА</div>
              <div className="text-white text-4xl font-black mb-4 text-center">{bet.toLocaleString('ru-RU')} ₽</div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[50, 100, 500, 1000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setBet(amount)}
                    disabled={spinning}
                    className={`py-3 rounded-lg font-bold transition-all ${
                      bet === amount
                        ? 'bg-amber-500 text-white scale-105'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    } disabled:opacity-50`}
                  >
                    {amount}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setBet(Math.max(50, bet - 50))}
                  disabled={spinning}
                  className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold disabled:opacity-50"
                >
                  - 50
                </button>
                <button
                  onClick={() => setBet(Math.min(balance, bet + 50))}
                  disabled={spinning}
                  className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold disabled:opacity-50"
                >
                  + 50
                </button>
              </div>
              <button
                onClick={maxBet}
                disabled={spinning}
                className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold disabled:opacity-50"
              >
                MAX BET
              </button>
            </div>

            {/* Spin Controls */}
            <div className="bg-slate-800 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <div className="text-amber-400 font-bold text-xl mb-4">🎮 УПРАВЛЕНИЕ</div>
                <button
                  onClick={spin}
                  disabled={spinning || bet > balance}
                  className="w-full py-8 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-purple-900 rounded-xl font-black text-3xl hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-amber-500/50 mb-4 relative overflow-hidden"
                >
                  {spinning ? (
                    <span className="flex items-center justify-center gap-2">
                      <Zap className="w-8 h-8 animate-spin" />
                      КРУТИМ...
                    </span>
                  ) : (
                    '🎰 КРУТИТЬ'
                  )}
                </button>
              </div>

              <button
                onClick={() => setAutoPlay(!autoPlay)}
                disabled={spinning || bet > balance}
                className={`w-full py-4 rounded-xl font-bold text-xl transition-all ${
                  autoPlay
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } disabled:opacity-50`}
              >
                {autoPlay ? '⏸️ СТОП АВТО' : '▶️ АВТО ИГРА'}
              </button>
            </div>
          </div>

          {/* Paytable */}
          <div className="mt-6 bg-slate-800 rounded-xl p-6">
            <div className="text-amber-400 font-bold text-xl mb-4">💎 ТАБЛИЦА ВЫПЛАТ</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {symbols.map((symbol, i) => (
                <div key={i} className="bg-slate-700 rounded-lg p-3 text-center">
                  <div className="text-4xl mb-2">{symbol.emoji}</div>
                  <div className="text-white font-bold text-sm">{symbol.name}</div>
                  <div className="text-amber-400 font-bold">x{symbol.multiplier}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-slate-400 text-sm text-center">
              Минимум 3 одинаковых символа подряд для выигрыша • 5 линий выплат
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
