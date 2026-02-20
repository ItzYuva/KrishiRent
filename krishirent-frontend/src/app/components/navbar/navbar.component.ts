import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
         [style.background]="scrolled() ? 'rgba(10,15,10,0.98)' : 'rgba(10,15,10,0.85)'"
         [style.backdropFilter]="'blur(12px)'"
         [style.borderBottom]="scrolled() ? '1px solid rgba(34,197,94,0.12)' : '1px solid transparent'">
      <div class="container-app">
        <div class="flex items-center justify-between h-16">
          <a routerLink="/" class="flex items-center gap-2.5 no-underline flex-shrink-0">
            <span class="text-2xl">🌾</span>
            <span class="text-lg font-bold" style="color: var(--accent); font-family: 'Space Grotesk', sans-serif;">KrishiRent</span>
          </a>

          <div class="hidden md:flex items-center gap-7">
            <a routerLink="/" routerLinkActive="nav-active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Home</a>
            @if (auth.isLoggedIn()) {
              @if (auth.hasRole('FARMER')) {
                <a routerLink="/farmer" routerLinkActive="nav-active" class="nav-link">Dashboard</a>
              }
              @if (auth.hasRole('AGENT')) {
                <a routerLink="/owner" routerLinkActive="nav-active" class="nav-link">My Fleet</a>
              }
              @if (auth.hasRole('ADMIN')) {
                <a routerLink="/admin" routerLinkActive="nav-active" class="nav-link">Admin</a>
              }
              <a routerLink="/bookings" routerLinkActive="nav-active" class="nav-link">Bookings</a>
            }
          </div>

          <div class="flex items-center gap-3">
            <div class="hidden md:flex items-center gap-3">
              @if (auth.isLoggedIn()) {
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                       style="background: var(--accent); color: #000;">
                    {{ auth.user()!.fullName.charAt(0) }}
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-medium" style="color: var(--text-primary);">{{ auth.user()!.fullName.split(' ')[0] }}</span>
                    <span class="text-[10px] uppercase tracking-wider" style="color: var(--accent);">{{ auth.user()!.role === 'AGENT' ? 'OWNER' : auth.user()!.role }}</span>
                  </div>
                  <button (click)="logout()" class="ml-2 text-sm cursor-pointer bg-transparent border border-white/10 rounded-lg px-3 py-1.5 hover:border-red-500/50 hover:text-red-400 transition-all" style="color: var(--text-muted);">Logout</button>
                </div>
              } @else {
                <a routerLink="/auth" class="text-sm px-4 py-2 rounded-lg transition-all no-underline" style="color: var(--text-secondary); border: 1px solid var(--border);" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">Login</a>
                <a routerLink="/auth" [queryParams]="{mode: 'register'}" class="btn-primary text-sm no-underline">Get Started</a>
              }
            </div>

            <button (click)="mobileOpen.set(!mobileOpen())"
                    class="md:hidden w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer border-0"
                    style="background: var(--accent-soft);">
              <span style="color: var(--accent);" class="text-xl">{{ mobileOpen() ? '✕' : '☰' }}</span>
            </button>
          </div>
        </div>

        @if (mobileOpen()) {
          <div class="md:hidden pb-4 mt-2 pt-4 space-y-1" style="border-top: 1px solid var(--border);">
            <a routerLink="/" (click)="mobileOpen.set(false)" class="block py-2.5 px-3 rounded-lg text-sm no-underline transition-colors" style="color: var(--text-secondary);">Home</a>
            @if (auth.isLoggedIn()) {
              @if (auth.hasRole('FARMER')) {
                <a routerLink="/farmer" (click)="mobileOpen.set(false)" class="block py-2.5 px-3 rounded-lg text-sm no-underline" style="color: var(--text-secondary);">Dashboard</a>
              }
              @if (auth.hasRole('AGENT')) {
                <a routerLink="/owner" (click)="mobileOpen.set(false)" class="block py-2.5 px-3 rounded-lg text-sm no-underline" style="color: var(--text-secondary);">My Fleet</a>
              }
              @if (auth.hasRole('ADMIN')) {
                <a routerLink="/admin" (click)="mobileOpen.set(false)" class="block py-2.5 px-3 rounded-lg text-sm no-underline" style="color: var(--text-secondary);">Admin</a>
              }
              <a routerLink="/bookings" (click)="mobileOpen.set(false)" class="block py-2.5 px-3 rounded-lg text-sm no-underline" style="color: var(--text-secondary);">Bookings</a>
              <div class="pt-2 mt-2" style="border-top: 1px solid var(--border);">
                <button (click)="logout(); mobileOpen.set(false)" class="text-sm py-2.5 px-3 cursor-pointer bg-transparent border-0 text-red-400">Logout</button>
              </div>
            } @else {
              <div class="pt-2 mt-2 flex gap-2" style="border-top: 1px solid var(--border);">
                <a routerLink="/auth" (click)="mobileOpen.set(false)" class="btn-secondary text-sm no-underline flex-1 text-center">Login</a>
                <a routerLink="/auth" [queryParams]="{mode: 'register'}" (click)="mobileOpen.set(false)" class="btn-primary text-sm no-underline flex-1 text-center">Register</a>
              </div>
            }
          </div>
        }
      </div>
    </nav>
    <div class="h-16"></div>
  `,
  styles: [`
    .nav-link {
      color: var(--text-muted);
      font-size: 13px;
      font-weight: 500;
      text-decoration: none;
      position: relative;
      padding: 6px 0;
      transition: color 0.2s;
    }
    .nav-link:hover { color: var(--text-primary); }
    .nav-link.nav-active { color: var(--accent) !important; }
    .nav-link.nav-active::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 2px;
      background: var(--accent);
      border-radius: 1px;
    }
  `]
})
export class NavbarComponent {
  scrolled = signal(false);
  mobileOpen = signal(false);
  constructor(public auth: AuthService, private router: Router, private toast: ToastService) {}
  @HostListener('window:scroll') onScroll() { this.scrolled.set(window.scrollY > 20); }
  logout() { this.auth.logout(); this.toast.show('Logged out successfully', 'info'); this.router.navigate(['/']); }
}
