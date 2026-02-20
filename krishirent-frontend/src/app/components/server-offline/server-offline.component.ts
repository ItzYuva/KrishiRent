import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-server-offline',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (api.serverOffline()) {
      <div class="fixed top-0 left-0 right-0 z-[200] text-center py-2.5 text-sm font-medium"
           style="background: rgba(239,68,68,0.15); color: #ef4444; border-bottom: 1px solid rgba(239,68,68,0.3); backdrop-filter: blur(10px);">
        Server is offline — using demo data.
        <button (click)="retry()" class="ml-3 underline cursor-pointer bg-transparent border-0 font-medium" style="color: #ef4444;">
          Retry Connection
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
