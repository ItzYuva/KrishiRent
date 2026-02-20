import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { User, Equipment, Booking, Payment, STATUS_CONFIG, CATEGORY_COLORS } from '../../models/equipment.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-app py-8">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-8">
        <span class="text-3xl">🛡️</span>
        <div>
          <h1 class="text-2xl md:text-3xl font-bold" style="color: var(--text-primary);">Admin Dashboard</h1>
          <p class="text-sm" style="color: var(--text-secondary);">Monitor all platform activity in real-time</p>
        </div>
        <button (click)="refreshAll()" class="ml-auto px-4 py-2 rounded-xl text-sm font-medium cursor-pointer border-0 text-white transition-all hover:opacity-90"
                style="background: var(--accent);">
          🔄 Refresh
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        @for (stat of statCards(); track stat.label) {
          <div class="p-5 rounded-2xl transition-all hover:shadow-lg"
               style="background: var(--bg-card); border: 1px solid var(--border);">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-2xl">{{ stat.icon }}</span>
              <span class="text-xs font-semibold uppercase tracking-wide" style="color: var(--text-secondary);">{{ stat.label }}</span>
            </div>
            <div class="text-2xl md:text-3xl font-extrabold" [style.color]="stat.color">
              {{ stat.prefix }}{{ stat.value | number }}
            </div>
          </div>
        }
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        @for (tab of tabs; track tab.key) {
          <button (click)="activeTab.set(tab.key)"
                  class="px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all whitespace-nowrap"
                  [style.background]="activeTab() === tab.key ? 'var(--accent)' : 'var(--bg-card)'"
                  [style.color]="activeTab() === tab.key ? 'white' : 'var(--text-secondary)'"
                  [style.border]="'1px solid ' + (activeTab() === tab.key ? 'var(--accent)' : 'var(--border)')">
            {{ tab.icon }} {{ tab.label }}
            <span class="ml-1 px-1.5 py-0.5 rounded-full text-xs"
                  [style.background]="activeTab() === tab.key ? 'rgba(255,255,255,0.25)' : 'var(--border)'">
              {{ tab.count() }}
            </span>
          </button>
        }
      </div>

      <!-- Loading -->
      @if (loading()) {
        <div class="space-y-3">
          @for (i of [1,2,3,4]; track i) {
            <div class="p-5 rounded-2xl" style="background: var(--bg-card); border: 1px solid var(--border);">
              <div class="flex gap-4">
                <div class="skeleton w-12 h-12 rounded-xl"></div>
                <div class="flex-1 space-y-2">
                  <div class="skeleton h-5 w-48"></div>
                  <div class="skeleton h-4 w-32"></div>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- ===== USERS TAB ===== -->
      @if (!loading() && activeTab() === 'users') {
        <div class="rounded-2xl overflow-hidden" style="background: var(--bg-card); border: 1px solid var(--border);">
          <!-- Table Header -->
          <div class="hidden md:grid grid-cols-12 gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wide"
               style="background: var(--bg-primary); color: var(--text-secondary); border-bottom: 1px solid var(--border);">
            <div class="col-span-1">ID</div>
            <div class="col-span-3">Name</div>
            <div class="col-span-3">Email</div>
            <div class="col-span-2">Phone</div>
            <div class="col-span-1">Role</div>
            <div class="col-span-2">District</div>
          </div>
          @for (user of users(); track user.id) {
            <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 items-center transition-colors hover:bg-black/[0.02]"
                 style="border-bottom: 1px solid var(--border);">
              <div class="col-span-1 text-sm font-mono" style="color: var(--text-secondary);">#{{ user.id }}</div>
              <div class="col-span-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                       [style.background]="user.role === 'ADMIN' ? '#C62828' : user.role === 'OWNER' ? '#1565C0' : '#2E7D32'">
                    {{ user.fullName.charAt(0) }}
                  </div>
                  <span class="font-medium text-sm" style="color: var(--text-primary);">{{ user.fullName }}</span>
                </div>
              </div>
              <div class="col-span-3 text-sm truncate" style="color: var(--text-secondary);">{{ user.email }}</div>
              <div class="col-span-2 text-sm" style="color: var(--text-secondary);">{{ user.phone }}</div>
              <div class="col-span-1">
                <span class="px-2 py-0.5 rounded-full text-xs font-bold"
                      [style.background]="user.role === 'ADMIN' ? '#FFEBEE' : user.role === 'OWNER' ? '#E3F2FD' : '#E8F5E9'"
                      [style.color]="user.role === 'ADMIN' ? '#C62828' : user.role === 'OWNER' ? '#1565C0' : '#2E7D32'">
                  {{ user.role }}
                </span>
              </div>
              <div class="col-span-2 text-sm" style="color: var(--text-secondary);">📍 {{ user.district }}</div>
            </div>
          }
          @if (users().length === 0) {
            <div class="text-center py-12" style="color: var(--text-secondary);">
              <div class="text-4xl mb-2">👥</div>
              <p class="text-sm">No users found</p>
            </div>
          }
        </div>
      }

      <!-- ===== EQUIPMENT TAB ===== -->
      @if (!loading() && activeTab() === 'equipment') {
        <div class="rounded-2xl overflow-hidden" style="background: var(--bg-card); border: 1px solid var(--border);">
          <div class="hidden md:grid grid-cols-12 gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wide"
               style="background: var(--bg-primary); color: var(--text-secondary); border-bottom: 1px solid var(--border);">
            <div class="col-span-1">ID</div>
            <div class="col-span-3">Name</div>
            <div class="col-span-2">Type</div>
            <div class="col-span-2">Rate</div>
            <div class="col-span-2">District</div>
            <div class="col-span-2">Status</div>
          </div>
          @for (eq of equipmentList(); track eq.id) {
            <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 items-center transition-colors hover:bg-black/[0.02]"
                 style="border-bottom: 1px solid var(--border);">
              <div class="col-span-1 text-sm font-mono" style="color: var(--text-secondary);">#{{ eq.id }}</div>
              <div class="col-span-3 font-medium text-sm" style="color: var(--text-primary);">{{ eq.name }}</div>
              <div class="col-span-2">
                <span class="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                      [style.background]="getCategoryColor(eq.type)">
                  {{ eq.type }}
                </span>
              </div>
              <div class="col-span-2 text-sm font-semibold" style="color: var(--accent);">₹{{ eq.hourlyRate }}/hr</div>
              <div class="col-span-2 text-sm" style="color: var(--text-secondary);">📍 {{ eq.district }}</div>
              <div class="col-span-2">
                <span class="px-2 py-0.5 rounded-full text-xs font-bold"
                      [style.background]="eq.status === 'AVAILABLE' ? '#E8F5E9' : '#FFF3E0'"
                      [style.color]="eq.status === 'AVAILABLE' ? '#2E7D32' : '#E65100'">
                  {{ eq.status }}
                </span>
              </div>
            </div>
          }
          @if (equipmentList().length === 0) {
            <div class="text-center py-12" style="color: var(--text-secondary);">
              <div class="text-4xl mb-2">🚜</div>
              <p class="text-sm">No equipment found</p>
            </div>
          }
        </div>
      }

      <!-- ===== BOOKINGS TAB ===== -->
      @if (!loading() && activeTab() === 'bookings') {
        <div class="rounded-2xl overflow-hidden" style="background: var(--bg-card); border: 1px solid var(--border);">
          <div class="hidden md:grid grid-cols-12 gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wide"
               style="background: var(--bg-primary); color: var(--text-secondary); border-bottom: 1px solid var(--border);">
            <div class="col-span-1">ID</div>
            <div class="col-span-3">Equipment</div>
            <div class="col-span-2">Farmer</div>
            <div class="col-span-2">Duration</div>
            <div class="col-span-2">Total</div>
            <div class="col-span-2">Status</div>
          </div>
          @for (booking of bookings(); track booking.id) {
            <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 items-center transition-colors hover:bg-black/[0.02]"
                 style="border-bottom: 1px solid var(--border);">
              <div class="col-span-1 text-sm font-mono" style="color: var(--text-secondary);">#{{ booking.id }}</div>
              <div class="col-span-3 font-medium text-sm" style="color: var(--text-primary);">
                {{ booking.equipmentName || 'Equipment #' + booking.equipmentId }}
              </div>
              <div class="col-span-2 text-sm" style="color: var(--text-secondary);">
                {{ booking.farmerName || 'User #' + booking.farmerId }}
              </div>
              <div class="col-span-2 text-sm" style="color: var(--text-secondary);">
                {{ booking.totalHours }}h
                <span class="block text-xs">{{ formatDate(booking.startTime) }}</span>
              </div>
              <div class="col-span-2 text-sm font-semibold" style="color: var(--accent);">₹{{ booking.totalCost }}</div>
              <div class="col-span-2">
                <span class="px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"
                      [style.background]="getStatusBg(booking.status)"
                      [style.color]="getStatusColor(booking.status)">
                  @if (booking.status === 'ACTIVE') {
                    <span class="w-1.5 h-1.5 rounded-full inline-block" [style.background]="getStatusColor(booking.status)"
                          style="animation: pulse-dot 1.5s infinite;"></span>
                  }
                  {{ booking.status }}
                </span>
              </div>
            </div>
          }
          @if (bookings().length === 0) {
            <div class="text-center py-12" style="color: var(--text-secondary);">
              <div class="text-4xl mb-2">📋</div>
              <p class="text-sm">No bookings found</p>
            </div>
          }
        </div>
      }

      <!-- ===== PAYMENTS TAB ===== -->
      @if (!loading() && activeTab() === 'payments') {
        <div class="rounded-2xl overflow-hidden" style="background: var(--bg-card); border: 1px solid var(--border);">
          <div class="hidden md:grid grid-cols-12 gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wide"
               style="background: var(--bg-primary); color: var(--text-secondary); border-bottom: 1px solid var(--border);">
            <div class="col-span-1">ID</div>
            <div class="col-span-2">Booking</div>
            <div class="col-span-2">Amount</div>
            <div class="col-span-2">Platform Fee</div>
            <div class="col-span-2">Owner Gets</div>
            <div class="col-span-1">Method</div>
            <div class="col-span-2">Status</div>
          </div>
          @for (payment of payments(); track payment.id) {
            <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 items-center transition-colors hover:bg-black/[0.02]"
                 style="border-bottom: 1px solid var(--border);">
              <div class="col-span-1 text-sm font-mono" style="color: var(--text-secondary);">#{{ payment.id }}</div>
              <div class="col-span-2 text-sm" style="color: var(--text-primary);">Booking #{{ payment.bookingId }}</div>
              <div class="col-span-2 text-sm font-semibold" style="color: var(--accent);">₹{{ payment.amount }}</div>
              <div class="col-span-2 text-sm" style="color: var(--text-secondary);">₹{{ payment.platformFee }}</div>
              <div class="col-span-2 text-sm font-medium" style="color: #2E7D32;">₹{{ payment.ownerAmount }}</div>
              <div class="col-span-1">
                <span class="px-2 py-0.5 rounded-full text-xs font-bold"
                      style="background: #E3F2FD; color: #1565C0;">
                  {{ payment.paymentMethod }}
                </span>
              </div>
              <div class="col-span-2">
                <span class="px-2 py-0.5 rounded-full text-xs font-bold"
                      [style.background]="payment.status === 'COMPLETED' ? '#E8F5E9' : '#FFF3E0'"
                      [style.color]="payment.status === 'COMPLETED' ? '#2E7D32' : '#E65100'">
                  {{ payment.status }}
                </span>
              </div>
            </div>
          }
          @if (payments().length === 0) {
            <div class="text-center py-12" style="color: var(--text-secondary);">
              <div class="text-4xl mb-2">💰</div>
              <p class="text-sm">No payments found</p>
            </div>
          }
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
export class AdminComponent implements OnInit {
  users = signal<User[]>([]);
  equipmentList = signal<Equipment[]>([]);
  bookings = signal<Booking[]>([]);
  payments = signal<Payment[]>([]);
  loading = signal(true);
  activeTab = signal('users');

  adminStats = signal<any>(null);

  statCards = computed(() => {
    const stats = this.adminStats();
    return [
      { icon: '👥', label: 'Users', value: stats?.totalUsers ?? this.users().length, color: '#1565C0', prefix: '' },
      { icon: '🚜', label: 'Equipment', value: stats?.totalEquipment ?? this.equipmentList().length, color: '#2E7D32', prefix: '' },
      { icon: '📋', label: 'Bookings', value: stats?.totalBookings ?? this.bookings().length, color: '#FF8F00', prefix: '' },
      { icon: '💰', label: 'Revenue', value: stats?.totalRevenue ?? 0, color: '#2E7D32', prefix: '₹' }
    ];
  });

  tabs = [
    { key: 'users', icon: '👥', label: 'Users', count: computed(() => this.users().length) },
    { key: 'equipment', icon: '🚜', label: 'Equipment', count: computed(() => this.equipmentList().length) },
    { key: 'bookings', icon: '📋', label: 'Bookings', count: computed(() => this.bookings().length) },
    { key: 'payments', icon: '💰', label: 'Payments', count: computed(() => this.payments().length) }
  ];

  constructor(private api: ApiService, private toast: ToastService) {}

  ngOnInit() {
    this.refreshAll();
  }

  refreshAll() {
    this.loading.set(true);
    let completed = 0;
    const checkDone = () => { completed++; if (completed >= 5) this.loading.set(false); };

    this.api.getAllUsers().subscribe(data => { this.users.set(data); checkDone(); });
    this.api.getEquipment().subscribe(data => { this.equipmentList.set(data); checkDone(); });
    this.api.getAllBookings().subscribe(data => { this.bookings.set(data); checkDone(); });
    this.api.getAllPayments().subscribe(data => { this.payments.set(data); checkDone(); });
    this.api.getAdminStats().subscribe(data => { this.adminStats.set(data); checkDone(); });

    this.toast.show('Dashboard refreshed', 'info');
  }

  getCategoryColor(type: string): string {
    return CATEGORY_COLORS[type] || '#6b7280';
  }

  getStatusColor(status: string): string {
    return STATUS_CONFIG[status]?.color || '#757575';
  }

  getStatusBg(status: string): string {
    return STATUS_CONFIG[status]?.bg || '#F5F5F5';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  }
}
