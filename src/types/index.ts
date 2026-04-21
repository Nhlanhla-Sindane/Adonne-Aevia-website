export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  paymentProof?: string;
  preferredContact: 'whatsapp' | 'email' | 'instagram';
  contactValue: string;
  trackingNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 
  | 'pending'
  | 'pop_verified'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: string;
  date: Date;
  time: string;
  status: BookingStatus;
  notes?: string;
  preferredContact: 'whatsapp' | 'email' | 'instagram';
  contactValue: string;
  createdAt: Date;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  images: string[];
  category: 'lashes' | 'wigs' | 'other';
}

export interface NotificationPreference {
  type: 'whatsapp' | 'email' | 'instagram';
  value: string;
}

export interface AdminSettings {
  isAway: boolean;
  awayMessage?: string;
  businessHours: {
    open: string;
    close: string;
    days: string[];
  };
}
