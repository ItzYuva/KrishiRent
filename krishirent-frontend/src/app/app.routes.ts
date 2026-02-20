import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'auth', loadComponent: () => import('./pages/auth/auth.component').then(m => m.AuthComponent) },
  { path: 'farmer', loadComponent: () => import('./pages/farmer/farmer.component').then(m => m.FarmerComponent), canActivate: [authGuard], data: { roles: ['FARMER'] } },
  { path: 'owner', loadComponent: () => import('./pages/agent/agent.component').then(m => m.AgentComponent), canActivate: [authGuard], data: { roles: ['AGENT'] } },
  { path: 'admin', loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent), canActivate: [authGuard], data: { roles: ['ADMIN'] } },
  { path: 'bookings', loadComponent: () => import('./pages/bookings/bookings.component').then(m => m.BookingsComponent), canActivate: [authGuard] },
  { path: 'payment', loadComponent: () => import('./pages/payment/payment.component').then(m => m.PaymentComponent), canActivate: [authGuard] },
  { path: 'equipment/:id', loadComponent: () => import('./pages/equipment-detail/equipment-detail.component').then(m => m.EquipmentDetailComponent) },
  { path: '**', redirectTo: '' }
];
