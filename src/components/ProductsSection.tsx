import { useState, useEffect } from 'react';
import { Package, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';
import OrderModal from './OrderModal';

const nitrogenBalloons = [
  {
    id: 'nitrogen-2l',
    name: 'Баллон с азотом 2L',
    description: 'Компактный баллон для небольших мероприятий. Объем 2 литра.',
    price: 1500,
    category: 'Азот',
    image_url: '',
    in_stock: true,
    quantity: 15,
    volume: '2 литра'
  },
  {
    id: 'nitrogen-3.5l',
    name: 'Баллон с азотом 3.5L',
    description: 'Популярный размер для домашних праздников. Объем 3.5 литра.',
    price: 2500,
    category: 'Азот',
    image_url: '',
    in_stock: true,
    quantity: 20,
    volume: '3.5 литра'
  },
  {
    id: 'nitrogen-5l',
    name: 'Баллон с азотом 5L',
    description: 'Средний баллон для вечеринок. Объем 5 литров.',
    price: 3500,
    category: 'Азот',
    image_url: '',
    in_stock: true,
    quantity: 12,
    volume: '5 литров'
  },
  {
    id: 'nitrogen-10l',
    name: 'Баллон с азотом 10L',
    description: 'Большой баллон для крупных мероприятий. Объем 10 литров.',
    price: 6500,
    category: 'Азот',
    image_url: '',
    in_stock: true,
    quantity: 8,
    volume: '10 литров'
  },
];

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      // Загружаем только баллоны с азотом
      setProducts(nitrogenBalloons as any);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts(nitrogenBalloons as any);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'Азот', ...new Set(products.map(p => p.category).filter(c => c !== 'Азот'))];
  const filteredProducts = filter === 'all'
    ? products
    : products.filter(p => p.category === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950/30 to-slate-900 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 mb-4">
            Премиум Шары
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            Эксклюзивные воздушные шары для незабываемых событий
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                  filter === category
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/70 hover:text-white'
                }`}
              >
                {category === 'all' ? 'Все товары' : category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 border border-slate-700 hover:border-blue-500/50 hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden rounded-t-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                <div className="text-8xl">🧪</div>

                {product.in_stock ? (
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>В наличии</span>
                  </div>
                ) : (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    Нет в наличии
                  </div>
                )}

                <div className="absolute top-4 left-4 bg-blue-500/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  {product.category}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{product.name}</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{product.description}</p>

                {(product as any).volume && (
                  <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg px-3 py-2 mb-3">
                    <div className="text-blue-300 text-sm font-semibold">Объем: {(product as any).volume}</div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  {product.in_stock && (
                    <div className="flex items-center space-x-2 text-slate-400">
                      <Package className="w-4 h-4" />
                      <span className="text-sm">{product.quantity} шт.</span>
                    </div>
                  )}
                  <div className="text-2xl font-bold text-blue-400 ml-auto">
                    {product.price.toLocaleString('ru-RU')} ₽
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProduct(product)}
                  disabled={!product.in_stock}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                    product.in_stock
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg hover:shadow-blue-500/50'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{product.in_stock ? 'Заказать' : 'Недоступно'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <OrderModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
