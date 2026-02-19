import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  removing?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  private counter = 0;

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = ++this.counter;
    this.toasts.update(t => [...t, { id, message, type }]);
    setTimeout(() => this.dismiss(id), 3000);
  }

  dismiss(id: number) {
    this.toasts.update(t => t.map(toast => toast.id === id ? { ...toast, removing: true } : toast));
    setTimeout(() => {
      this.toasts.update(t => t.filter(toast => toast.id !== id));
    }, 300);
  }
}
