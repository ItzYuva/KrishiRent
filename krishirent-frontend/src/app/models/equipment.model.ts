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

export type UserRole = 'FARMER' | 'AGENT' | 'ADMIN';

export const EQUIPMENT_TYPES = [
  { value: 'TRACTOR', label: 'Tractor', icon: '🚜' },
  { value: 'HARVESTER', label: 'Harvester', icon: '🌾' },
  { value: 'IRRIGATION', label: 'Irrigation', icon: '💧' },
  { value: 'PUMP', label: 'Pump', icon: '⛽' },
  { value: 'SPRAYER', label: 'Sprayer', icon: '🔫' },
  { value: 'SEEDER', label: 'Seeder', icon: '🌱' },
  { value: 'PLOUGH', label: 'Plough', icon: '⚙️' },
  { value: 'THRESHER', label: 'Thresher', icon: '🏭' }
];

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

export const STATUS_COLORS: { [key: string]: { text: string; bg: string } } = {
  AVAILABLE: { text: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
  RENTED: { text: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  MAINTENANCE: { text: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  PENDING: { text: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  CONFIRMED: { text: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  ACTIVE: { text: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
  COMPLETED: { text: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
  CANCELLED: { text: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  PAID: { text: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
  FAILED: { text: '#ef4444', bg: 'rgba(239,68,68,0.15)' }
};

export const DISTRICTS = [
  'Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Aurangabad',
  'Solapur', 'Kolhapur', 'Sangli', 'Satara', 'Ratnagiri',
  'Ahmednagar', 'Jalgaon', 'Dhule', 'Nanded', 'Latur',
  'Osmanabad', 'Beed', 'Parbhani', 'Hingoli', 'Washim'
];
