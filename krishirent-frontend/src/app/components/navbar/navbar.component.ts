import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
         [style.background]="'var(--bg-nav)'"
         [style.boxShadow]="scrolled() ? '0 2px 16px rgba(0,0,0,0.3)' : 'none'">
      <div class="container-app">
        <div class="flex items-center justify-between h-16">
          <a routerLink="/" class="flex items-center gap-2 no-underline flex-shrink-0">
            <span class="text-2xl">🌾</span>
            <span class="text-xl font-bold text-green-300">KrishiRent</span>
          </a>

          <div class="hidden md:flex items-center gap-8">
            <a routerLink="/" routerLinkActive="nav-active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Home</a>
            <a routerLink="/how-it-works" routerLinkActive="nav-active" class="nav-link">How It Works</a>
            @if (auth.isLoggedIn()) {
              <a routerLink="/my-bookings" routerLinkActive="nav-active" class="nav-link">My Bookings</a>
            }
            <a routerLink="/admin" routerLinkActive="nav-active" class="nav-link">Admin</a>
          </div>

          <div class="flex items-center gap-3">
            <button (click)="theme.toggle()"
                    class="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border border-white/20 bg-white/10 hover:bg-white/20 transition-all"
                    style="font-size:0;">
              <span class="text-lg block transition-transform duration-500"
                    [style.transform]="theme.isDark() ? 'rotate(360deg)' : 'rotate(0deg)'">
                {{ theme.isDark() ? '🌙' : '🌞' }}
              </span>
            </button>

            <div class="hidden md:flex items-center gap-3">
              @if (auth.isLoggedIn()) {
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style="background:var(--accent);">
                    {{ auth.user()!.fullName.charAt(0) }}
                  </div>
                  <span class="text-white/90 text-sm font-medium">{{ auth.user()!.fullName.split(' ')[0] }}</span>
                  <button (click)="logout()" class="text-white/60 hover:text-white text-sm cursor-pointer bg-transparent border-0 transition-colors">Logout</button>
                </div>
              } @else {
                <a routerLink="/login" class="text-white/90 text-sm px-4 py-2 rounded-lg border border-white/25 hover:bg-white/10 transition-all no-underline">Login</a>
                <a routerLink="/register" class="text-white text-sm px-5 py-2 rounded-lg font-medium no-underline" style="background:var(--accent);">Register</a>
              }
            </div>

            <button (click)="mobileOpen.set(!mobileOpen())"
                    class="md:hidden w-10 h-10 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 cursor-pointer border-0">
              <span class="text-white text-xl">{{ mobileOpen() ? '✕' : '☰' }}</span>
            </button>
          </div>
        </div>

        @if (mobileOpen()) {
          <div class="md:hidden pb-4 border-t border-white/10 mt-2 pt-4 space-y-2">
            <a routerLink="/" (click)="mobileOpen.set(false)" class="block text-white/80 hover:text-white py-2 text-sm no-underline">Home</a>
            <a routerLink="/how-it-works" (click)="mobileOpen.set(false)" class="block text-white/80 hover:text-white py-2 text-sm no-underline">How It Works</a>
            <a routerLink="/admin" (click)="mobileOpen.set(false)" class="block text-white/80 hover:text-white py-2 text-sm no-underline">Admin</a>
            @if (auth.isLoggedIn()) {
              <a routerLink="/my-bookings" (click)="mobileOpen.set(false)" class="block text-white/80 hover:text-white py-2 text-sm no-underline">My Bookings</a>
              <button (click)="logout(); mobileOpen.set(false)" class="block text-white/60 text-sm py-2 cursor-pointer bg-transparent border-0">Logout</button>
            } @else {
              <a routerLink="/login" (click)="mobileOpen.set(false)" class="block text-white/80 py-2 text-sm no-underline">Login</a>
              <a routerLink="/register" (click)="mobileOpen.set(false)" class="block text-amber-400 py-2 text-sm font-medium no-underline">Register</a>
            }
          </div>
        }
      </div>
    </nav>
    <div class="h-16"></div>
  `,
  styles: [`
    .nav-link {
      color: rgba(255,255,255,0.7);
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      position: relative;
      padding-bottom: 2px;
      transition: color 0.2s;
    }
    .nav-link:hover { color: white; }
    .nav-link.nav-active { color: var(--accent) !important; }
    .nav-link.nav-active::after {
      content: '';
      position: absolute;
      bottom: -2px; left: 0; right: 0;
      height: 2px;
      background: var(--accent);
      border-radius: 1px;
    }
  `]
})
export class NavbarComponent {
  scrolled = signal(false);
  mobileOpen = signal(false);
  constructor(public theme: ThemeService, public auth: AuthService, private router: Router, private toast: ToastService) {}
  @HostListener('window:scroll') onScroll() { this.scrolled.set(window.scrollY > 20); }
  logout() { this.auth.logout(); this.toast.show('Logged out successfully', 'info'); this.router.navigate(['/']); }
}
