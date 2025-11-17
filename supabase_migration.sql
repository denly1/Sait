-- Миграция для базы данных EMPTY GAZ

-- Таблица для аналитики и логирования
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(50) NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  ip_address VARCHAR(45),
  user_agent TEXT,
  page_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_ip ON analytics_events(ip_address);

-- Таблица отзывов
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  username VARCHAR(100) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  service VARCHAR(50),
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);

-- Таблица программы лояльности
CREATE TABLE IF NOT EXISTS loyalty_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  points INTEGER DEFAULT 0,
  level VARCHAR(20) DEFAULT 'Бронза',
  total_spent DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица истории баллов
CREATE TABLE IF NOT EXISTS loyalty_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  points_change INTEGER NOT NULL,
  reason VARCHAR(100),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица сообщений чата поддержки
CREATE TABLE IF NOT EXISTS support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  message TEXT NOT NULL,
  sender VARCHAR(20) CHECK (sender IN ('user', 'support')),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_user ON support_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_support_created ON support_messages(created_at);

-- Таблица выигрышей колеса фортуны
CREATE TABLE IF NOT EXISTS wheel_wins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  prize_name VARCHAR(100),
  prize_value INTEGER,
  claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автообновления
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loyalty_updated_at BEFORE UPDATE ON loyalty_points
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Политики безопасности (Row Level Security)

-- Analytics events - только админы могут читать
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view analytics" ON analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Anyone can insert analytics" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- Reviews - все могут читать, только владельцы могут редактировать
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Loyalty points - пользователи видят только свои баллы
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their loyalty points" ON loyalty_points
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage loyalty points" ON loyalty_points
  FOR ALL USING (true);

-- Support messages - пользователи видят только свои сообщения
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their messages" ON support_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can send messages" ON support_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Wheel wins - пользователи видят только свои выигрыши
ALTER TABLE wheel_wins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their wins" ON wheel_wins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert wins" ON wheel_wins
  FOR INSERT WITH CHECK (true);

-- Функция для начисления баллов лояльности
CREATE OR REPLACE FUNCTION add_loyalty_points(
  p_user_id UUID,
  p_points INTEGER,
  p_reason VARCHAR(100)
)
RETURNS void AS $$
BEGIN
  -- Обновляем или создаем запись баллов
  INSERT INTO loyalty_points (user_id, points)
  VALUES (p_user_id, p_points)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    points = loyalty_points.points + p_points,
    updated_at = NOW();
  
  -- Записываем в историю
  INSERT INTO loyalty_history (user_id, points_change, reason)
  VALUES (p_user_id, p_points, p_reason);
  
  -- Обновляем уровень
  UPDATE loyalty_points
  SET level = CASE
    WHEN points >= 5000 THEN 'Платина'
    WHEN points >= 2000 THEN 'Золото'
    WHEN points >= 1000 THEN 'Серебро'
    ELSE 'Бронза'
  END
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Комментарии к таблицам
COMMENT ON TABLE analytics_events IS 'Логирование всех событий на сайте включая IP адреса';
COMMENT ON TABLE reviews IS 'Отзывы пользователей о сервисах';
COMMENT ON TABLE loyalty_points IS 'Баллы программы лояльности пользователей';
COMMENT ON TABLE support_messages IS 'Сообщения чата поддержки';
COMMENT ON TABLE wheel_wins IS 'Выигрыши в колесе фортуны';
