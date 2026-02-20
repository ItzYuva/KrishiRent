import { Injectable, signal, computed } from '@angular/core';
import { User, UserRole } from '../models/equipment.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<User | null>(null);

  user = this.currentUser.asReadonly();
  isLoggedIn = computed(() => this.currentUser() !== null);
  userRole = computed<UserRole | null>(() => {
    const u = this.currentUser();
    return u ? (u.role as UserRole) : null;
  });

  constructor() {
    const stored = localStorage.getItem('krishirent_user');
    if (stored) {
      try {
        this.currentUser.set(JSON.parse(stored));
      } catch {
        localStorage.removeItem('krishirent_user');
      }
    }
  }

  login(user: User) {
    this.currentUser.set(user);
    localStorage.setItem('krishirent_user', JSON.stringify(user));
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('krishirent_user');
  }

  hasRole(role: UserRole): boolean {
    return this.userRole() === role;
  }
}
