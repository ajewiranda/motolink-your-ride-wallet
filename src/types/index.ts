export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoURL: string;
  createdAt: Date;
}

export interface Motor {
  id: string;
  name: string;
  brand: string;
  type: 'matic' | 'manual';
  cc: number;
  year: number;
  pricePerDay: number;
  location: string;
  rating: number;
  totalReviews: number;
  images: string[];
  description: string;
  features: string[];
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  oderId: string;
  motorId: string;
  motor?: Motor;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentMethod: 'wallet';
  createdAt: Date;
}

export interface Wallet {
  userId: string;
  balance: number;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'topup' | 'payment';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  refId?: string;
  description: string;
  timestamp: Date;
}

export type TransmissionType = 'all' | 'matic' | 'manual';

export interface FilterOptions {
  transmission: TransmissionType;
  minPrice: number;
  maxPrice: number;
  location: string;
}
