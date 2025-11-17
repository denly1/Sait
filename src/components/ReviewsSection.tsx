import { useState } from 'react';
import { Star, ThumbsUp, MessageSquare, X } from 'lucide-react';

interface Review {
  id: string;
  username: string;
  rating: number;
  text: string;
  date: Date;
  likes: number;
  service: string;
}

interface ReviewsSectionProps {
  onClose: () => void;
}

export default function ReviewsSection({ onClose }: ReviewsSectionProps) {
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      username: 'Александр',
      rating: 5,
      text: 'Отличный сервис! Все быстро и качественно. Девушки профессиональные, товары качественные.',
      date: new Date('2024-01-15'),
      likes: 24,
      service: 'Эскорт'
    },
    {
      id: '2',
      username: 'Дмитрий',
      rating: 5,
      text: 'Заказывал баллоны на мероприятие. Доставка точно в срок, все упаковано отлично!',
      date: new Date('2024-01-14'),
      likes: 18,
      service: 'Магазин'
    },
    {
      id: '3',
      username: 'Михаил',
      rating: 4,
      text: 'Казино работает хорошо, выигрывал несколько раз. Выплаты быстрые.',
      date: new Date('2024-01-13'),
      likes: 15,
      service: 'Казино'
    },
    {
      id: '4',
      username: 'Сергей',
      rating: 5,
      text: 'Колесо фортуны - огонь! Выиграл бесплатный час, все честно!',
      date: new Date('2024-01-12'),
      likes: 32,
      service: 'Колесо Фортуны'
    },
    {
      id: '5',
      username: 'Андрей',
      rating: 5,
      text: 'Пользуюсь услугами уже полгода. Всегда на высоте, рекомендую!',
      date: new Date('2024-01-11'),
      likes: 41,
      service: 'Общее'
    }
  ]);

  const [showAddReview, setShowAddReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');

  const handleSubmitReview = () => {
    // Здесь будет логика отправки отзыва в базу
    alert('Спасибо за ваш отзыв!');
    setShowAddReview(false);
    setNewReviewText('');
    setNewRating(5);
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-4xl w-full border border-amber-500/30 my-4 sm:my-8">
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm p-4 sm:p-6 border-b border-amber-500/30 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8" />
              Отзывы клиентов
            </h2>
            <p className="text-slate-400 text-sm">Что говорят наши клиенты</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors active:scale-95">
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Статистика */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-800/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-amber-400">4.8</div>
              <div className="text-slate-400 text-sm mt-1">Средняя оценка</div>
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= 4.8 ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                  />
                ))}
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-400">{reviews.length}</div>
              <div className="text-slate-400 text-sm mt-1">Всего отзывов</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">98%</div>
              <div className="text-slate-400 text-sm mt-1">Довольных</div>
            </div>
          </div>

          {/* Кнопка добавить отзыв */}
          <button
            onClick={() => setShowAddReview(!showAddReview)}
            className="w-full mb-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all active:scale-98"
          >
            {showAddReview ? 'Отменить' : '+ Оставить отзыв'}
          </button>

          {/* Форма добавления отзыва */}
          {showAddReview && (
            <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6 mb-6 border border-amber-500/30">
              <h3 className="text-white font-bold mb-4">Ваш отзыв</h3>
              
              {/* Рейтинг */}
              <div className="mb-4">
                <label className="text-slate-300 text-sm mb-2 block">Оценка</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${star <= newRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Текст отзыва */}
              <div className="mb-4">
                <label className="text-slate-300 text-sm mb-2 block">Ваш отзыв</label>
                <textarea
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Расскажите о вашем опыте..."
                  className="w-full bg-slate-900 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[100px]"
                />
              </div>

              <button
                onClick={handleSubmitReview}
                disabled={!newReviewText.trim()}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Отправить отзыв
              </button>
            </div>
          )}

          {/* Список отзывов */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-slate-800/50 rounded-xl p-4 sm:p-6 border border-slate-700 hover:border-amber-500/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-semibold">{review.username}</span>
                      <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">
                        {review.service}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">
                        {review.date.toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-300 mb-3">{review.text}</p>

                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">{review.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
