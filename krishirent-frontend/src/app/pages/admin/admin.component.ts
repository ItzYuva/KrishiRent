import { Component, OnInit, signal, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { MockDataService } from '../../services/mock-data.service';
import { User, Equipment, Booking, Payment, STATUS_COLORS, EQUIPMENT_TYPES } from '../../models/equipment.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="dashboard-layout">
      <!-- Sidebar -->
      <aside class="sidebar" [class.open]="sidebarOpen()">
        <div class="sidebar-header">
          <span class="text-xl">🌾</span>
          <span class="logo-text">KrishiRent</span>
          <span class="badge-admin">ADMIN</span>
        </div>

        <nav class="sidebar-nav">
          @for (item of navItems; track item.key) {
            <button (click)="activeTab.set(item.key); sidebarOpen.set(false)"
                    class="nav-item" [class.active]="activeTab() === item.key">
              <span class="nav-icon">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </button>
          }
        </nav>

        <div class="sidebar-footer">
          @if (auth.user(); as user) {
            <div class="user-info">
              <div class="user-avatar">{{ user.fullName.charAt(0) }}</div>
              <div>
                <div class="user-name">{{ user.fullName }}</div>
                <div class="user-role">Administrator</div>
              </div>
            </div>
          }
          <button (click)="logout()" class="logout-btn">Logout</button>
        </div>
      </aside>

      <!-- Mobile toggle -->
      <button class="mobile-toggle" (click)="sidebarOpen.set(!sidebarOpen())">
        {{ sidebarOpen() ? '✕' : '☰' }}
      </button>

      <!-- Main Content -->
      <main class="main-content">

        <!-- Overview -->
        @if (activeTab() === 'overview') {
          <div class="page-header">
            <h1>Platform Overview</h1>
            <p>Monitor all platform activity and metrics</p>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon" style="background: rgba(34,197,94,0.15); color: #22c55e;">👥</div>
              <div class="stat-info">
                <span class="stat-value">{{ users().length }}</span>
                <span class="stat-label">Total Users</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background: rgba(59,130,246,0.15); color: #3b82f6;">🚜</div>
              <div class="stat-info">
                <span class="stat-value">{{ equipment().length }}</span>
                <span class="stat-label">Equipment</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background: rgba(245,158,11,0.15); color: #f59e0b;">📋</div>
              <div class="stat-info">
                <span class="stat-value">{{ bookings().length }}</span>
                <span class="stat-label">Bookings</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background: rgba(139,92,246,0.15); color: #8b5cf6;">💰</div>
              <div class="stat-info">
                <span class="stat-value">₹{{ totalRevenue().toLocaleString() }}</span>
                <span class="stat-label">Revenue</span>
              </div>
            </div>
          </div>

          <!-- Charts area -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div class="glass-card p-6">
              <h3 class="section-title">Booking Status Distribution</h3>
              <div class="chart-placeholder">
                <canvas #bookingChart></canvas>
                <div class="chart-legend">
                  @for (s of bookingStatusData(); track s.label) {
                    <div class="legend-item">
                      <span class="legend-dot" [style.background]="s.color"></span>
                      <span>{{ s.label }}: {{ s.count }}</span>
                    </div>
                  }
                </div>
              </div>
            </div>
            <div class="glass-card p-6">
              <h3 class="section-title">Equipment by Type</h3>
              <div class="chart-placeholder">
                <canvas #equipmentChart></canvas>
                <div class="chart-legend">
                  @for (t of equipmentTypeData(); track t.label) {
                    <div class="legend-item">
                      <span class="legend-dot" [style.background]="t.color"></span>
                      <span>{{ t.label }}: {{ t.count }}</span>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="glass-card p-6 mt-6">
            <h3 class="section-title">Recent Bookings</h3>
            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Equipment</th><th>Farmer</th><th>Date</th><th>Cost</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  @for (b of bookings().slice(0, 5); track b.id) {
                    <tr>
                      <td>#{{ b.id }}</td>
                      <td>{{ b.equipmentName }}</td>
                      <td>{{ b.farmerName }}</td>
                      <td>{{ b.startTime | date:'MMM d, y' }}</td>
                      <td>₹{{ b.totalCost.toLocaleString() }}</td>
                      <td><span class="status-badge" [style.background]="getStatusBg(b.status)" [style.color]="getStatusColor(b.status)">{{ b.status }}</span></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- Users Tab -->
        @if (activeTab() === 'users') {
          <div class="page-header">
            <h1>User Management</h1>
            <p>{{ users().length }} registered users</p>
          </div>

          <div class="glass-card p-6">
            <div class="flex flex-wrap gap-2 mb-4">
              @for (role of ['ALL','FARMER','AGENT','ADMIN']; track role) {
                <button class="tab-btn" [class.active]="userFilter() === role" (click)="userFilter.set(role)">{{ role }}</button>
              }
            </div>
            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>District</th><th>Joined</th></tr>
                </thead>
                <tbody>
                  @for (u of filteredUsers(); track u.id) {
                    <tr>
                      <td>#{{ u.id }}</td>
                      <td class="font-medium" style="color: var(--text-primary);">{{ u.fullName }}</td>
                      <td>{{ u.email }}</td>
                      <td>{{ u.phone }}</td>
                      <td><span class="status-badge" [style.background]="getRoleBg(u.role)" [style.color]="getRoleColor(u.role)">{{ u.role }}</span></td>
                      <td>{{ u.district }}</td>
                      <td>{{ u.createdAt | date:'MMM d' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- Equipment Tab -->
        @if (activeTab() === 'equipment') {
          <div class="page-header">
            <h1>Equipment Management</h1>
            <p>{{ equipment().length }} items registered</p>
          </div>

          <div class="glass-card p-6">
            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr><th>ID</th><th>Name</th><th>Type</th><th>Rate/hr</th><th>Location</th><th>Owner</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  @for (e of equipment(); track e.id) {
                    <tr>
                      <td>#{{ e.id }}</td>
                      <td class="font-medium" style="color: var(--text-primary);">{{ e.name }}</td>
                      <td>{{ e.type }}</td>
                      <td>₹{{ e.hourlyRate }}</td>
                      <td>{{ e.location }}</td>
                      <td>{{ e.ownerName || 'N/A' }}</td>
                      <td><span class="status-badge" [style.background]="getStatusBg(e.status)" [style.color]="getStatusColor(e.status)">{{ e.status }}</span></td>
                      <td>
                        <button (click)="deleteEquipment(e.id)" class="action-btn danger">Delete</button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- Bookings Tab -->
        @if (activeTab() === 'bookings') {
          <div class="page-header">
            <h1>All Bookings</h1>
            <p>{{ bookings().length }} total bookings</p>
          </div>

          <div class="glass-card p-6">
            <div class="flex flex-wrap gap-2 mb-4">
              @for (s of ['ALL','PENDING','CONFIRMED','ACTIVE','COMPLETED','CANCELLED']; track s) {
                <button class="tab-btn" [class.active]="bookingFilter() === s" (click)="bookingFilter.set(s)">{{ s }}</button>
              }
            </div>
            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr><th>ID</th><th>Equipment</th><th>Farmer</th><th>Start</th><th>End</th><th>Hours</th><th>Cost</th><th>Status</th></tr>
                </thead>
                <tbody>
                  @for (b of filteredBookings(); track b.id) {
                    <tr>
                      <td>#{{ b.id }}</td>
                      <td class="font-medium" style="color: var(--text-primary);">{{ b.equipmentName }}</td>
                      <td>{{ b.farmerName }}</td>
                      <td>{{ b.startTime | date:'MMM d, HH:mm' }}</td>
                      <td>{{ b.endTime | date:'MMM d, HH:mm' }}</td>
                      <td>{{ b.totalHours }}h</td>
                      <td>₹{{ b.totalCost.toLocaleString() }}</td>
                      <td><span class="status-badge" [style.background]="getStatusBg(b.status)" [style.color]="getStatusColor(b.status)">{{ b.status }}</span></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- Payments Tab -->
        @if (activeTab() === 'payments') {
          <div class="page-header">
            <h1>Payment Records</h1>
            <p>{{ payments().length }} transactions</p>
          </div>

          <div class="stats-grid mb-6" style="grid-template-columns: repeat(3, 1fr);">
            <div class="stat-card">
              <div class="stat-info">
                <span class="stat-value">₹{{ totalRevenue().toLocaleString() }}</span>
                <span class="stat-label">Total Revenue</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-info">
                <span class="stat-value">₹{{ totalPlatformFees().toLocaleString() }}</span>
                <span class="stat-label">Platform Fees</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-info">
                <span class="stat-value">₹{{ totalOwnerPayouts().toLocaleString() }}</span>
                <span class="stat-label">Owner Payouts</span>
              </div>
            </div>
          </div>

          <div class="glass-card p-6">
            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr><th>ID</th><th>Booking</th><th>Amount</th><th>Platform Fee</th><th>Owner Amount</th><th>Method</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                  @for (p of payments(); track p.id) {
                    <tr>
                      <td>#{{ p.id }}</td>
                      <td>#{{ p.bookingId }}</td>
                      <td class="font-medium" style="color: var(--text-primary);">₹{{ p.amount.toLocaleString() }}</td>
                      <td>₹{{ p.platformFee }}</td>
                      <td>₹{{ p.ownerAmount.toLocaleString() }}</td>
                      <td>{{ p.paymentMethod }}</td>
                      <td><span class="status-badge" [style.background]="getStatusBg(p.status)" [style.color]="getStatusColor(p.status)">{{ p.status }}</span></td>
                      <td>{{ p.createdAt | date:'MMM d, y' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- System Tab -->
        @if (activeTab() === 'system') {
          <div class="page-header">
            <h1>System Health</h1>
            <p>Platform infrastructure status</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (svc of services; track svc.name) {
              <div class="glass-card p-5">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm font-medium" style="color: var(--text-primary);">{{ svc.name }}</span>
                  <span class="status-badge" style="background: rgba(34,197,94,0.15); color: #22c55e;">ONLINE</span>
                </div>
                <div class="text-xs" style="color: var(--text-muted);">Port: {{ svc.port }}</div>
                <div class="mt-2 h-1 rounded-full" style="background: var(--bg-primary);">
                  <div class="h-full rounded-full" style="background: var(--accent); width: 100%;"></div>
                </div>
              </div>
            }
          </div>
        }

      </main>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      display: flex;
      min-height: 100vh;
    }
    .sidebar {
      width: var(--sidebar-width);
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border);
      position: fixed;
      top: 0; left: 0; bottom: 0;
      display: flex;
      flex-direction: column;
      z-index: 40;
      transition: transform 0.3s;
    }
    .sidebar-header {
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid var(--border);
    }
    .logo-text {
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      color: var(--accent);
      font-size: 16px;
    }
    .badge-admin {
      font-size: 9px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(139,92,246,0.2);
      color: #8b5cf6;
      letter-spacing: 0.5px;
    }
    .sidebar-nav {
      flex: 1;
      padding: 12px 8px;
      overflow-y: auto;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 10px 14px;
      border: none;
      background: transparent;
      color: var(--text-muted);
      font-size: 13px;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.2s;
      border-left: 2px solid transparent;
      margin-bottom: 2px;
    }
    .nav-item:hover { color: var(--text-secondary); background: var(--accent-soft); }
    .nav-item.active {
      color: var(--accent);
      background: var(--accent-soft);
      border-left-color: var(--accent);
    }
    .nav-icon { font-size: 16px; }
    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid var(--border);
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }
    .user-avatar {
      width: 32px; height: 32px;
      border-radius: 50%;
      background: var(--accent);
      color: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
    }
    .user-name { font-size: 13px; color: var(--text-primary); font-weight: 500; }
    .user-role { font-size: 10px; color: var(--accent); text-transform: uppercase; letter-spacing: 0.5px; }
    .logout-btn {
      width: 100%;
      padding: 8px;
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text-muted);
      font-size: 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .logout-btn:hover { border-color: #ef4444; color: #ef4444; }

    .main-content {
      flex: 1;
      margin-left: var(--sidebar-width);
      padding: 32px;
      min-height: 100vh;
    }
    .page-header {
      margin-bottom: 24px;
    }
    .page-header h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 24px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 4px;
    }
    .page-header p {
      font-size: 13px;
      color: var(--text-muted);
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .stat-icon {
      width: 48px; height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: var(--text-primary);
    }
    .stat-label { font-size: 12px; color: var(--text-muted); }

    .section-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 16px;
    }
    .table-wrapper { overflow-x: auto; }
    .status-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .action-btn {
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }
    .action-btn.danger { background: rgba(239,68,68,0.15); color: #ef4444; }
    .action-btn.danger:hover { background: rgba(239,68,68,0.3); }

    .chart-placeholder { min-height: 200px; }
    .chart-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 16px;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--text-secondary);
    }
    .legend-dot {
      width: 10px; height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .mobile-toggle {
      display: none;
      position: fixed;
      top: 12px; left: 12px;
      z-index: 50;
      width: 40px; height: 40px;
      border-radius: 10px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      color: var(--accent);
      font-size: 18px;
      cursor: pointer;
    }

    @media (max-width: 768px) {
      .sidebar { transform: translateX(-100%); }
      .sidebar.open { transform: translateX(0); }
      .mobile-toggle { display: flex; align-items: center; justify-content: center; }
      .main-content { margin-left: 0; padding: 24px 16px; padding-top: 60px; }
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class AdminComponent implements OnInit, AfterViewInit {
  @ViewChild('bookingChart') bookingChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('equipmentChart') equipmentChartRef!: ElementRef<HTMLCanvasElement>;

  activeTab = signal('overview');
  sidebarOpen = signal(false);
  userFilter = signal('ALL');
  bookingFilter = signal('ALL');

  users = signal<User[]>([]);
  equipment = signal<Equipment[]>([]);
  bookings = signal<Booking[]>([]);
  payments = signal<Payment[]>([]);

  navItems = [
    { key: 'overview', icon: '📊', label: 'Overview' },
    { key: 'users', icon: '👥', label: 'Users' },
    { key: 'equipment', icon: '🚜', label: 'Equipment' },
    { key: 'bookings', icon: '📋', label: 'Bookings' },
    { key: 'payments', icon: '💰', label: 'Payments' },
    { key: 'system', icon: '⚙️', label: 'System Health' }
  ];

  services = [
    { name: 'Discovery Server', port: 8761 },
    { name: 'API Gateway', port: 8080 },
    { name: 'User Service', port: 8081 },
    { name: 'Equipment Service', port: 8082 },
    { name: 'Booking Service', port: 8083 },
    { name: 'Payment Service', port: 8084 }
  ];

  constructor(
    public auth: AuthService,
    private api: ApiService,
    private mock: MockDataService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    setTimeout(() => this.renderCharts(), 500);
  }

  loadData() {
    this.api.getAllUsers().subscribe(u => {
      this.users.set(u.length ? u : this.mock.getUsers());
    });
    this.api.getEquipment().subscribe(e => {
      this.equipment.set(e.length ? e : this.mock.getEquipment());
    });
    this.api.getAllBookings().subscribe(b => {
      this.bookings.set(b.length ? b : this.mock.getBookings());
      setTimeout(() => this.renderCharts(), 100);
    });
    this.api.getAllPayments().subscribe(p => {
      this.payments.set(p.length ? p : this.mock.getPayments());
    });
  }

  totalRevenue() {
    return this.payments().reduce((sum, p) => sum + p.amount, 0);
  }

  totalPlatformFees() {
    return this.payments().reduce((sum, p) => sum + p.platformFee, 0);
  }

  totalOwnerPayouts() {
    return this.payments().reduce((sum, p) => sum + p.ownerAmount, 0);
  }

  filteredUsers() {
    const f = this.userFilter();
    return f === 'ALL' ? this.users() : this.users().filter(u => u.role === f);
  }

  filteredBookings() {
    const f = this.bookingFilter();
    return f === 'ALL' ? this.bookings() : this.bookings().filter(b => b.status === f);
  }

  bookingStatusData() {
    const statuses = ['PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED'];
    const colors = ['#f59e0b', '#3b82f6', '#22c55e', '#8b5cf6', '#ef4444'];
    return statuses.map((s, i) => ({
      label: s,
      count: this.bookings().filter(b => b.status === s).length,
      color: colors[i]
    }));
  }

  equipmentTypeData() {
    const types = EQUIPMENT_TYPES;
    const colors = ['#22c55e', '#f59e0b', '#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6'];
    return types.map((t, i) => ({
      label: t.label,
      count: this.equipment().filter(e => e.type === t.value).length,
      color: colors[i % colors.length]
    }));
  }

  renderCharts() {
    this.renderDoughnut(this.bookingChartRef, this.bookingStatusData());
    this.renderDoughnut(this.equipmentChartRef, this.equipmentTypeData());
  }

  renderDoughnut(ref: ElementRef<HTMLCanvasElement> | undefined, data: {label: string; count: number; color: string}[]) {
    if (!ref?.nativeElement) return;
    const canvas = ref.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 200;
    canvas.height = 200;
    const centerX = 100, centerY = 100, radius = 80, innerRadius = 50;
    const total = data.reduce((s, d) => s + d.count, 0) || 1;
    let startAngle = -Math.PI / 2;

    ctx.clearRect(0, 0, 200, 200);
    data.forEach(d => {
      const sliceAngle = (d.count / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = d.color;
      ctx.fill();
      startAngle += sliceAngle;
    });

    // Center text
    ctx.fillStyle = '#f0f4f0';
    ctx.font = 'bold 24px Space Grotesk';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total.toString(), centerX, centerY - 8);
    ctx.font = '11px Inter';
    ctx.fillStyle = '#5a6a5a';
    ctx.fillText('Total', centerX, centerY + 12);
  }

  getStatusColor(status: string) {
    return STATUS_COLORS[status]?.text || '#8a9a8a';
  }

  getStatusBg(status: string) {
    return STATUS_COLORS[status]?.bg || 'rgba(138,154,138,0.15)';
  }

  getRoleColor(role: string) {
    const m: any = { FARMER: '#22c55e', AGENT: '#3b82f6', ADMIN: '#8b5cf6' };
    return m[role] || '#8a9a8a';
  }

  getRoleBg(role: string) {
    const m: any = { FARMER: 'rgba(34,197,94,0.15)', AGENT: 'rgba(59,130,246,0.15)', ADMIN: 'rgba(139,92,246,0.15)' };
    return m[role] || 'rgba(138,154,138,0.15)';
  }

  deleteEquipment(id: number) {
    if (confirm('Delete this equipment?')) {
      this.api.deleteEquipment(id).subscribe(() => {
        this.equipment.update(list => list.filter(e => e.id !== id));
        this.toast.show('Equipment deleted', 'success');
      });
    }
  }

  logout() {
    this.auth.logout();
    this.toast.show('Logged out', 'info');
    this.router.navigate(['/']);
  }
}
