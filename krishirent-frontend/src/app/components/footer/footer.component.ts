import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer style="background: var(--bg-nav);" class="text-white mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Brand -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <span class="text-2xl">🌾</span>
              <span class="text-xl font-bold">KrishiRent</span>
            </div>
            <p class="text-white/60 text-sm leading-relaxed">
              Empowering Indian Farmers with affordable equipment rental. Book by the hour, grow by the season.
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="font-semibold mb-3 text-amber-400">Quick Links</h4>
            <div class="space-y-2">
              <a routerLink="/" class="block text-white/60 hover:text-white text-sm transition-colors no-underline">Home</a>
              <a routerLink="/how-it-works" class="block text-white/60 hover:text-white text-sm transition-colors no-underline">How It Works</a>
              <a routerLink="/my-bookings" class="block text-white/60 hover:text-white text-sm transition-colors no-underline">My Bookings</a>
            </div>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="font-semibold mb-3 text-amber-400">Contact</h4>
            <div class="space-y-2 text-white/60 text-sm">
              <p>📧 support&#64;krishirent.com</p>
              <p>📞 1800-KRISHI-00</p>
              <p>📍 Mumbai, Maharashtra, India</p>
            </div>
          </div>
        </div>

        <div class="border-t border-white/10 mt-8 pt-6 text-center text-white/40 text-sm">
          &copy; 2026 KrishiRent. All rights reserved. | Empowering Indian Farmers 🌾
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
