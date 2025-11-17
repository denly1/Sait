import { useState } from 'react';
import { X, Gift, Star, Trophy, Crown, Zap } from 'lucide-react';

interface LoyaltyProgramProps {
  onClose: () => void;
}

export default function LoyaltyProgram({ onClose }: LoyaltyProgramProps) {
  const [userPoints] = useState(2450);
  const [userLevel] = useState('Золото');

  const levels = [
    {
      name: 'Бронза',
      minPoints: 0,
      icon: Star,
      color: 'from-orange-600 to-orange-800',
      benefits: ['Скидка 5%', 'Приоритетная поддержка', 'Бонусы за отзывы']
    },
    {
      name: 'Серебро',
      minPoints: 1000,
      icon: Zap,
      color: 'from-gray-400 to-gray-600',
      benefits: ['Скидка 10%', 'Бесплатная доставка', 'Эксклюзивные предложения']
    },
    {
      name: 'Золото',
      minPoints: 2000,
      icon: Trophy,
      color: 'from-amber-400 to-amber-600',
      benefits: ['Скидка 15%', 'VIP поддержка 24/7', 'Персональный менеджер', 'Ранний доступ']
    },
    {
      name: 'Платина',
      minPoints: 5000,
      icon: Crown,
      color: 'from-purple-400 to-purple-600',
      benefits: ['Скидка 20%', 'Премиум услуги', 'Индивидуальные условия', 'Закрытые мероприятия']
    }
  ];

  const rewards = [
    { id: 1, name: 'Скидка 500₽', points: 500, icon: '🎁' },
    { id: 2, name: 'Бесплатная доставка', points: 300, icon: '🚚' },
    { id: 3, name: 'Баллон 2L в подарок', points: 1000, icon: '🎈' },
    { id: 4, name: 'Час эскорта бесплатно', points: 2000, icon: '💎' },
    { id: 5, name: 'VIP статус на месяц', points: 3000, icon: '👑' },
  ];

  const getCurrentLevel = () => {
    return levels.find(level => level.name === userLevel) || levels[0];
  };

  const getNextLevel = () => {
    const currentIndex = levels.findIndex(level => level.name === userLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const progressToNext = nextLevel 
    ? ((userPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-4xl w-full border border-amber-500/30 my-4 sm:my-8">
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm p-4 sm:p-6 border-b border-amber-500/30 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 flex items-center gap-2">
              <Gift className="w-6 h-6 sm:w-8 sm:h-8" />
              Программа лояльности
            </h2>
            <p className="text-slate-400 text-sm">Зарабатывайте баллы и получайте награды</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors active:scale-95">
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Текущий статус */}
          <div className={`bg-gradient-to-r ${currentLevel.color} rounded-2xl p-6 mb-6 text-white`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-full">
                  <currentLevel.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{currentLevel.name}</h3>
                  <p className="text-white/80 text-sm">Ваш текущий уровень</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{userPoints}</div>
                <div className="text-white/80 text-sm">баллов</div>
              </div>
            </div>

            {nextLevel && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>До уровня {nextLevel.name}</span>
                  <span>{nextLevel.minPoints - userPoints} баллов</span>
                </div>
                <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-white h-full transition-all duration-500"
                    style={{ width: `${Math.min(progressToNext, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Как зарабатывать баллы */}
          <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6 mb-6 border border-slate-700">
            <h3 className="text-white font-bold text-lg mb-4">Как зарабатывать баллы</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <span className="text-2xl">🛍️</span>
                </div>
                <div>
                  <div className="text-white font-semibold">За покупки</div>
                  <div className="text-slate-400 text-sm">1 балл = 100₽</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <div className="text-white font-semibold">За отзывы</div>
                  <div className="text-slate-400 text-sm">+50 баллов</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <span className="text-2xl">👥</span>
                </div>
                <div>
                  <div className="text-white font-semibold">Приведи друга</div>
                  <div className="text-slate-400 text-sm">+200 баллов</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-amber-500/20 p-2 rounded-lg">
                  <span className="text-2xl">🎂</span>
                </div>
                <div>
                  <div className="text-white font-semibold">День рождения</div>
                  <div className="text-slate-400 text-sm">+500 баллов</div>
                </div>
              </div>
            </div>
          </div>

          {/* Уровни */}
          <div className="mb-6">
            <h3 className="text-white font-bold text-lg mb-4">Уровни программы</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {levels.map((level) => {
                const LevelIcon = level.icon;
                const isCurrentLevel = level.name === userLevel;
                const isUnlocked = userPoints >= level.minPoints;

                return (
                  <div
                    key={level.name}
                    className={`rounded-xl p-4 border-2 transition-all ${
                      isCurrentLevel
                        ? 'border-amber-500 bg-amber-500/10'
                        : isUnlocked
                        ? 'border-green-500/50 bg-slate-800/50'
                        : 'border-slate-700 bg-slate-800/30 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`bg-gradient-to-r ${level.color} p-2 rounded-lg`}>
                        <LevelIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold">{level.name}</h4>
                        <p className="text-slate-400 text-xs">
                          {level.minPoints}+ баллов
                        </p>
                      </div>
                    </div>
                    <ul className="space-y-1">
                      {level.benefits.map((benefit, index) => (
                        <li key={index} className="text-slate-300 text-sm flex items-center gap-2">
                          <span className="text-green-400">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Награды */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Обменять баллы</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map((reward) => {
                const canAfford = userPoints >= reward.points;
                return (
                  <div
                    key={reward.id}
                    className={`bg-slate-800/50 rounded-xl p-4 border transition-all ${
                      canAfford
                        ? 'border-green-500/50 hover:border-green-500 cursor-pointer'
                        : 'border-slate-700 opacity-60'
                    }`}
                  >
                    <div className="text-4xl mb-2">{reward.icon}</div>
                    <h4 className="text-white font-semibold mb-1">{reward.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400 font-bold">{reward.points} баллов</span>
                      {canAfford && (
                        <button className="bg-green-500 text-white text-xs px-3 py-1 rounded-lg hover:bg-green-600 transition-colors">
                          Обменять
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
