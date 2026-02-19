import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'equipment/:id', loadComponent: () => import('./pages/equipment-detail/equipment-detail.component').then(m => m.EquipmentDetailComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'my-bookings', loadComponent: () => import('./pages/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent), canActivate: [authGuard] },
  { path: 'how-it-works', loadComponent: () => import('./pages/how-it-works/how-it-works.component').then(m => m.HowItWorksComponent) },
  { path: '**', redirectTo: '' }
];
