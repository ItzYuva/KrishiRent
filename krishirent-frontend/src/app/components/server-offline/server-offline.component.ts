import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-server-offline',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (api.serverOffline()) {
      <div class="fixed top-0 left-0 right-0 z-[200] bg-red-600 text-white text-center py-2 text-sm font-medium">
        ⚠️ Server is offline. Please make sure the backend services are running.
        <button (click)="retry()" class="ml-3 underline cursor-pointer bg-transparent border-0 text-white font-medium">
          Retry
        </button>
      </div>
    }
  `
})
export class ServerOfflineComponent {
  constructor(public api: ApiService) {}

  retry() {
    this.api.serverOffline.set(false);
    window.location.reload();
  }
}
