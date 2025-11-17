import { useState } from 'react';
import { ShoppingCart, X, Trash2, Plus, Minus, Receipt } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji?: string;
  category: string;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  onClose: () => void;
}

export default function Cart({ items, onUpdateQuantity, onRemoveItem, onCheckout, onClose }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-3 sm:p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-blue-500/30 my-4 sm:my-8">
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm p-4 sm:p-6 border-b border-blue-500/30 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-400 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8" />
              Корзина
            </h2>
            <p className="text-slate-400 text-sm">Товаров: {itemCount}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors active:scale-95">
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 sm:w-20 sm:h-20 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">Корзина пуста</p>
              <p className="text-slate-500 text-sm mt-2">Добавьте товары из магазина</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 sm:space-y-4 mb-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700 hover:border-blue-500/50 transition-all"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="text-3xl sm:text-4xl">{item.emoji || '📦'}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-sm sm:text-base mb-1 line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-slate-400 text-xs sm:text-sm mb-2">{item.category}</p>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 bg-slate-700/50 rounded-lg p-1">
                            <button
                              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="p-1.5 hover:bg-slate-600 rounded transition-colors active:scale-95"
                            >
                              <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </button>
                            <span className="text-white font-semibold min-w-[2rem] text-center text-sm sm:text-base">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 hover:bg-slate-600 rounded transition-colors active:scale-95"
                            >
                              <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-blue-400 font-bold text-sm sm:text-lg whitespace-nowrap">
                              {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                            </span>
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="p-1.5 sm:p-2 hover:bg-red-500/20 rounded-lg transition-colors active:scale-95"
                            >
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-700 pt-4 sm:pt-6 space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center text-lg sm:text-xl">
                  <span className="text-slate-300 font-semibold">Итого:</span>
                  <span className="text-blue-400 font-bold text-xl sm:text-2xl">
                    {total.toLocaleString('ru-RU')} ₽
                  </span>
                </div>

                <button
                  onClick={onCheckout}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-blue-500/50 active:scale-98"
                >
                  <Receipt className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Оформить заказ</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
