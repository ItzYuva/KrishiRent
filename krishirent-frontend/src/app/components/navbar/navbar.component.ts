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
    <nav [class]="'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ' + (scrolled() ? 'shadow-lg' : '')"
         [style.background]="scrolled() ? 'var(--bg-nav)' : 'var(--bg-nav)'"
         [style.backdropFilter]="scrolled() ? 'blur(12px)' : 'none'">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2 no-underline">
            <span class="text-2xl">🌾</span>
            <span class="text-xl font-bold bg-gradient-to-r from-green-300 to-yellow-300 bg-clip-text text-transparent">
              KrishiRent
            </span>
          </a>

          <!-- Desktop Nav -->
          <div class="hidden md:flex items-center gap-6">
            <a routerLink="/" routerLinkActive="!text-amber-400" [routerLinkActiveOptions]="{exact: true}"
               class="text-white/80 hover:text-white transition-colors text-sm font-medium relative group no-underline">
              Home
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all group-hover:w-full"></span>
            </a>
            <a routerLink="/how-it-works" routerLinkActive="!text-amber-400"
               class="text-white/80 hover:text-white transition-colors text-sm font-medium relative group no-underline">
              How It Works
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all group-hover:w-full"></span>
            </a>
            @if (auth.isLoggedIn()) {
              <a routerLink="/my-bookings" routerLinkActive="!text-amber-400"
                 class="text-white/80 hover:text-white transition-colors text-sm font-medium relative group no-underline">
                My Bookings
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all group-hover:w-full"></span>
              </a>
            }
          </div>

          <!-- Right Section -->
          <div class="flex items-center gap-3">
            <!-- Theme Toggle -->
            <button (click)="theme.toggle()"
                    class="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all cursor-pointer border-0">
              <span class="text-lg transition-transform duration-500"
                    [style.transform]="theme.isDark() ? 'rotate(360deg)' : 'rotate(0deg)'">
                {{ theme.isDark() ? '🌙' : '🌞' }}
              </span>
            </button>

            <!-- Auth Buttons (Desktop) -->
            <div class="hidden md:flex items-center gap-2">
              @if (auth.isLoggedIn()) {
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-semibold">
                    {{ auth.user()!.fullName.charAt(0) }}
                  </div>
                  <span class="text-white text-sm">{{ auth.user()!.fullName.split(' ')[0] }}</span>
                  <button (click)="logout()"
                          class="text-white/70 hover:text-white text-sm transition-colors cursor-pointer bg-transparent border-0">
                    Logout
                  </button>
                </div>
              } @else {
                <a routerLink="/login"
                   class="text-white text-sm px-4 py-1.5 rounded-lg border border-white/30 hover:bg-white/10 transition-all no-underline">
                  Login
                </a>
                <a routerLink="/register"
                   class="text-white text-sm px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 transition-all no-underline font-medium">
                  Register
                </a>
              }
            </div>

            <!-- Mobile Menu Button -->
            <button (click)="mobileOpen.set(!mobileOpen())"
                    class="md:hidden w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all cursor-pointer border-0">
              <span class="text-white text-lg">{{ mobileOpen() ? '✕' : '☰' }}</span>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        @if (mobileOpen()) {
          <div class="md:hidden pb-4 border-t border-white/10 mt-2 pt-4 space-y-3">
            <a routerLink="/" (click)="mobileOpen.set(false)"
               class="block text-white/80 hover:text-white transition-colors text-sm py-2 no-underline">Home</a>
            <a routerLink="/how-it-works" (click)="mobileOpen.set(false)"
               class="block text-white/80 hover:text-white transition-colors text-sm py-2 no-underline">How It Works</a>
            @if (auth.isLoggedIn()) {
              <a routerLink="/my-bookings" (click)="mobileOpen.set(false)"
                 class="block text-white/80 hover:text-white transition-colors text-sm py-2 no-underline">My Bookings</a>
              <button (click)="logout(); mobileOpen.set(false)"
                      class="block text-white/70 hover:text-white text-sm py-2 cursor-pointer bg-transparent border-0">Logout</button>
            } @else {
              <a routerLink="/login" (click)="mobileOpen.set(false)"
                 class="block text-white/80 hover:text-white transition-colors text-sm py-2 no-underline">Login</a>
              <a routerLink="/register" (click)="mobileOpen.set(false)"
                 class="block text-amber-400 hover:text-amber-300 transition-colors text-sm py-2 font-medium no-underline">Register</a>
            }
          </div>
        }
      </div>
    </nav>
    <div class="h-16"></div>
  `
})
export class NavbarComponent {
  scrolled = signal(false);
  mobileOpen = signal(false);

  constructor(
    public theme: ThemeService,
    public auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 20);
  }

  logout() {
    this.auth.logout();
    this.toast.show('Logged out successfully', 'info');
    this.router.navigate(['/']);
  }
}
