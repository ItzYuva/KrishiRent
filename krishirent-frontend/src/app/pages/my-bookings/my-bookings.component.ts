import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Booking, CATEGORY_IMAGES, STATUS_COLORS } from '../../models/equipment.model';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-5xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold" style="color: var(--text-primary);">My Bookings</h1>
          <p class="mt-1" style="color: var(--text-secondary);">
            {{ allBookings().length }} total booking{{ allBookings().length !== 1 ? 's' : '' }}
          </p>
        </div>
        <a routerLink="/"
           class="px-5 py-2.5 rounded-xl text-white text-sm font-medium no-underline transition-all ripple"
           style="background: linear-gradient(135deg, #2E7D32, #1B5E20);">
          Browse Equipment
        </a>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
        @for (tab of tabs; track tab.key) {
          <button (click)="activeTab.set(tab.key)"
                  class="px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer border-0 whitespace-nowrap"
                  [style.background]="activeTab() === tab.key ? 'var(--accent)' : 'var(--bg-card)'"
                  [style.color]="activeTab() === tab.key ? 'white' : 'var(--text-secondary)'"
                  [style.border]="'1px solid ' + (activeTab() === tab.key ? 'var(--accent)' : 'var(--border)')">
            {{ tab.label }}
            @if (getCountForTab(tab.key) > 0) {
              <span class="ml-1.5 px-1.5 py-0.5 rounded-full text-xs"
                    [style.background]="activeTab() === tab.key ? 'rgba(255,255,255,0.3)' : 'var(--border)'">
                {{ getCountForTab(tab.key) }}
              </span>
            }
          </button>
        }
      </div>

      <!-- Loading Skeletons -->
      @if (loading()) {
        @for (i of [1,2,3]; track i) {
          <div class="mb-4 p-6 rounded-2xl" style="background: var(--bg-card); border: 1px solid var(--border);">
            <div class="flex gap-4">
              <div class="w-20 h-20 rounded-xl skeleton"></div>
              <div class="flex-1 space-y-3">
                <div class="h-5 w-48 skeleton"></div>
                <div class="h-4 w-32 skeleton"></div>
                <div class="h-4 w-64 skeleton"></div>
              </div>
            </div>
          </div>
        }
      }

      <!-- Booking Cards -->
      @if (!loading()) {
        @if (filteredBookings().length === 0) {
          <div class="text-center py-16 rounded-2xl" style="background: var(--bg-card); border: 1px solid var(--border);">
            <div class="text-5xl mb-4">📋</div>
            <h3 class="text-lg font-semibold mb-2" style="color: var(--text-primary);">No bookings found</h3>
            <p style="color: var(--text-secondary);" class="text-sm">
              {{ activeTab() === 'ALL' ? 'You haven\'t made any bookings yet.' : 'No ' + activeTab().toLowerCase() + ' bookings.' }}
            </p>
          </div>
        }

        @for (booking of filteredBookings(); track booking.id) {
          <div class="mb-4 p-6 rounded-2xl transition-all hover:shadow-lg"
               style="background: var(--bg-card); border: 1px solid var(--border);">
            <div class="flex flex-col sm:flex-row gap-4">
              <!-- Image -->
              <div class="w-full sm:w-24 h-32 sm:h-24 rounded-xl overflow-hidden flex-shrink-0">
                <img [src]="getEquipmentImage(booking)"
                     [alt]="booking.equipmentName"
                     class="w-full h-full object-cover">
              </div>

              <!-- Details -->
              <div class="flex-1">
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <h3 class="font-semibold text-lg" style="color: var(--text-primary);">
                      {{ booking.equipmentName || 'Equipment #' + booking.equipmentId }}
                    </h3>
                    <p class="text-sm" style="color: var(--text-secondary);">
                      Booking #{{ booking.id }}
                    </p>
                  </div>
                  <!-- Status Badge -->
                  <span class="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"
                        [style.background]="getStatusConfig(booking.status).bg"
                        [style.color]="getStatusConfig(booking.status).color"
                        [style.textDecoration]="booking.status === 'CANCELLED' ? 'line-through' : 'none'">
                    @if (getStatusConfig(booking.status).pulse) {
                      <span class="w-2 h-2 rounded-full inline-block"
                            [style.background]="getStatusConfig(booking.status).color"
                            style="animation: pulse-dot 1.5s infinite;"></span>
                    }
                    {{ booking.status }}
                  </span>
                </div>

                <!-- Info Row -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3 text-sm">
                  <div>
                    <span style="color: var(--text-secondary);">📅 </span>
                    <span style="color: var(--text-primary);">{{ formatDate(booking.startTime) }}</span>
                  </div>
                  <div>
                    <span style="color: var(--text-secondary);">⏱️ </span>
                    <span style="color: var(--text-primary);">{{ booking.totalHours }} hours</span>
                  </div>
                  <div>
                    <span style="color: var(--text-secondary);">💰 </span>
                    <span class="font-semibold" style="color: var(--accent);">₹{{ booking.totalCost }}</span>
                    <span class="text-xs" style="color: var(--text-secondary);"> (Base ₹{{ booking.baseCost }} + Fee ₹{{ booking.platformFee }})</span>
                  </div>
                </div>

                <!-- Cancel Button -->
                @if (booking.status === 'PENDING' || booking.status === 'CONFIRMED') {
                  <button (click)="showCancelModal(booking)"
                          class="px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all border-0"
                          style="background: #FFEBEE; color: #C62828;">
                    Cancel Booking
                  </button>
                }
              </div>
            </div>
          </div>
        }
      }

      <!-- Cancel Confirmation Modal -->
      @if (cancelTarget()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div class="w-full max-w-md mx-4 p-6 rounded-2xl shadow-xl"
               style="background: var(--bg-card);">
            <h3 class="text-lg font-bold mb-4" style="color: var(--text-primary);">Cancel Booking?</h3>
            <p class="mb-4 text-sm" style="color: var(--text-secondary);">
              Are you sure you want to cancel booking #{{ cancelTarget()!.id }}?
            </p>

            <div class="p-4 rounded-xl mb-6" style="background: var(--bg-primary); border: 1px solid var(--border);">
              <div class="text-sm space-y-2">
                <div class="flex justify-between">
                  <span style="color: var(--text-secondary);">Total Paid</span>
                  <span class="font-semibold" style="color: var(--text-primary);">₹{{ cancelTarget()!.totalCost }}</span>
                </div>
                <div class="flex justify-between">
                  <span style="color: var(--text-secondary);">Refund Policy</span>
                  <span class="font-semibold text-green-600">Based on timing</span>
                </div>
              </div>
            </div>

            <!-- Refund tiers -->
            <div class="space-y-2 mb-6 text-sm">
              <div class="flex items-center gap-2"><span>🟢</span><span style="color: var(--text-secondary);">&gt;24 hrs: 100% refund</span></div>
              <div class="flex items-center gap-2"><span>🟡</span><span style="color: var(--text-secondary);">12-24 hrs: 80% refund</span></div>
              <div class="flex items-center gap-2"><span>🟠</span><span style="color: var(--text-secondary);">&lt;12 hrs: 50% refund</span></div>
              <div class="flex items-center gap-2"><span>🔴</span><span style="color: var(--text-secondary);">After start: No refund</span></div>
            </div>

            <div class="flex gap-3">
              <button (click)="cancelTarget.set(null)"
                      class="flex-1 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all border-0"
                      style="background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border);">
                Keep Booking
              </button>
              <button (click)="confirmCancel()"
                      [disabled]="cancelling()"
                      class="flex-1 py-2.5 rounded-xl text-white text-sm font-medium cursor-pointer transition-all border-0"
                      style="background: #C62828;">
                {{ cancelling() ? 'Cancelling...' : 'Yes, Cancel' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.5); }
    }
  `]
})
export class MyBookingsComponent implements OnInit {
  allBookings = signal<Booking[]>([]);
  loading = signal(true);
  activeTab = signal('ALL');
  cancelTarget = signal<Booking | null>(null);
  cancelling = signal(false);

  tabs = [
    { key: 'ALL', label: 'All' },
    { key: 'ACTIVE', label: 'Active' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'CONFIRMED', label: 'Confirmed' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'CANCELLED', label: 'Cancelled' }
  ];

  filteredBookings = computed(() => {
    const tab = this.activeTab();
    const bookings = this.allBookings();
    if (tab === 'ALL') return bookings;
    return bookings.filter(b => b.status === tab);
  });

  constructor(
    private api: ApiService,
    public auth: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    const user = this.auth.user();
    if (!user) return;
    this.loading.set(true);
    this.api.getBookingsByFarmer(user.id).subscribe(bookings => {
      this.allBookings.set(bookings);
      this.loading.set(false);
    });
  }

  getCountForTab(key: string): number {
    if (key === 'ALL') return this.allBookings().length;
    return this.allBookings().filter(b => b.status === key).length;
  }

  getEquipmentImage(booking: Booking): string {
    return CATEGORY_IMAGES['DEFAULT'];
  }

  getStatusConfig(status: string) {
    const s = STATUS_COLORS[status] || { text: '#f59e0b', bg: 'rgba(245,158,11,0.15)' };
    return { color: s.text, bg: s.bg, pulse: status === 'ACTIVE' };
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  showCancelModal(booking: Booking) {
    this.cancelTarget.set(booking);
  }

  confirmCancel() {
    const target = this.cancelTarget();
    if (!target) return;
    this.cancelling.set(true);
    this.api.cancelBooking(target.id).subscribe(result => {
      this.cancelling.set(false);
      this.cancelTarget.set(null);
      if (result) {
        this.toast.show('Booking cancelled successfully', 'success');
        this.loadBookings();
      } else {
        this.toast.show('Failed to cancel booking', 'error');
      }
    });
  }
}
