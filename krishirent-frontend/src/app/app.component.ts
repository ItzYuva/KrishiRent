import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ToastComponent } from './components/toast/toast.component';
import { ServerOfflineComponent } from './components/server-offline/server-offline.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastComponent, ServerOfflineComponent],
  template: `
    <app-server-offline />
    <app-navbar />
    <main style="min-height: calc(100vh - 140px);">
      <router-outlet />
    </main>
    <app-footer />
    <app-toast />
  `,
  styles: []
})
export class AppComponent {}
