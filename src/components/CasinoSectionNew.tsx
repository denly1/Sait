import { useState } from 'react';
import { Sparkles, Gift, Heart, Zap } from 'lucide-react';
import ProductSlot from './ProductSlot';
import EscortRoulette from './EscortRoulette';
import ComboSlot from './ComboSlot';

export default function CasinoSectionNew() {
  const [activeGame, setActiveGame] = useState<'product' | 'escort' | 'combo' | null>(null);

  if (activeGame === 'product') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-14 sm:py-18 lg:py-24 px-3 sm:px-4 pb-28">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setActiveGame(null)}
            className="mb-6 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            ← Назад к играм
          </button>
          <ProductSlot />
        </div>
      </div>
    );
  }

  if (activeGame === 'escort') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-14 sm:py-18 lg:py-24 px-3 sm:px-4 pb-28">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setActiveGame(null)}
            className="mb-6 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            ← Назад к играм
          </button>
          <EscortRoulette />
        </div>
      </div>
    );
  }

  if (activeGame === 'combo') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-14 sm:py-18 lg:py-24 px-3 sm:px-4 pb-28">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setActiveGame(null)}
            className="mb-6 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            ← Назад к играм
          </button>
          <ComboSlot />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-14 sm:py-18 lg:py-24 px-3 sm:px-4 pb-28">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-3 sm:mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
            Казино EMPTY GAZ
          </h2>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-slate-300 max-w-2xl mx-auto px-2 sm:px-4">
            Играй и выигрывай реальные призы!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Слот с товарами */}
          <button
            onClick={() => setActiveGame('product')}
            className="group bg-gradient-to-br from-purple-800 to-purple-900 rounded-2xl p-6 sm:p-8 border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 active:scale-98 text-left"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="bg-purple-600/30 p-4 rounded-full">
                <Gift className="w-12 h-12 sm:w-16 sm:h-16 text-purple-300" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 text-center">
              Слот с Товарами
            </h3>
            <p className="text-purple-200 text-sm sm:text-base text-center mb-4">
              Выиграй баллоны, поперсы и другие призы!
            </p>
            <div className="bg-purple-600/20 rounded-lg p-3 border border-purple-500/30">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-purple-300">Ставка:</span>
                <span className="text-white font-semibold">500 ₽</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm mt-1">
                <span className="text-purple-300">Макс. приз:</span>
                <span className="text-green-400 font-semibold">5000 ₽</span>
              </div>
            </div>
          </button>

          {/* Рулетка эскорт */}
          <button
            onClick={() => setActiveGame('escort')}
            className="group bg-gradient-to-br from-pink-800 to-rose-900 rounded-2xl p-6 sm:p-8 border-2 border-pink-500/50 hover:border-pink-400 transition-all duration-300 shadow-2xl hover:shadow-pink-500/50 active:scale-98 text-left"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="bg-pink-600/30 p-4 rounded-full">
                <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-pink-300" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 text-center">
              Рулетка Эскорт
            </h3>
            <p className="text-pink-200 text-sm sm:text-base text-center mb-4">
              Выиграй встречу с девушкой мечты!
            </p>
            <div className="bg-pink-600/20 rounded-lg p-3 border border-pink-500/30">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-pink-300">Ставка:</span>
                <span className="text-white font-semibold">2000 ₽</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm mt-1">
                <span className="text-pink-300">Макс. приз:</span>
                <span className="text-green-400 font-semibold">15000 ₽</span>
              </div>
            </div>
          </button>

          {/* Комбо слот 3в1 */}
          <button
            onClick={() => setActiveGame('combo')}
            className="group bg-gradient-to-br from-amber-800 to-orange-900 rounded-2xl p-6 sm:p-8 border-2 border-amber-500/50 hover:border-amber-400 transition-all duration-300 shadow-2xl hover:shadow-amber-500/50 active:scale-98 text-left md:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="bg-amber-600/30 p-4 rounded-full">
                <Zap className="w-12 h-12 sm:w-16 sm:h-16 text-amber-300" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 text-center">
              Комбо Слот 3в1
            </h3>
            <p className="text-amber-200 text-sm sm:text-base text-center mb-4">
              Товары + Эскорт + Деньги в одной игре!
            </p>
            <div className="bg-amber-600/20 rounded-lg p-3 border border-amber-500/30">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-amber-300">Ставка:</span>
                <span className="text-white font-semibold">1000 ₽</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm mt-1">
                <span className="text-amber-300">Макс. приз:</span>
                <span className="text-green-400 font-semibold">30000 ₽</span>
              </div>
            </div>
          </button>
        </div>

        {/* Информация */}
        <div className="mt-8 sm:mt-12 bg-slate-800/50 rounded-2xl p-4 sm:p-6 border border-slate-700">
          <h4 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Как играть?
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm sm:text-base">
            <div className="bg-slate-700/30 rounded-xl p-4">
              <div className="text-2xl mb-2">1️⃣</div>
              <p className="text-slate-300">Выберите игру</p>
            </div>
            <div className="bg-slate-700/30 rounded-xl p-4">
              <div className="text-2xl mb-2">2️⃣</div>
              <p className="text-slate-300">Сделайте ставку</p>
            </div>
            <div className="bg-slate-700/30 rounded-xl p-4">
              <div className="text-2xl mb-2">3️⃣</div>
              <p className="text-slate-300">Выиграйте приз!</p>
            </div>
          </div>
        </div>

        {/* Скоро */}
        <div className="mt-6 sm:mt-8 bg-gradient-to-r from-slate-800/50 to-purple-800/30 rounded-2xl p-4 sm:p-6 border border-purple-500/30">
          <p className="text-center text-slate-300 text-sm sm:text-base">
            <span className="text-purple-400 font-semibold">Скоро:</span> Реальное казино с рулеткой, блэкджеком и покером!
          </p>
        </div>
      </div>
    </div>
  );
}
