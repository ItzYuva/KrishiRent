export interface Equipment {
  id: number;
  name: string;
  type: string;
  description: string;
  hourlyRate: number;
  location: string;
  district: string;
  imageUrl: string;
  ownerId: number;
  ownerName: string | null;
  status: string;
  createdAt: string;
}

export interface Booking {
  id: number;
  equipmentId: number;
  equipmentName: string;
  farmerId: number;
  farmerName: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  baseCost: number;
  platformFee: number;
  totalCost: number;
  status: string;
  createdAt: string;
}

export interface BookingRequest {
  equipmentId: number;
  farmerId: number;
  startTime: string;
  endTime: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  district: string;
  createdAt: string;
}

export interface UserRegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  district: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface Payment {
  id: number;
  bookingId: number;
  farmerId: number;
  ownerId: number;
  amount: number;
  platformFee: number;
  ownerAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

export interface PaymentRequest {
  bookingId: number;
  amount: number;
  platformFee: number;
  paymentMethod: string;
}

export const CATEGORY_IMAGES: { [key: string]: string } = {
  TRACTOR: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600',
  HARVESTER: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600',
  IRRIGATION: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600',
  PUMP: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600',
  SPRAYER: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600',
  SEEDER: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600',
  PLOUGH: 'https://images.unsplash.com/photo-1500595046743-cd271d694e30?w=600',
  THRESHER: 'https://images.unsplash.com/photo-1500595046743-cd271d694e30?w=600',
  DEFAULT: 'https://images.unsplash.com/photo-1500595046743-cd271d694e30?w=600'
};

export const CATEGORY_COLORS: { [key: string]: string } = {
  TRACTOR: '#2E7D32',
  HARVESTER: '#E65100',
  IRRIGATION: '#0277BD',
  PUMP: '#0277BD',
  SPRAYER: '#6A1B9A',
  SEEDER: '#558B2F',
  PLOUGH: '#4E342E',
  THRESHER: '#4E342E'
};

export const STATUS_CONFIG: { [key: string]: { color: string; bg: string; pulse: boolean } } = {
  PENDING: { color: '#FF8F00', bg: '#FFF3E0', pulse: false },
  CONFIRMED: { color: '#1565C0', bg: '#E3F2FD', pulse: false },
  ACTIVE: { color: '#2E7D32', bg: '#E8F5E9', pulse: true },
  COMPLETED: { color: '#757575', bg: '#F5F5F5', pulse: false },
  CANCELLED: { color: '#C62828', bg: '#FFEBEE', pulse: false }
};
