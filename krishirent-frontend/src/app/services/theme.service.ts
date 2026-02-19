import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal(false);

  constructor() {
    const stored = localStorage.getItem('krishire_theme');
    if (stored) {
      this.isDark.set(stored === 'dark');
    } else {
      this.isDark.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    this.applyTheme();
  }

  toggle() {
    this.isDark.set(!this.isDark());
    this.applyTheme();
    localStorage.setItem('krishire_theme', this.isDark() ? 'dark' : 'light');
  }

  private applyTheme() {
    if (this.isDark()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
