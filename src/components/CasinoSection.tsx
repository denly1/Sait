import { useState, useEffect } from 'react';
import { Coins, DollarSign, TrendingUp, Dices, Spade, Target, Sparkles } from 'lucide-react';
import { supabase, CasinoGame } from '../lib/supabase';
import BlackjackGame from './BlackjackGame';
import RouletteGameEnhanced from './RouletteGameEnhanced';
import BananzaSlotsGame from './BananzaSlotsGame';

export default function CasinoSection() {
  const [games, setGames] = useState<CasinoGame[]>([]);
  const [selectedGame, setSelectedGame] = useState<CasinoGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [balance, setBalance] = useState(10000);
  const [activeGame, setActiveGame] = useState<'bananza' | 'blackjack' | 'roulette' | null>(null);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const { data, error } = await supabase
        .from('casino_games')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setGames(data || []);
    } catch (error) {
      console.error('Error loading casino games:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGames = filter === 'all'
    ? games
    : games.filter(game => game.type === filter);


  const gameTypes = [
    { value: 'all', label: 'Все игры' },
    { value: 'slots', label: 'Слоты' },
    { value: 'poker', label: 'Покер' },
    { value: 'roulette', label: 'Рулетка' },
    { value: 'blackjack', label: 'Блэкджек' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-24 px-4 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-16 border-4 border-amber-500/30 shadow-2xl">
          <div className="text-9xl mb-8 animate-pulse">🎰</div>
          <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 mb-6">
            В РАЗРАБОТКЕ
          </h2>
          <p className="text-2xl text-slate-300 mb-8">
            Казино игры скоро будут доступны
          </p>
          <div className="flex items-center justify-center gap-4 text-slate-400">
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-white">Ваш баланс</h3>
              <div className="text-3xl font-bold text-amber-400">{balance.toLocaleString('ru-RU')} ₽</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveGame('bananza')}
                className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 p-8 rounded-2xl hover:scale-105 transition-all shadow-2xl hover:shadow-purple-500/50 border-4 border-amber-500 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <Sparkles className="w-16 h-16 text-amber-400 mx-auto mb-3 animate-pulse" />
                <div className="text-white font-black text-2xl mb-2">🍌 BANANZA SLOTS</div>
                <div className="text-amber-200 text-sm font-bold">Премиум слоты • До x50!</div>
              </button>
              <button
                onClick={() => setActiveGame('roulette')}
                className="bg-gradient-to-br from-red-600 to-red-900 p-8 rounded-2xl hover:scale-105 transition-all shadow-2xl hover:shadow-red-500/50 border-4 border-amber-500 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <Target className="w-16 h-16 text-amber-400 mx-auto mb-3" />
                <div className="text-white font-black text-2xl mb-2">🎰 РУЛЕТКА PRO</div>
                <div className="text-red-200 text-sm font-bold">Профессиональная • До x36!</div>
              </button>
              <button
                onClick={() => setActiveGame('blackjack')}
                className="bg-gradient-to-br from-green-700 to-green-900 p-8 rounded-2xl hover:scale-105 transition-all shadow-2xl hover:shadow-green-500/50 border-4 border-amber-500 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <Spade className="w-16 h-16 text-amber-400 mx-auto mb-3" />
                <div className="text-white font-black text-2xl mb-2">♠️ БЛЭКДЖЕК</div>
                <div className="text-green-200 text-sm font-bold">Классическая игра • 21</div>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {gameTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setFilter(type.value)}
                className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                  filter === type.value
                    ? 'bg-gradient-to-r from-red-500 to-amber-500 text-white shadow-lg shadow-red-500/50'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/70 hover:text-white'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="group bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl overflow-hidden shadow-2xl hover:shadow-red-500/30 transition-all duration-500 border border-slate-800 hover:border-red-500/50 hover:-translate-y-2 cursor-pointer"
              onClick={() => setSelectedGame(game)}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={game.image_url}
                  alt={game.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

                <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg uppercase">
                  {game.type === 'slots' && 'Слоты'}
                  {game.type === 'poker' && 'Покер'}
                  {game.type === 'roulette' && 'Рулетка'}
                  {game.type === 'blackjack' && 'Блэкджек'}
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-1">{game.name}</h3>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">Высокие выплаты</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-slate-300 mb-4 line-clamp-2">{game.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 flex items-center space-x-2">
                      <Coins className="w-4 h-4" />
                      <span>Мин. ставка</span>
                    </span>
                    <span className="text-white font-semibold">
                      {game.min_bet.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 flex items-center space-x-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Макс. ставка</span>
                    </span>
                    <span className="text-amber-400 font-semibold">
                      {game.max_bet.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-red-500 to-amber-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-amber-600 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50">
                  Играть сейчас
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeGame === 'bananza' && (
        <BananzaSlotsGame
          onClose={() => setActiveGame(null)}
          balance={balance}
          onBalanceChange={setBalance}
        />
      )}

      {activeGame === 'roulette' && (
        <RouletteGameEnhanced
          onClose={() => setActiveGame(null)}
          balance={balance}
          onBalanceChange={setBalance}
        />
      )}

      {activeGame === 'blackjack' && (
        <BlackjackGame
          onClose={() => setActiveGame(null)}
          balance={balance}
          onBalanceChange={setBalance}
        />
      )}
    </div>
  );
}
