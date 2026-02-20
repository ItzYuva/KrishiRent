import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
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
    @if (!isDashboardRoute()) {
      <app-navbar />
    }
    <main [style.minHeight]="isDashboardRoute() ? '100vh' : 'calc(100vh - 140px)'">
      <router-outlet />
    </main>
    @if (!isDashboardRoute()) {
      <app-footer />
    }
    <app-toast />
  `,
  styles: []
})
export class AppComponent {
  constructor(private router: Router) {}

  isDashboardRoute(): boolean {
    const url = this.router.url;
    return url.startsWith('/farmer') || url.startsWith('/owner') || url.startsWith('/admin');
  }
}
