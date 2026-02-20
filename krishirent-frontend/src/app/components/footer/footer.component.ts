import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer style="background: var(--bg-secondary); border-top: 1px solid var(--border);" class="mt-16">
      <div class="container-app py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          <div>
            <div class="flex items-center gap-2 mb-3">
              <span class="text-2xl">🌾</span>
              <span class="text-lg font-bold" style="color: var(--accent); font-family: 'Space Grotesk', sans-serif;">KrishiRent</span>
            </div>
            <p class="text-sm leading-relaxed" style="color: var(--text-muted);">
              Empowering Indian Farmers with affordable equipment rental. Book by the hour, grow by the season.
            </p>
          </div>
          <div>
            <h4 class="font-semibold mb-4 text-sm uppercase tracking-wider" style="color: var(--accent); font-family: 'Space Grotesk', sans-serif;">Quick Links</h4>
            <div class="space-y-2.5">
              <a routerLink="/" class="block text-sm transition-colors no-underline hover:!text-white" style="color: var(--text-muted);">Home</a>
              <a routerLink="/auth" class="block text-sm transition-colors no-underline hover:!text-white" style="color: var(--text-muted);">Get Started</a>
              <a routerLink="/bookings" class="block text-sm transition-colors no-underline hover:!text-white" style="color: var(--text-muted);">Bookings</a>
            </div>
          </div>
          <div>
            <h4 class="font-semibold mb-4 text-sm uppercase tracking-wider" style="color: var(--accent); font-family: 'Space Grotesk', sans-serif;">Contact</h4>
            <div class="space-y-2.5 text-sm" style="color: var(--text-muted);">
              <p>support&#64;krishirent.com</p>
              <p>1800-KRISHI-00</p>
              <p>Mumbai, Maharashtra, India</p>
            </div>
          </div>
        </div>
        <div class="mt-10 pt-6 text-center text-sm" style="border-top: 1px solid var(--border); color: var(--text-muted);">
          &copy; 2026 KrishiRent. All rights reserved.
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
