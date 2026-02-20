import { Injectable } from '@angular/core';
import { Equipment, Booking, User, Payment } from '../models/equipment.model';

@Injectable({ providedIn: 'root' })
export class MockDataService {

  getEquipment(): Equipment[] {
    return [
      { id: 1, name: 'Mahindra 575 DI Tractor', type: 'TRACTOR', description: 'Powerful 45 HP tractor suitable for all farming operations', hourlyRate: 500, location: 'Nashik Road', district: 'Nashik', imageUrl: '', ownerId: 2, ownerName: 'AgriFleet Solutions', status: 'AVAILABLE', createdAt: '2026-01-15T10:00:00' },
      { id: 2, name: 'John Deere Harvester W70', type: 'HARVESTER', description: 'Self-propelled combine harvester for wheat and rice', hourlyRate: 1200, location: 'Shirdi', district: 'Ahmednagar', imageUrl: '', ownerId: 2, ownerName: 'AgriFleet Solutions', status: 'AVAILABLE', createdAt: '2026-01-16T10:00:00' },
      { id: 3, name: 'Honda WB30X Water Pump', type: 'PUMP', description: '3-inch water pump with high discharge capacity', hourlyRate: 150, location: 'Kolhapur City', district: 'Kolhapur', imageUrl: '', ownerId: 3, ownerName: 'Farm Tools Hub', status: 'RENTED', createdAt: '2026-01-17T10:00:00' },
      { id: 4, name: 'Drip Irrigation Kit - 1 Acre', type: 'IRRIGATION', description: 'Complete drip irrigation setup for 1 acre farm', hourlyRate: 200, location: 'Sangli Market', district: 'Sangli', imageUrl: '', ownerId: 3, ownerName: 'Farm Tools Hub', status: 'AVAILABLE', createdAt: '2026-01-18T10:00:00' },
      { id: 5, name: 'ASPEE Power Sprayer', type: 'SPRAYER', description: '16L battery-operated sprayer for pesticide application', hourlyRate: 100, location: 'Pune Station', district: 'Pune', imageUrl: '', ownerId: 2, ownerName: 'AgriFleet Solutions', status: 'AVAILABLE', createdAt: '2026-01-19T10:00:00' },
      { id: 6, name: 'Seed Drill Machine', type: 'SEEDER', description: 'Multi-crop seed drill for precise sowing', hourlyRate: 350, location: 'Aurangabad', district: 'Aurangabad', imageUrl: '', ownerId: 3, ownerName: 'Farm Tools Hub', status: 'MAINTENANCE', createdAt: '2026-01-20T10:00:00' },
      { id: 7, name: 'MB Plough - 2 Bottom', type: 'PLOUGH', description: 'Heavy duty reversible plough for deep tillage', hourlyRate: 300, location: 'Nagpur', district: 'Nagpur', imageUrl: '', ownerId: 2, ownerName: 'AgriFleet Solutions', status: 'AVAILABLE', createdAt: '2026-01-21T10:00:00' },
      { id: 8, name: 'Paddy Thresher Machine', type: 'THRESHER', description: 'High capacity thresher for paddy and wheat', hourlyRate: 400, location: 'Solapur', district: 'Solapur', imageUrl: '', ownerId: 3, ownerName: 'Farm Tools Hub', status: 'AVAILABLE', createdAt: '2026-01-22T10:00:00' }
    ];
  }

  getBookings(): Booking[] {
    return [
      { id: 1, equipmentId: 1, equipmentName: 'Mahindra 575 DI Tractor', farmerId: 1, farmerName: 'Rajesh Patil', startTime: '2026-02-20T08:00:00', endTime: '2026-02-20T14:00:00', totalHours: 6, baseCost: 3000, platformFee: 300, totalCost: 3300, status: 'CONFIRMED', createdAt: '2026-02-18T10:00:00' },
      { id: 2, equipmentId: 3, equipmentName: 'Honda WB30X Water Pump', farmerId: 1, farmerName: 'Rajesh Patil', startTime: '2026-02-19T06:00:00', endTime: '2026-02-19T12:00:00', totalHours: 6, baseCost: 900, platformFee: 90, totalCost: 990, status: 'ACTIVE', createdAt: '2026-02-17T10:00:00' },
      { id: 3, equipmentId: 2, equipmentName: 'John Deere Harvester W70', farmerId: 4, farmerName: 'Suresh Jadhav', startTime: '2026-02-15T07:00:00', endTime: '2026-02-15T15:00:00', totalHours: 8, baseCost: 9600, platformFee: 960, totalCost: 10560, status: 'COMPLETED', createdAt: '2026-02-13T10:00:00' },
      { id: 4, equipmentId: 5, equipmentName: 'ASPEE Power Sprayer', farmerId: 4, farmerName: 'Suresh Jadhav', startTime: '2026-02-22T09:00:00', endTime: '2026-02-22T13:00:00', totalHours: 4, baseCost: 400, platformFee: 40, totalCost: 440, status: 'PENDING', createdAt: '2026-02-19T10:00:00' },
      { id: 5, equipmentId: 7, equipmentName: 'MB Plough - 2 Bottom', farmerId: 1, farmerName: 'Rajesh Patil', startTime: '2026-02-10T08:00:00', endTime: '2026-02-10T16:00:00', totalHours: 8, baseCost: 2400, platformFee: 240, totalCost: 2640, status: 'CANCELLED', createdAt: '2026-02-08T10:00:00' }
    ];
  }

  getUsers(): User[] {
    return [
      { id: 1, fullName: 'Rajesh Patil', email: 'rajesh@demo.com', phone: '9876543210', role: 'FARMER', district: 'Nashik', createdAt: '2026-01-10T10:00:00' },
      { id: 2, fullName: 'AgriFleet Solutions', email: 'fleet@demo.com', phone: '9876543211', role: 'AGENT', district: 'Pune', createdAt: '2026-01-08T10:00:00' },
      { id: 3, fullName: 'Farm Tools Hub', email: 'tools@demo.com', phone: '9876543212', role: 'AGENT', district: 'Kolhapur', createdAt: '2026-01-09T10:00:00' },
      { id: 4, fullName: 'Suresh Jadhav', email: 'suresh@demo.com', phone: '9876543213', role: 'FARMER', district: 'Ahmednagar', createdAt: '2026-01-12T10:00:00' },
      { id: 5, fullName: 'Admin User', email: 'admin@krishirent.com', phone: '9876543200', role: 'ADMIN', district: 'Mumbai', createdAt: '2026-01-01T10:00:00' }
    ];
  }

  getPayments(): Payment[] {
    return [
      { id: 1, bookingId: 3, farmerId: 4, ownerId: 2, amount: 10560, platformFee: 960, ownerAmount: 9600, paymentMethod: 'UPI', status: 'PAID', createdAt: '2026-02-15T15:30:00' },
      { id: 2, bookingId: 1, farmerId: 1, ownerId: 2, amount: 3300, platformFee: 300, ownerAmount: 3000, paymentMethod: 'CARD', status: 'PAID', createdAt: '2026-02-18T10:30:00' },
      { id: 3, bookingId: 2, farmerId: 1, ownerId: 3, amount: 990, platformFee: 90, ownerAmount: 900, paymentMethod: 'UPI', status: 'PENDING', createdAt: '2026-02-17T10:30:00' }
    ];
  }

  getStats() {
    return {
      totalUsers: 5,
      totalEquipment: 8,
      totalBookings: 5,
      totalRevenue: 14850,
      activeBookings: 1,
      completedBookings: 1,
      pendingBookings: 1,
      cancelledBookings: 1
    };
  }
}
