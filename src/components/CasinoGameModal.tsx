import { useState } from 'react';
import { X, Coins, DollarSign, Play } from 'lucide-react';
import { CasinoGame } from '../lib/supabase';

interface CasinoGameModalProps {
  game: CasinoGame;
  onClose: () => void;
}

export default function CasinoGameModal({ game, onClose }: CasinoGameModalProps) {
  const [bet, setBet] = useState(game.min_bet);
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState<{ win: boolean; amount: number } | null>(null);

  const handlePlay = () => {
    setIsPlaying(true);
    setResult(null);

    setTimeout(() => {
      const winChance = Math.random();
      const isWin = winChance > 0.5;
      const multiplier = isWin ? Math.random() * 3 + 1 : 0;
      const amount = Math.floor(bet * multiplier);

      setResult({
        win: isWin,
        amount: amount,
      });
      setIsPlaying(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl shadow-2xl w-full max-w-2xl border border-red-900/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 to-red-500"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative h-64 overflow-hidden">
          <img
            src={game.image_url}
            alt={game.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-4xl font-bold text-white mb-2">{game.name}</h3>
            <p className="text-slate-300">{game.description}</p>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
              <div className="flex items-center space-x-2 text-slate-400 mb-2">
                <Coins className="w-4 h-4" />
                <span className="text-sm">Мин. ставка</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {game.min_bet.toLocaleString('ru-RU')} ₽
              </div>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
              <div className="flex items-center space-x-2 text-slate-400 mb-2">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">Макс. ставка</span>
              </div>
              <div className="text-2xl font-bold text-amber-400">
                {game.max_bet.toLocaleString('ru-RU')} ₽
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-slate-300 mb-3 font-medium">
              Ваша ставка: {bet.toLocaleString('ru-RU')} ₽
            </label>
            <input
              type="range"
              min={game.min_bet}
              max={game.max_bet}
              step={game.min_bet}
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              disabled={isPlaying}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>{game.min_bet.toLocaleString('ru-RU')} ₽</span>
              <span>{game.max_bet.toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>

          {result && (
            <div
              className={`mb-6 p-6 rounded-xl text-center border-2 ${
                result.win
                  ? 'bg-green-500/10 border-green-500'
                  : 'bg-red-500/10 border-red-500'
              }`}
            >
              <div className={`text-3xl font-bold mb-2 ${result.win ? 'text-green-400' : 'text-red-400'}`}>
                {result.win ? 'Выигрыш!' : 'Проигрыш'}
              </div>
              <div className="text-xl text-white">
                {result.win ? `+${result.amount.toLocaleString('ru-RU')} ₽` : `-${bet.toLocaleString('ru-RU')} ₽`}
              </div>
            </div>
          )}

          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className="w-full py-4 bg-gradient-to-r from-red-500 to-amber-500 text-white font-bold text-lg rounded-xl hover:from-red-600 hover:to-amber-600 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isPlaying ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
                <span>Игра...</span>
              </>
            ) : (
              <>
                <Play className="w-6 h-6" />
                <span>Играть</span>
              </>
            )}
          </button>

          <p className="text-xs text-slate-500 text-center mt-4">
            Это демо-версия. Для реальной игры свяжитесь с администратором.
          </p>
        </div>
      </div>
    </div>
  );
}
