import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal(true);

  constructor() {
    const stored = localStorage.getItem('krishirent_theme');
    if (stored) {
      this.isDark.set(stored === 'dark');
    }
  }
}
