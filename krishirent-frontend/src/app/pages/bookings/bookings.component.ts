import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { MockDataService } from '../../services/mock-data.service';
import { Booking, STATUS_COLORS } from '../../models/equipment.model';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container-app py-10">
      <div class="mb-8">
        <h1 class="text-2xl font-bold" style="color: var(--text-primary); font-family: 'Space Grotesk', sans-serif;">Booking History</h1>
        <p class="text-sm mt-1" style="color: var(--text-muted);">Track all your equipment bookings</p>
      </div>

      <!-- Filter tabs -->
      <div class="flex flex-wrap gap-2 mb-6">
        @for (f of filters; track f) {
          <button class="tab-btn" [class.active]="activeFilter() === f" (click)="activeFilter.set(f)">{{ f }}</button>
        }
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="stat-card">
          <div class="text-xs" style="color: var(--text-muted);">Total</div>
          <div class="text-xl font-bold" style="color: var(--text-primary); font-family: 'Space Grotesk';">{{ bookings().length }}</div>
        </div>
        <div class="stat-card">
          <div class="text-xs" style="color: var(--text-muted);">Active</div>
          <div class="text-xl font-bold" style="color: #22c55e; font-family: 'Space Grotesk';">{{ countByStatus('ACTIVE') + countByStatus('CONFIRMED') }}</div>
        </div>
        <div class="stat-card">
          <div class="text-xs" style="color: var(--text-muted);">Completed</div>
          <div class="text-xl font-bold" style="color: #8b5cf6; font-family: 'Space Grotesk';">{{ countByStatus('COMPLETED') }}</div>
        </div>
        <div class="stat-card">
          <div class="text-xs" style="color: var(--text-muted);">Total Spent</div>
          <div class="text-xl font-bold" style="color: var(--text-primary); font-family: 'Space Grotesk';">₹{{ totalSpent().toLocaleString() }}</div>
        </div>
      </div>

      <!-- Bookings list -->
      @if (filteredBookings().length === 0) {
        <div class="glass-card p-12 text-center">
          <div class="text-4xl mb-4">📋</div>
          <h3 class="text-lg font-semibold mb-2" style="color: var(--text-primary); font-family: 'Space Grotesk';">No bookings found</h3>
          <p class="text-sm mb-4" style="color: var(--text-muted);">Start browsing equipment to make your first booking</p>
          @if (auth.hasRole('FARMER')) {
            <a routerLink="/farmer" class="btn-primary no-underline inline-block">Browse Equipment</a>
          }
        </div>
      } @else {
        <div class="space-y-3">
          @for (b of filteredBookings(); track b.id) {
            <div class="glass-card p-5 flex flex-col md:flex-row md:items-center gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-sm font-semibold" style="color: var(--text-primary);">{{ b.equipmentName }}</span>
                  <span class="status-badge"
                        [style.background]="getStatusBg(b.status)"
                        [style.color]="getStatusColor(b.status)">{{ b.status }}</span>
                </div>
                <div class="flex flex-wrap gap-4 text-xs" style="color: var(--text-muted);">
                  <span>📅 {{ b.startTime | date:'MMM d, y HH:mm' }} → {{ b.endTime | date:'HH:mm' }}</span>
                  <span>⏱ {{ b.totalHours }} hours</span>
                  <span>📍 Booking #{{ b.id }}</span>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="text-right">
                  <div class="text-lg font-bold" style="color: var(--text-primary); font-family: 'Space Grotesk';">₹{{ b.totalCost.toLocaleString() }}</div>
                  <div class="text-[10px]" style="color: var(--text-muted);">incl. ₹{{ b.platformFee }} fee</div>
                </div>
                @if (b.status === 'PENDING' || b.status === 'CONFIRMED') {
                  <button (click)="cancelBooking(b.id)" class="btn-danger text-xs px-3 py-2">Cancel</button>
                }
                @if (b.status === 'CONFIRMED') {
                  <a routerLink="/payment" [queryParams]="{bookingId: b.id}" class="btn-primary text-xs px-3 py-2 no-underline">Pay Now</a>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .status-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  `]
})
export class BookingsComponent implements OnInit {
  bookings = signal<Booking[]>([]);
  activeFilter = signal('ALL');
  filters = ['ALL', 'PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED'];
  loading = signal(true);

  constructor(
    public auth: AuthService,
    private api: ApiService,
    private mock: MockDataService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.auth.user();
    if (!user) { this.router.navigate(['/auth']); return; }

    this.api.getBookingsByFarmer(user.id).subscribe(bookings => {
      this.bookings.set(bookings.length ? bookings : this.mock.getBookings().filter(b => b.farmerId === user.id));
      this.loading.set(false);
    });
  }

  filteredBookings() {
    const f = this.activeFilter();
    return f === 'ALL' ? this.bookings() : this.bookings().filter(b => b.status === f);
  }

  countByStatus(status: string) {
    return this.bookings().filter(b => b.status === status).length;
  }

  totalSpent() {
    return this.bookings().filter(b => b.status !== 'CANCELLED').reduce((sum, b) => sum + b.totalCost, 0);
  }

  cancelBooking(id: number) {
    this.api.cancelBooking(id).subscribe(b => {
      if (b) {
        this.bookings.update(list => list.map(bk => bk.id === id ? { ...bk, status: 'CANCELLED' } : bk));
        this.toast.show('Booking cancelled', 'success');
      }
    });
  }

  getStatusColor(status: string) { return STATUS_COLORS[status]?.text || '#8a9a8a'; }
  getStatusBg(status: string) { return STATUS_COLORS[status]?.bg || 'rgba(138,154,138,0.15)'; }
}
