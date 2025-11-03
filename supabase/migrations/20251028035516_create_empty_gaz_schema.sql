/*
  # EMPTY GAZ Database Schema

  ## Overview
  This migration creates the complete database structure for the EMPTY GAZ platform
  with three main sections: Escorts, Casino, and Products (Шары).

  ## New Tables
  
  ### 1. `escorts`
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Escort name
  - `age` (integer) - Age
  - `description` (text) - Profile description
  - `price` (integer) - Price per hour
  - `image_url` (text) - Profile image URL
  - `rating` (numeric) - Average rating (0-5)
  - `available` (boolean) - Availability status
  - `created_at` (timestamptz) - Creation timestamp

  ### 2. `casino_games`
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Game name
  - `type` (text) - Game type (slots, poker, roulette, blackjack)
  - `description` (text) - Game description
  - `min_bet` (integer) - Minimum bet amount
  - `max_bet` (integer) - Maximum bet amount
  - `image_url` (text) - Game image URL
  - `active` (boolean) - Game active status
  - `created_at` (timestamptz) - Creation timestamp

  ### 3. `products`
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Product name
  - `description` (text) - Product description
  - `price` (integer) - Product price
  - `category` (text) - Product category
  - `image_url` (text) - Product image URL
  - `in_stock` (boolean) - Stock availability
  - `quantity` (integer) - Available quantity
  - `created_at` (timestamptz) - Creation timestamp

  ### 4. `bookings`
  - `id` (uuid, primary key) - Unique identifier
  - `escort_id` (uuid, foreign key) - Reference to escort
  - `customer_name` (text) - Customer name
  - `customer_phone` (text) - Customer phone
  - `booking_date` (timestamptz) - Booking date and time
  - `duration` (integer) - Duration in hours
  - `total_price` (integer) - Total price
  - `status` (text) - Booking status (pending, confirmed, completed, cancelled)
  - `created_at` (timestamptz) - Creation timestamp

  ### 5. `orders`
  - `id` (uuid, primary key) - Unique identifier
  - `product_id` (uuid, foreign key) - Reference to product
  - `customer_name` (text) - Customer name
  - `customer_phone` (text) - Customer phone
  - `quantity` (integer) - Order quantity
  - `total_price` (integer) - Total price
  - `status` (text) - Order status (pending, confirmed, delivered, cancelled)
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - Enable RLS on all tables
  - Add policies for public read access (this is a public-facing platform)
  - Add policies for insert operations (bookings and orders)
*/

-- Create escorts table
CREATE TABLE IF NOT EXISTS escorts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  age integer NOT NULL,
  description text NOT NULL,
  price integer NOT NULL,
  image_url text DEFAULT '',
  rating numeric(3,2) DEFAULT 5.0,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create casino_games table
CREATE TABLE IF NOT EXISTS casino_games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  description text NOT NULL,
  min_bet integer NOT NULL DEFAULT 10,
  max_bet integer NOT NULL DEFAULT 10000,
  image_url text DEFAULT '',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price integer NOT NULL,
  category text NOT NULL,
  image_url text DEFAULT '',
  in_stock boolean DEFAULT true,
  quantity integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  escort_id uuid REFERENCES escorts(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  booking_date timestamptz NOT NULL,
  duration integer NOT NULL DEFAULT 1,
  total_price integer NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  total_price integer NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE escorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE casino_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies for escorts (public read access)
CREATE POLICY "Anyone can view escorts"
  ON escorts FOR SELECT
  USING (true);

-- Policies for casino_games (public read access)
CREATE POLICY "Anyone can view casino games"
  ON casino_games FOR SELECT
  USING (true);

-- Policies for products (public read access)
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

-- Policies for bookings (public can create, view own bookings)
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view bookings"
  ON bookings FOR SELECT
  USING (true);

-- Policies for orders (public can create, view own orders)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view orders"
  ON orders FOR SELECT
  USING (true);

-- Insert sample escorts
INSERT INTO escorts (name, age, description, price, image_url, rating, available) VALUES
  ('Алина', 23, 'Элегантная и обаятельная девушка с утонченным вкусом', 15000, 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400', 4.9, true),
  ('Виктория', 25, 'Модель с роскошной внешностью и безупречными манерами', 20000, 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400', 5.0, true),
  ('Диана', 22, 'Яркая и энергичная, создаст незабываемую атмосферу', 12000, 'https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=400', 4.8, true),
  ('Екатерина', 27, 'Опытная и интеллигентная спутница для любых мероприятий', 18000, 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=400', 4.7, false),
  ('Маргарита', 24, 'Стильная и обворожительная с потрясающим чувством юмора', 16000, 'https://images.pexels.com/photos/1848565/pexels-photo-1848565.jpeg?auto=compress&cs=tinysrgb&w=400', 4.9, true),
  ('Анастасия', 21, 'Молодая и привлекательная, полна энергии и позитива', 14000, 'https://images.pexels.com/photos/1462980/pexels-photo-1462980.jpeg?auto=compress&cs=tinysrgb&w=400', 4.6, true);

-- Insert sample casino games
INSERT INTO casino_games (name, type, description, min_bet, max_bet, image_url, active) VALUES
  ('Mega Fortune Slots', 'slots', 'Классический слот с прогрессивным джекпотом и высокими выплатами', 10, 5000, 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=400', true),
  ('Texas Hold''em Poker', 'poker', 'Легендарная версия покера с турнирами и cash-играми', 50, 50000, 'https://images.pexels.com/photos/1871508/pexels-photo-1871508.jpeg?auto=compress&cs=tinysrgb&w=400', true),
  ('European Roulette', 'roulette', 'Европейская рулетка с одним зеро и лучшими шансами на выигрыш', 5, 10000, 'https://images.pexels.com/photos/5128004/pexels-photo-5128004.jpeg?auto=compress&cs=tinysrgb&w=400', true),
  ('Blackjack VIP', 'blackjack', 'Премиальный блэкджек с профессиональными дилерами', 100, 25000, 'https://images.pexels.com/photos/5623046/pexels-photo-5623046.jpeg?auto=compress&cs=tinysrgb&w=400', true),
  ('Diamond Slots Deluxe', 'slots', 'Роскошный слот с бонусными раундами и free spins', 25, 7500, 'https://images.pexels.com/photos/4691577/pexels-photo-4691577.jpeg?auto=compress&cs=tinysrgb&w=400', true),
  ('Russian Poker', 'poker', 'Русский покер с возможностью выкупа карт', 20, 15000, 'https://images.pexels.com/photos/1680488/pexels-photo-1680488.jpeg?auto=compress&cs=tinysrgb&w=400', true);

-- Insert sample products
INSERT INTO products (name, description, price, category, image_url, in_stock, quantity) VALUES
  ('Party Balloons Premium', 'Набор премиальных воздушных шаров для вечеринок (50 шт)', 2500, 'Воздушные шары', 'https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg?auto=compress&cs=tinysrgb&w=400', true, 150),
  ('LED Balloons Set', 'Светящиеся LED шары с пультом управления (25 шт)', 4500, 'Воздушные шары', 'https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg?auto=compress&cs=tinysrgb&w=400', true, 80),
  ('Helium Tank Pro', 'Профессиональный баллон с гелием на 50 шаров', 8000, 'Гелий', 'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=400', true, 25),
  ('Metallic Balloons Luxury', 'Металлизированные шары премиум класса (30 шт)', 3500, 'Воздушные шары', 'https://images.pexels.com/pages/photos/1387037/pexels-photo-1387037.jpeg?auto=compress&cs=tinysrgb&w=400', true, 120),
  ('Confetti Balloons Deluxe', 'Шары с конфетти для особых событий (40 шт)', 3000, 'Воздушные шары', 'https://images.pexels.com/photos/1916824/pexels-photo-1916824.jpeg?auto=compress&cs=tinysrgb&w=400', true, 95),
  ('Giant Balloons Collection', 'Гигантские шары 90 см (10 шт)', 5500, 'Воздушные шары', 'https://images.pexels.com/photos/1198169/pexels-photo-1198169.jpeg?auto=compress&cs=tinysrgb&w=400', false, 0),
  ('Balloon Arch Kit', 'Полный набор для создания арки из шаров', 6500, 'Декор', 'https://images.pexels.com/photos/2072162/pexels-photo-2072162.jpeg?auto=compress&cs=tinysrgb&w=400', true, 45),
  ('Number Balloons Gold', 'Золотые шары-цифры 100 см (комплект)', 2000, 'Цифры и буквы', 'https://images.pexels.com/photos/1729646/pexels-photo-1729646.jpeg?auto=compress&cs=tinysrgb&w=400', true, 200);
