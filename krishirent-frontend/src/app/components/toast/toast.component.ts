import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-20 right-4 z-[100] space-y-2">
      @for (toast of toastService.toasts(); track toast.id) {
        <div [class]="'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg min-w-[280px] text-sm font-medium ' +
                      (toast.removing ? 'animate-slide-out' : 'animate-slide-in')"
             [style.background]="toast.type === 'success' ? '#2E7D32' : toast.type === 'error' ? '#C62828' : 'var(--bg-nav)'"
             style="color: white;">
          <span>{{ toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️' }}</span>
          <span>{{ toast.message }}</span>
          <button (click)="toastService.dismiss(toast.id)"
                  class="ml-auto text-white/70 hover:text-white cursor-pointer bg-transparent border-0 text-lg">✕</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .animate-slide-in { animation: slideInRight 0.3s ease-out; }
    .animate-slide-out { animation: slideOutRight 0.3s ease-in; }
    @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
