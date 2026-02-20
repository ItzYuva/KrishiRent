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
        <div [class]="'flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg min-w-[280px] text-sm font-medium border ' +
                      (toast.removing ? 'animate-slide-out' : 'animate-slide-in')"
             [style.background]="getBg(toast.type)"
             [style.borderColor]="getBorder(toast.type)"
             [style.color]="getColor(toast.type)">
          <span>{{ getIcon(toast.type) }}</span>
          <span class="flex-1">{{ toast.message }}</span>
          <button (click)="toastService.dismiss(toast.id)"
                  class="ml-auto opacity-60 hover:opacity-100 cursor-pointer bg-transparent border-0 text-lg"
                  [style.color]="getColor(toast.type)">✕</button>
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

  getBg(type: string) {
    const map: any = { success: 'rgba(34,197,94,0.1)', error: 'rgba(239,68,68,0.1)', warning: 'rgba(245,158,11,0.1)', info: 'rgba(59,130,246,0.1)' };
    return map[type] || map.info;
  }
  getBorder(type: string) {
    const map: any = { success: 'rgba(34,197,94,0.3)', error: 'rgba(239,68,68,0.3)', warning: 'rgba(245,158,11,0.3)', info: 'rgba(59,130,246,0.3)' };
    return map[type] || map.info;
  }
  getColor(type: string) {
    const map: any = { success: '#22c55e', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };
    return map[type] || map.info;
  }
  getIcon(type: string) {
    const map: any = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    return map[type] || map.info;
  }
}
