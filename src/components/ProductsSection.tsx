import { useState, useEffect } from 'react';
import { Package, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { Product, supabase } from '../lib/supabase';
import Cart from './Cart';
import CheckoutModal, { OrderData } from './CheckoutModal';
import { allProducts, categories as productCategories } from '../data/products';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji?: string;
  category: string;
}

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('Все товары');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      // Загружаем все товары
      setProducts(allProducts as any);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts(allProducts as any);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = filter === 'Все товары'
    ? products
    : products.filter(p => p.category === filter);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        emoji: (product as any).emoji,
        category: product.category
      }]);
    }
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  const handleConfirmOrder = async (orderData: OrderData) => {
    try {
      // Сохраняем заказ в базу данных
      const { error } = await supabase.from('orders').insert({
        user_phone: orderData.phone,
        user_name: orderData.name,
        delivery_address: orderData.address,
        comment: orderData.comment,
        items: orderData.items,
        total: orderData.total,
        status: 'pending',
        type: 'product'
      });

      if (error) throw error;

      // Очищаем корзину
      setCart([]);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-14 sm:py-18 lg:py-24 px-3 sm:px-4 pb-28">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 relative">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-3 sm:mb-4">
            Магазин EMPTY GAZ
          </h2>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-slate-300 max-w-2xl mx-auto px-2 sm:px-4">
            Баллоны, поперсы, одежда, аксессуары и многое другое
          </p>
          
          {/* Кнопка корзины */}
          <button
            onClick={() => setShowCart(true)}
            className="fixed top-20 sm:top-24 right-3 sm:right-6 z-40 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 sm:p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 active:scale-95"
          >
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5 lg:gap-3 mb-6 sm:mb-8 lg:mb-12">
          {productCategories.map((category: string) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 active:scale-98 ${
                filter === category
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/70 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 border border-slate-700 hover:border-blue-500/50 active:scale-98"
            >
              <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden rounded-t-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                <div className="text-6xl sm:text-7xl lg:text-8xl">{(product as any).emoji || '📦'}</div>

                {product.in_stock ? (
                  <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 bg-green-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="hidden sm:inline">В наличии</span>
                    <span className="sm:hidden">✓</span>
                  </div>
                ) : (
                  <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg">
                    <span className="hidden sm:inline">Нет в наличии</span>
                    <span className="sm:hidden">✗</span>
                  </div>
                )}

                <div className="absolute top-2 sm:top-3 lg:top-4 left-2 sm:left-3 lg:left-4 bg-blue-500/90 text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                  {product.category}
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 line-clamp-1">{product.name}</h3>
                <p className="text-slate-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{product.description}</p>

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
                  onClick={() => addToCart(product)}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
                  disabled={!product.in_stock}
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>В корзину</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCart && (
        <Cart
          items={cart}
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeFromCart}
          onCheckout={handleCheckout}
          onClose={() => setShowCart(false)}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          items={cart}
          total={cartTotal}
          onClose={() => {
            setShowCheckout(false);
            setCart([]);
          }}
          onConfirm={handleConfirmOrder}
        />
      )}
    </div>
  );
}
