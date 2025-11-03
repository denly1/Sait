import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Escort {
  id: string;
  name: string;
  age: number;
  description: string;
  price: number;
  image_url: string;
  rating: number;
  available: boolean;
  created_at: string;
}

export interface CasinoGame {
  id: string;
  name: string;
  type: string;
  description: string;
  min_bet: number;
  max_bet: number;
  image_url: string;
  active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  in_stock: boolean;
  quantity: number;
  created_at: string;
}

export interface Booking {
  escort_id: string;
  customer_name: string;
  customer_phone: string;
  booking_date: string;
  duration: number;
  total_price: number;
}

export interface Order {
  product_id: string;
  customer_name: string;
  customer_phone: string;
  quantity: number;
  total_price: number;
}
