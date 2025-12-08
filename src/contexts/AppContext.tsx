import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, Wallet, WalletTransaction, Booking, Motor } from '@/types';
import { mockMotors } from '@/data/mockMotors';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  wallet: Wallet | null;
  transactions: WalletTransaction[];
  bookings: Booking[];
  motors: Motor[];
  isLoading: boolean;
  login: (userData: Partial<User>) => void;
  logout: () => void;
  topUp: (amount: number) => Promise<boolean>;
  createBooking: (motorId: string, startDate: Date, endDate: Date) => Promise<{ success: boolean; message: string }>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [motors] = useState<Motor[]>(mockMotors);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback((userData: Partial<User>) => {
    const newUser: User = {
      id: userData.id || `user_${Date.now()}`,
      name: userData.name || 'User',
      email: userData.email || '',
      phone: userData.phone || '',
      photoURL: userData.photoURL || '',
      createdAt: new Date(),
    };
    setUser(newUser);
    setWallet({ userId: newUser.id, balance: 0 });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setWallet(null);
    setTransactions([]);
    setBookings([]);
  }, []);

  const topUp = useCallback(async (amount: number): Promise<boolean> => {
    if (!wallet || !user) return false;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    const balanceBefore = wallet.balance;
    const balanceAfter = balanceBefore + amount;
    
    const transaction: WalletTransaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      type: 'topup',
      amount,
      balanceBefore,
      balanceAfter,
      description: 'Top Up Saldo',
      timestamp: new Date(),
    };
    
    setWallet({ ...wallet, balance: balanceAfter });
    setTransactions(prev => [transaction, ...prev]);
    setIsLoading(false);
    
    return true;
  }, [wallet, user]);

  const createBooking = useCallback(async (
    motorId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<{ success: boolean; message: string }> => {
    if (!wallet || !user) {
      return { success: false, message: 'Silakan login terlebih dahulu' };
    }

    const motor = motors.find(m => m.id === motorId);
    if (!motor) {
      return { success: false, message: 'Motor tidak ditemukan' };
    }

    // Calculate days
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const totalPrice = motor.pricePerDay * diffDays;

    // Check balance
    if (wallet.balance < totalPrice) {
      return { 
        success: false, 
        message: `Saldo tidak cukup. Anda membutuhkan Rp ${totalPrice.toLocaleString('id-ID')}` 
      };
    }

    // Check for conflicting bookings
    const hasConflict = bookings.some(
      b => b.motorId === motorId && 
           b.status !== 'cancelled' &&
           ((startDate >= b.startDate && startDate <= b.endDate) ||
            (endDate >= b.startDate && endDate <= b.endDate))
    );

    if (hasConflict) {
      return { success: false, message: 'Motor sudah dibooking pada tanggal tersebut' };
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

    // Create booking
    const booking: Booking = {
      id: `booking_${Date.now()}`,
      oderId: user.id,
      motorId,
      motor,
      startDate,
      endDate,
      totalPrice,
      status: 'confirmed',
      paymentMethod: 'wallet',
      createdAt: new Date(),
    };

    // Deduct balance
    const balanceBefore = wallet.balance;
    const balanceAfter = balanceBefore - totalPrice;

    const transaction: WalletTransaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      type: 'payment',
      amount: totalPrice,
      balanceBefore,
      balanceAfter,
      refId: booking.id,
      description: `Pembayaran sewa ${motor.name}`,
      timestamp: new Date(),
    };

    setWallet({ ...wallet, balance: balanceAfter });
    setTransactions(prev => [transaction, ...prev]);
    setBookings(prev => [booking, ...prev]);
    setIsLoading(false);

    return { success: true, message: 'Booking berhasil!' };
  }, [wallet, user, motors, bookings]);

  const cancelBooking = useCallback(async (bookingId: string): Promise<boolean> => {
    if (!wallet || !user) return false;

    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || booking.status === 'cancelled') return false;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Refund
    const balanceBefore = wallet.balance;
    const balanceAfter = balanceBefore + booking.totalPrice;

    const transaction: WalletTransaction = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      type: 'topup',
      amount: booking.totalPrice,
      balanceBefore,
      balanceAfter,
      refId: booking.id,
      description: `Refund pembatalan ${booking.motor?.name || 'Motor'}`,
      timestamp: new Date(),
    };

    setWallet({ ...wallet, balance: balanceAfter });
    setTransactions(prev => [transaction, ...prev]);
    setBookings(prev => 
      prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' as const } : b)
    );
    setIsLoading(false);

    return true;
  }, [wallet, user, bookings]);

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      wallet,
      transactions,
      bookings,
      motors,
      isLoading,
      login,
      logout,
      topUp,
      createBooking,
      cancelBooking,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
