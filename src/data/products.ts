// Все товары магазина

export const allProducts = [
  // Баллоны с азотом
  {
    id: 'balloon-5l',
    name: 'Баллон с азотом 5L',
    description: 'Средний баллон для вечеринок. Объем 5 литров.',
    price: 3500,
    category: 'Баллоны',
    image_url: '',
    in_stock: true,
    quantity: 12,
    emoji: '🧪'
  },
  {
    id: 'balloon-10l',
    name: 'Баллон с азотом 10L',
    description: 'Большой баллон для крупных мероприятий. Объем 10 литров.',
    price: 6500,
    category: 'Баллоны',
    image_url: '',
    in_stock: true,
    quantity: 8,
    emoji: '🧪'
  },

  // Поперсы
  {
    id: 'poppers-rush',
    name: 'Попперс Rush Original',
    description: 'Классический попперс высокого качества. 10ml.',
    price: 1200,
    category: 'Поперсы',
    image_url: '',
    in_stock: true,
    quantity: 25,
    emoji: '💊'
  },
  {
    id: 'poppers-jungle',
    name: 'Попперс Jungle Juice',
    description: 'Мощный эффект, длительное действие. 10ml.',
    price: 1500,
    category: 'Поперсы',
    image_url: '',
    in_stock: true,
    quantity: 20,
    emoji: '💊'
  },
  {
    id: 'poppers-amsterdam',
    name: 'Попперс Amsterdam',
    description: 'Премиум качество из Голландии. 15ml.',
    price: 1800,
    category: 'Поперсы',
    image_url: '',
    in_stock: true,
    quantity: 15,
    emoji: '💊'
  },

  // Глушители
  {
    id: 'silencer-basic',
    name: 'Глушитель Standard',
    description: 'Базовый глушитель для повседневного использования.',
    price: 2500,
    category: 'Глушители',
    image_url: '',
    in_stock: true,
    quantity: 10,
    emoji: '🔇'
  },
  {
    id: 'silencer-pro',
    name: 'Глушитель Pro',
    description: 'Профессиональный глушитель с улучшенными характеристиками.',
    price: 4500,
    category: 'Глушители',
    image_url: '',
    in_stock: true,
    quantity: 7,
    emoji: '🔇'
  },

  // Подставки
  {
    id: 'stand-basic',
    name: 'Подставка Classic',
    description: 'Классическая подставка, надежная и удобная.',
    price: 800,
    category: 'Подставки',
    image_url: '',
    in_stock: true,
    quantity: 30,
    emoji: '📐'
  },
  {
    id: 'stand-premium',
    name: 'Подставка Premium',
    description: 'Премиум подставка с регулировкой высоты.',
    price: 1500,
    category: 'Подставки',
    image_url: '',
    in_stock: true,
    quantity: 20,
    emoji: '📐'
  },

  // Чехлы фирменные
  {
    id: 'case-black',
    name: 'Чехол Black Edition',
    description: 'Фирменный черный чехол с логотипом EMPTY GAZ.',
    price: 1200,
    category: 'Чехлы',
    image_url: '',
    in_stock: true,
    quantity: 25,
    emoji: '👜'
  },
  {
    id: 'case-premium',
    name: 'Чехол Premium Leather',
    description: 'Премиум кожаный чехол ручной работы.',
    price: 2500,
    category: 'Чехлы',
    image_url: '',
    in_stock: true,
    quantity: 10,
    emoji: '👜'
  },

  // Личный бренд (одежда)
  {
    id: 'hoodie-black',
    name: 'Худи EMPTY GAZ Black',
    description: 'Черное худи с фирменным логотипом. Размеры: S-XXL.',
    price: 3500,
    category: 'Одежда',
    image_url: '',
    in_stock: true,
    quantity: 15,
    emoji: '👕'
  },
  {
    id: 'tshirt-white',
    name: 'Футболка EMPTY GAZ White',
    description: 'Белая футболка премиум качества. Размеры: S-XXL.',
    price: 1500,
    category: 'Одежда',
    image_url: '',
    in_stock: true,
    quantity: 30,
    emoji: '👕'
  },
  {
    id: 'cap-black',
    name: 'Кепка EMPTY GAZ',
    description: 'Черная кепка с вышитым логотипом.',
    price: 1200,
    category: 'Одежда',
    image_url: '',
    in_stock: true,
    quantity: 20,
    emoji: '🧢'
  },

  // Стикеры
  {
    id: 'stickers-pack-small',
    name: 'Набор стикеров Mini',
    description: 'Набор из 10 фирменных стикеров EMPTY GAZ.',
    price: 300,
    category: 'Стикеры',
    image_url: '',
    in_stock: true,
    quantity: 50,
    emoji: '🎨'
  },
  {
    id: 'stickers-pack-large',
    name: 'Набор стикеров Mega',
    description: 'Набор из 25 разных стикеров + эксклюзивные.',
    price: 600,
    category: 'Стикеры',
    image_url: '',
    in_stock: true,
    quantity: 30,
    emoji: '🎨'
  },

  // Пачки (разные по цветам)
  {
    id: 'pack-red',
    name: 'Пачка Red Edition',
    description: 'Красная пачка премиум качества.',
    price: 500,
    category: 'Пачки',
    image_url: '',
    in_stock: true,
    quantity: 40,
    emoji: '📦'
  },
  {
    id: 'pack-blue',
    name: 'Пачка Blue Edition',
    description: 'Синяя пачка премиум качества.',
    price: 500,
    category: 'Пачки',
    image_url: '',
    in_stock: true,
    quantity: 35,
    emoji: '📦'
  },
  {
    id: 'pack-green',
    name: 'Пачка Green Edition',
    description: 'Зеленая пачка премиум качества.',
    price: 500,
    category: 'Пачки',
    image_url: '',
    in_stock: true,
    quantity: 30,
    emoji: '📦'
  },
  {
    id: 'pack-black',
    name: 'Пачка Black Edition',
    description: 'Черная пачка премиум качества.',
    price: 600,
    category: 'Пачки',
    image_url: '',
    in_stock: true,
    quantity: 25,
    emoji: '📦'
  },
  {
    id: 'pack-gold',
    name: 'Пачка Gold Edition',
    description: 'Золотая пачка эксклюзивная.',
    price: 800,
    category: 'Пачки',
    image_url: '',
    in_stock: true,
    quantity: 10,
    emoji: '📦'
  },

  // Товары для взрослых
  {
    id: 'condoms-durex',
    name: 'Презервативы Durex',
    description: 'Упаковка 12 шт. Классические.',
    price: 400,
    category: 'Для взрослых',
    image_url: '',
    in_stock: true,
    quantity: 50,
    emoji: '🎈'
  },
  {
    id: 'condoms-premium',
    name: 'Презервативы Premium',
    description: 'Упаковка 12 шт. Ультратонкие.',
    price: 600,
    category: 'Для взрослых',
    image_url: '',
    in_stock: true,
    quantity: 40,
    emoji: '🎈'
  },
  {
    id: 'toy-basic',
    name: 'Игрушка Basic',
    description: 'Базовая модель для начинающих.',
    price: 1500,
    category: 'Для взрослых',
    image_url: '',
    in_stock: true,
    quantity: 15,
    emoji: '🎁'
  },
  {
    id: 'toy-premium',
    name: 'Игрушка Premium',
    description: 'Премиум модель с дополнительными функциями.',
    price: 3500,
    category: 'Для взрослых',
    image_url: '',
    in_stock: true,
    quantity: 10,
    emoji: '🎁'
  },
  {
    id: 'lube-basic',
    name: 'Смазка Classic',
    description: 'Классическая смазка на водной основе. 50ml.',
    price: 500,
    category: 'Для взрослых',
    image_url: '',
    in_stock: true,
    quantity: 30,
    emoji: '💧'
  },
];

export const categories = [
  'Все товары',
  'Баллоны',
  'Поперсы',
  'Глушители',
  'Подставки',
  'Чехлы',
  'Одежда',
  'Стикеры',
  'Пачки',
  'Для взрослых'
];
