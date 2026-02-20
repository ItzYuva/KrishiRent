import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { MockDataService } from '../../services/mock-data.service';
import { Equipment, Booking, Payment, CATEGORY_IMAGES, EQUIPMENT_TYPES, STATUS_COLORS, DISTRICTS } from '../../models/equipment.model';

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- Mobile Sidebar Overlay -->
    @if (sidebarOpen()) {
      <div class="sidebar-overlay" (click)="sidebarOpen.set(false)"></div>
    }

    <!-- Mobile Header -->
    <div class="mobile-header">
      <button class="mobile-menu-btn" (click)="sidebarOpen.set(!sidebarOpen())">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
      <div class="mobile-logo">
        <span class="logo-icon">🚜</span>
        <span class="logo-text">KrishiRent</span>
      </div>
      <div class="mobile-avatar">
        {{ getUserInitial() }}
      </div>
    </div>

    <div class="dashboard-layout">
      <!-- SIDEBAR -->
      <aside class="sidebar" [class.sidebar-open]="sidebarOpen()">
        <!-- Logo -->
        <div class="sidebar-logo">
          <div class="logo-mark">
            <span>🚜</span>
          </div>
          <div>
            <h1 class="logo-title">KrishiRent</h1>
            <p class="logo-subtitle">Equipment Owner</p>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="sidebar-nav">
          @for (item of navItems; track item.key) {
            <button class="nav-item" [class.nav-active]="activeTab() === item.key"
                    (click)="setTab(item.key)">
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="nav-label">{{ item.label }}</span>
              @if (item.badge && item.badge() > 0) {
                <span class="nav-badge">{{ item.badge() }}</span>
              }
            </button>
          }
        </nav>

        <!-- Sidebar Footer -->
        <div class="sidebar-footer">
          <div class="sidebar-user">
            <div class="user-avatar">
              {{ getUserInitial() }}
            </div>
            <div class="user-info">
              <p class="user-name">{{ auth.user()?.fullName || 'Agent' }}</p>
              <p class="user-role">Equipment Owner</p>
            </div>
          </div>
          <button class="logout-btn" (click)="logout()">
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="main-content">
        <!-- ===== OVERVIEW TAB ===== -->
        @if (activeTab() === 'overview') {
          <div class="page-section">
            <!-- Welcome -->
            <div class="welcome-banner">
              <div class="welcome-content">
                <h1 class="welcome-title">Welcome back, {{ auth.user()?.fullName || 'Agent' }}!</h1>
                <p class="welcome-subtitle">Manage your equipment fleet and track your rental earnings.</p>
              </div>
              <div class="welcome-icon">🌾</div>
            </div>

            <!-- Stat Cards -->
            <div class="stats-grid">
              @for (stat of overviewStats(); track stat.label) {
                <div class="stat-card">
                  <div class="stat-icon-wrap" [style.background]="stat.iconBg">
                    <span>{{ stat.icon }}</span>
                  </div>
                  <div class="stat-details">
                    <p class="stat-label">{{ stat.label }}</p>
                    <p class="stat-value" [style.color]="stat.color">{{ stat.prefix }}{{ stat.value | number }}</p>
                  </div>
                </div>
              }
            </div>

            <!-- Two Column Layout -->
            <div class="overview-grid">
              <!-- Recent Booking Requests -->
              <div class="glass-card">
                <div class="card-header">
                  <h3 class="card-title">Recent Booking Requests</h3>
                  <button class="link-btn" (click)="setTab('bookings')">View All</button>
                </div>
                @if (recentBookings().length > 0) {
                  <div class="mini-table">
                    @for (booking of recentBookings(); track booking.id) {
                      <div class="mini-row">
                        <div class="mini-row-main">
                          <p class="mini-row-title">{{ booking.farmerName }}</p>
                          <p class="mini-row-sub">{{ booking.equipmentName }}</p>
                        </div>
                        <div class="mini-row-end">
                          <span class="status-badge"
                                [style.background]="getStatusBg(booking.status)"
                                [style.color]="getStatusColor(booking.status)">
                            {{ booking.status }}
                          </span>
                          <p class="mini-row-amount">₹{{ booking.totalCost | number }}</p>
                        </div>
                      </div>
                    }
                  </div>
                } @else {
                  <div class="empty-state-sm">
                    <span>📋</span>
                    <p>No recent bookings</p>
                  </div>
                }
              </div>

              <!-- Equipment Status Summary -->
              <div class="glass-card">
                <div class="card-header">
                  <h3 class="card-title">Fleet Status Summary</h3>
                  <button class="link-btn" (click)="setTab('fleet')">Manage Fleet</button>
                </div>
                <div class="status-summary">
                  <div class="status-summary-item">
                    <div class="status-dot" style="background: var(--success);"></div>
                    <span class="status-summary-label">Available</span>
                    <span class="status-summary-count" style="color: var(--success);">{{ equipmentByStatus('AVAILABLE') }}</span>
                  </div>
                  <div class="status-summary-item">
                    <div class="status-dot" style="background: var(--warning);"></div>
                    <span class="status-summary-label">Rented</span>
                    <span class="status-summary-count" style="color: var(--warning);">{{ equipmentByStatus('RENTED') }}</span>
                  </div>
                  <div class="status-summary-item">
                    <div class="status-dot" style="background: var(--danger);"></div>
                    <span class="status-summary-label">Maintenance</span>
                    <span class="status-summary-count" style="color: var(--danger);">{{ equipmentByStatus('MAINTENANCE') }}</span>
                  </div>
                </div>

                <!-- Fleet breakdown by type -->
                <div class="card-divider"></div>
                <h4 class="card-subtitle">By Category</h4>
                <div class="category-breakdown">
                  @for (cat of fleetByType(); track cat.type) {
                    <div class="category-item">
                      <span class="category-icon">{{ cat.icon }}</span>
                      <span class="category-label">{{ cat.label }}</span>
                      <span class="category-count">{{ cat.count }}</span>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        }

        <!-- ===== MY FLEET TAB ===== -->
        @if (activeTab() === 'fleet') {
          <div class="page-section">
            <div class="page-header">
              <div>
                <h2 class="page-title">My Equipment Fleet</h2>
                <p class="page-subtitle">{{ myEquipment().length }} equipment registered</p>
              </div>
              <button class="btn-primary" (click)="setTab('add-equipment')">
                <span>➕</span> Add Equipment
              </button>
            </div>

            @if (myEquipment().length > 0) {
              <div class="fleet-grid">
                @for (eq of myEquipment(); track eq.id) {
                  <div class="equipment-card">
                    <div class="eq-card-image">
                      <img [src]="getEquipmentImage(eq.type)" [alt]="eq.name" loading="lazy" />
                      <span class="eq-status-badge"
                            [style.background]="getStatusBg(eq.status)"
                            [style.color]="getStatusColor(eq.status)">
                        {{ eq.status }}
                      </span>
                    </div>
                    <div class="eq-card-body">
                      <div class="eq-card-top">
                        <h3 class="eq-card-name">{{ eq.name }}</h3>
                        <span class="eq-type-badge">{{ getEquipmentTypeLabel(eq.type) }}</span>
                      </div>
                      <p class="eq-card-location">📍 {{ eq.location }}, {{ eq.district }}</p>
                      <div class="eq-card-rate">
                        <span class="rate-value">₹{{ eq.hourlyRate }}</span>
                        <span class="rate-unit">/hour</span>
                      </div>
                      <div class="eq-card-actions">
                        <button class="btn-sm btn-secondary" (click)="editEquipment(eq)">
                          ✏️ Edit
                        </button>
                        @if (eq.status === 'AVAILABLE') {
                          <button class="btn-sm btn-warning" (click)="toggleEquipmentStatus(eq, 'MAINTENANCE')">
                            🔧 Maintenance
                          </button>
                        } @else if (eq.status === 'MAINTENANCE') {
                          <button class="btn-sm btn-success" (click)="toggleEquipmentStatus(eq, 'AVAILABLE')">
                            ✅ Available
                          </button>
                        }
                        <button class="btn-sm btn-danger" (click)="confirmDeleteEquipment(eq)">
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="empty-state">
                <div class="empty-icon">🚜</div>
                <h3>No Equipment Yet</h3>
                <p>Start by adding your first piece of equipment to the fleet.</p>
                <button class="btn-primary" (click)="setTab('add-equipment')">
                  ➕ Add Equipment
                </button>
              </div>
            }
          </div>
        }

        <!-- ===== BOOKING REQUESTS TAB ===== -->
        @if (activeTab() === 'bookings') {
          <div class="page-section">
            <div class="page-header">
              <div>
                <h2 class="page-title">Booking Requests</h2>
                <p class="page-subtitle">Manage bookings for your equipment</p>
              </div>
            </div>

            <!-- Filter Tabs -->
            <div class="filter-tabs">
              @for (filter of bookingFilters; track filter.key) {
                <button class="filter-tab" [class.filter-active]="bookingFilter() === filter.key"
                        (click)="bookingFilter.set(filter.key)">
                  {{ filter.label }}
                  <span class="filter-count">{{ getFilteredBookingsCount(filter.key) }}</span>
                </button>
              }
            </div>

            @if (filteredBookings().length > 0) {
              <div class="data-table-wrap">
                <div class="data-table">
                  <div class="table-header">
                    <div class="th" style="flex:2">Farmer</div>
                    <div class="th" style="flex:2">Equipment</div>
                    <div class="th" style="flex:2">Dates</div>
                    <div class="th" style="flex:1">Hours</div>
                    <div class="th" style="flex:1">Cost</div>
                    <div class="th" style="flex:1">Status</div>
                    <div class="th" style="flex:1.5">Actions</div>
                  </div>
                  @for (booking of filteredBookings(); track booking.id) {
                    <div class="table-row">
                      <div class="td" style="flex:2">
                        <div class="td-main">{{ booking.farmerName }}</div>
                      </div>
                      <div class="td" style="flex:2">
                        <div class="td-main">{{ booking.equipmentName }}</div>
                      </div>
                      <div class="td" style="flex:2">
                        <div class="td-sub">{{ formatDate(booking.startTime) }}</div>
                        <div class="td-sub">to {{ formatDate(booking.endTime) }}</div>
                      </div>
                      <div class="td" style="flex:1">
                        <span class="td-main">{{ booking.totalHours }}h</span>
                      </div>
                      <div class="td" style="flex:1">
                        <span class="td-accent">₹{{ booking.totalCost | number }}</span>
                      </div>
                      <div class="td" style="flex:1">
                        <span class="status-badge"
                              [style.background]="getStatusBg(booking.status)"
                              [style.color]="getStatusColor(booking.status)">
                          @if (booking.status === 'ACTIVE') {
                            <span class="pulse-dot" [style.background]="getStatusColor(booking.status)"></span>
                          }
                          {{ booking.status }}
                        </span>
                      </div>
                      <div class="td td-actions" style="flex:1.5">
                        @if (booking.status === 'ACTIVE') {
                          <button class="btn-xs btn-success" (click)="completeBooking(booking)">Complete</button>
                        }
                        @if (booking.status === 'PENDING' || booking.status === 'CONFIRMED') {
                          <button class="btn-xs btn-danger" (click)="cancelBooking(booking)">Cancel</button>
                        }
                      </div>
                    </div>
                  }
                </div>
              </div>
            } @else {
              <div class="empty-state">
                <div class="empty-icon">📋</div>
                <h3>No {{ bookingFilter() === 'all' ? '' : bookingFilter() }} bookings</h3>
                <p>Booking requests for your equipment will appear here.</p>
              </div>
            }
          </div>
        }

        <!-- ===== EARNINGS TAB ===== -->
        @if (activeTab() === 'earnings') {
          <div class="page-section">
            <div class="page-header">
              <div>
                <h2 class="page-title">Earnings & Payments</h2>
                <p class="page-subtitle">Track your rental income and payment history</p>
              </div>
            </div>

            <!-- Earnings Summary Cards -->
            <div class="stats-grid">
              @for (stat of earningsStats(); track stat.label) {
                <div class="stat-card">
                  <div class="stat-icon-wrap" [style.background]="stat.iconBg">
                    <span>{{ stat.icon }}</span>
                  </div>
                  <div class="stat-details">
                    <p class="stat-label">{{ stat.label }}</p>
                    <p class="stat-value" [style.color]="stat.color">₹{{ stat.value | number }}</p>
                  </div>
                </div>
              }
            </div>

            <!-- Payment History -->
            <div class="glass-card">
              <div class="card-header">
                <h3 class="card-title">Payment History</h3>
              </div>
              @if (myPayments().length > 0) {
                <div class="data-table">
                  <div class="table-header">
                    <div class="th" style="flex:1">ID</div>
                    <div class="th" style="flex:1.5">Booking</div>
                    <div class="th" style="flex:1.5">Total Amount</div>
                    <div class="th" style="flex:1.5">Platform Fee</div>
                    <div class="th" style="flex:1.5">You Receive</div>
                    <div class="th" style="flex:1">Method</div>
                    <div class="th" style="flex:1">Status</div>
                    <div class="th" style="flex:1.5">Date</div>
                  </div>
                  @for (payment of myPayments(); track payment.id) {
                    <div class="table-row">
                      <div class="td" style="flex:1">
                        <span class="td-mono">#{{ payment.id }}</span>
                      </div>
                      <div class="td" style="flex:1.5">
                        <span class="td-sub">Booking #{{ payment.bookingId }}</span>
                      </div>
                      <div class="td" style="flex:1.5">
                        <span class="td-main">₹{{ payment.amount | number }}</span>
                      </div>
                      <div class="td" style="flex:1.5">
                        <span class="td-sub" style="color: var(--danger);">-₹{{ payment.platformFee | number }}</span>
                      </div>
                      <div class="td" style="flex:1.5">
                        <span class="td-accent">₹{{ payment.ownerAmount | number }}</span>
                      </div>
                      <div class="td" style="flex:1">
                        <span class="method-badge">{{ payment.paymentMethod }}</span>
                      </div>
                      <div class="td" style="flex:1">
                        <span class="status-badge"
                              [style.background]="getStatusBg(payment.status)"
                              [style.color]="getStatusColor(payment.status)">
                          {{ payment.status }}
                        </span>
                      </div>
                      <div class="td" style="flex:1.5">
                        <span class="td-sub">{{ formatDate(payment.createdAt) }}</span>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <div class="empty-state-sm">
                  <span>💰</span>
                  <p>No payment history yet</p>
                </div>
              }
            </div>
          </div>
        }

        <!-- ===== ADD EQUIPMENT TAB ===== -->
        @if (activeTab() === 'add-equipment') {
          <div class="page-section">
            <div class="page-header">
              <div>
                <h2 class="page-title">{{ editingEquipment() ? 'Edit Equipment' : 'Add New Equipment' }}</h2>
                <p class="page-subtitle">{{ editingEquipment() ? 'Update your equipment details' : 'List your farm equipment for rental' }}</p>
              </div>
              @if (editingEquipment()) {
                <button class="btn-secondary" (click)="cancelEdit()">Cancel Edit</button>
              }
            </div>

            <div class="form-card">
              <div class="form-grid">
                <!-- Equipment Name -->
                <div class="form-group full-width">
                  <label class="form-label">Equipment Name</label>
                  <input class="input-field" type="text" placeholder="e.g. Mahindra 575 DI Tractor"
                         [(ngModel)]="newEquipment.name" />
                </div>

                <!-- Type -->
                <div class="form-group">
                  <label class="form-label">Equipment Type</label>
                  <select class="input-field" [(ngModel)]="newEquipment.type">
                    <option value="">Select Type</option>
                    @for (type of equipmentTypes; track type.value) {
                      <option [value]="type.value">{{ type.icon }} {{ type.label }}</option>
                    }
                  </select>
                </div>

                <!-- Hourly Rate -->
                <div class="form-group">
                  <label class="form-label">Hourly Rate (₹)</label>
                  <input class="input-field" type="number" placeholder="e.g. 500"
                         [(ngModel)]="newEquipment.hourlyRate" min="0" />
                </div>

                <!-- Location -->
                <div class="form-group">
                  <label class="form-label">Location</label>
                  <input class="input-field" type="text" placeholder="e.g. Nashik Road"
                         [(ngModel)]="newEquipment.location" />
                </div>

                <!-- District -->
                <div class="form-group">
                  <label class="form-label">District</label>
                  <select class="input-field" [(ngModel)]="newEquipment.district">
                    <option value="">Select District</option>
                    @for (district of districts; track district) {
                      <option [value]="district">{{ district }}</option>
                    }
                  </select>
                </div>

                <!-- Description -->
                <div class="form-group full-width">
                  <label class="form-label">Description</label>
                  <textarea class="input-field textarea" placeholder="Describe your equipment, its features and condition..."
                            [(ngModel)]="newEquipment.description" rows="4"></textarea>
                </div>
              </div>

              <!-- Image Preview -->
              @if (newEquipment.type) {
                <div class="image-preview">
                  <img [src]="getEquipmentImage(newEquipment.type)" [alt]="newEquipment.type" />
                  <p class="image-hint">Default image for {{ getEquipmentTypeLabel(newEquipment.type) }}</p>
                </div>
              }

              <div class="form-actions">
                <button class="btn-secondary" (click)="resetForm()">Reset</button>
                <button class="btn-primary" (click)="submitEquipment()" [disabled]="!isFormValid()">
                  {{ editingEquipment() ? '💾 Update Equipment' : '➕ Add Equipment' }}
                </button>
              </div>
            </div>
          </div>
        }

        <!-- ===== PROFILE TAB ===== -->
        @if (activeTab() === 'profile') {
          <div class="page-section">
            <div class="page-header">
              <div>
                <h2 class="page-title">My Profile</h2>
                <p class="page-subtitle">Manage your account details</p>
              </div>
            </div>

            <div class="profile-layout">
              <!-- Profile Card -->
              <div class="profile-card">
                <div class="profile-avatar-lg">
                  {{ getUserInitial() }}
                </div>
                <h3 class="profile-name">{{ auth.user()?.fullName || 'Agent' }}</h3>
                <span class="profile-role-badge">Equipment Owner</span>
                <div class="profile-meta">
                  <p>📧 {{ auth.user()?.email }}</p>
                  <p>📱 {{ auth.user()?.phone }}</p>
                  <p>📍 {{ auth.user()?.district }}</p>
                </div>
              </div>

              <!-- Edit Form -->
              <div class="form-card">
                <h3 class="card-title" style="margin-bottom: 1.5rem;">Edit Profile</h3>
                <div class="form-grid">
                  <div class="form-group full-width">
                    <label class="form-label">Full Name</label>
                    <input class="input-field" type="text" [(ngModel)]="profileForm.fullName" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Email</label>
                    <input class="input-field" type="email" [(ngModel)]="profileForm.email" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Phone</label>
                    <input class="input-field" type="tel" [(ngModel)]="profileForm.phone" />
                  </div>
                  <div class="form-group full-width">
                    <label class="form-label">District</label>
                    <select class="input-field" [(ngModel)]="profileForm.district">
                      @for (district of districts; track district) {
                        <option [value]="district">{{ district }}</option>
                      }
                    </select>
                  </div>
                </div>
                <div class="form-actions">
                  <button class="btn-primary" (click)="updateProfile()">
                    💾 Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Delete Confirmation Modal -->
        @if (showDeleteModal()) {
          <div class="modal-overlay" (click)="showDeleteModal.set(false)">
            <div class="modal-card" (click)="$event.stopPropagation()">
              <div class="modal-icon">⚠️</div>
              <h3 class="modal-title">Delete Equipment?</h3>
              <p class="modal-text">
                Are you sure you want to delete <strong>{{ deleteTarget()?.name }}</strong>?
                This action cannot be undone.
              </p>
              <div class="modal-actions">
                <button class="btn-secondary" (click)="showDeleteModal.set(false)">Cancel</button>
                <button class="btn-danger" (click)="deleteEquipment()">Delete</button>
              </div>
            </div>
          </div>
        }

        <!-- Status Toggle Confirmation Modal -->
        @if (showStatusModal()) {
          <div class="modal-overlay" (click)="showStatusModal.set(false)">
            <div class="modal-card" (click)="$event.stopPropagation()">
              <div class="modal-icon">{{ pendingStatus() === 'MAINTENANCE' ? '🔧' : '✅' }}</div>
              <h3 class="modal-title">Change Status?</h3>
              <p class="modal-text">
                Change <strong>{{ statusTarget()?.name }}</strong> status to
                <strong>{{ pendingStatus() }}</strong>?
              </p>
              <div class="modal-actions">
                <button class="btn-secondary" (click)="showStatusModal.set(false)">Cancel</button>
                <button class="btn-primary" (click)="confirmStatusToggle()">Confirm</button>
              </div>
            </div>
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    /* ===== LAYOUT ===== */
    .dashboard-layout {
      display: flex;
      min-height: 100vh;
      background: var(--bg-primary);
    }

    /* ===== SIDEBAR ===== */
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      width: var(--sidebar-width, 260px);
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      z-index: 100;
      overflow-y: auto;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem 1.25rem;
      border-bottom: 1px solid var(--border);
    }

    .logo-mark {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: var(--accent-glow);
      border: 1px solid var(--border-strong);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }

    .logo-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }

    .logo-subtitle {
      font-size: 0.7rem;
      color: var(--accent);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }

    /* Navigation */
    .sidebar-nav {
      flex: 1;
      padding: 1rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.7rem 1rem;
      border-radius: 10px;
      border: none;
      background: transparent;
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
      text-align: left;
      position: relative;
      font-family: 'Inter', sans-serif;
    }

    .nav-item:hover {
      background: var(--accent-soft);
      color: var(--text-primary);
    }

    .nav-active {
      background: var(--accent-soft) !important;
      color: var(--accent) !important;
      font-weight: 600;
    }

    .nav-active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 60%;
      background: var(--accent);
      border-radius: 0 3px 3px 0;
    }

    .nav-icon {
      font-size: 1.15rem;
      width: 24px;
      text-align: center;
    }

    .nav-label {
      flex: 1;
    }

    .nav-badge {
      background: var(--accent);
      color: white;
      font-size: 0.65rem;
      font-weight: 700;
      padding: 0.15rem 0.5rem;
      border-radius: 999px;
      min-width: 20px;
      text-align: center;
    }

    /* Sidebar Footer */
    .sidebar-footer {
      padding: 1rem 0.75rem;
      border-top: 1px solid var(--border);
    }

    .sidebar-user {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.75rem;
      border-radius: 10px;
      background: var(--bg-card);
      margin-bottom: 0.5rem;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--accent), var(--accent-hover));
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
      color: white;
      flex-shrink: 0;
    }

    .user-info {
      overflow: hidden;
    }

    .user-name {
      color: var(--text-primary);
      font-size: 0.8rem;
      font-weight: 600;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      color: var(--text-muted);
      font-size: 0.7rem;
      margin: 0;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.6rem 1rem;
      border-radius: 10px;
      border: 1px solid rgba(239, 68, 68, 0.2);
      background: rgba(239, 68, 68, 0.08);
      color: var(--danger);
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'Inter', sans-serif;
    }

    .logout-btn:hover {
      background: rgba(239, 68, 68, 0.15);
    }

    /* ===== MAIN CONTENT ===== */
    .main-content {
      margin-left: var(--sidebar-width, 260px);
      flex: 1;
      min-height: 100vh;
      padding: 2rem 2.5rem;
    }

    /* ===== MOBILE HEADER ===== */
    .mobile-header {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 56px;
      background: var(--bg-sidebar);
      border-bottom: 1px solid var(--border);
      padding: 0 1rem;
      align-items: center;
      justify-content: space-between;
      z-index: 90;
    }

    .mobile-menu-btn {
      display: flex;
      flex-direction: column;
      gap: 4px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
    }

    .hamburger-line {
      display: block;
      width: 20px;
      height: 2px;
      background: var(--text-primary);
      border-radius: 2px;
    }

    .mobile-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .mobile-logo .logo-icon {
      font-size: 1.25rem;
    }

    .mobile-logo .logo-text {
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      color: var(--text-primary);
      font-size: 1.1rem;
    }

    .mobile-avatar {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: linear-gradient(135deg, var(--accent), var(--accent-hover));
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.75rem;
      color: white;
    }

    .sidebar-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 95;
    }

    /* ===== WELCOME BANNER ===== */
    .welcome-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2rem 2.25rem;
      border-radius: 20px;
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(34, 197, 94, 0.03));
      border: 1px solid var(--border-strong);
      margin-bottom: 2rem;
    }

    .welcome-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.65rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.35rem 0;
    }

    .welcome-subtitle {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin: 0;
    }

    .welcome-icon {
      font-size: 3.5rem;
      opacity: 0.8;
    }

    /* ===== STATS ===== */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem;
      border-radius: 16px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      background: var(--bg-card-hover);
      border-color: var(--border-strong);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }

    .stat-icon-wrap {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.35rem;
      flex-shrink: 0;
    }

    .stat-details {
      overflow: hidden;
    }

    .stat-label {
      color: var(--text-secondary);
      font-size: 0.72rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 0.25rem 0;
    }

    .stat-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.5rem;
      font-weight: 800;
      margin: 0;
    }

    /* ===== OVERVIEW GRID ===== */
    .overview-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 1.5rem;
    }

    /* ===== GLASS CARD ===== */
    .glass-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 1.5rem;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }

    .card-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }

    .card-subtitle {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text-secondary);
      margin: 0.75rem 0 0.5rem 0;
    }

    .card-divider {
      height: 1px;
      background: var(--border);
      margin: 1rem 0;
    }

    .link-btn {
      background: none;
      border: none;
      color: var(--accent);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      font-family: 'Inter', sans-serif;
      transition: opacity 0.2s;
    }

    .link-btn:hover {
      opacity: 0.8;
    }

    /* Mini Table */
    .mini-table {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .mini-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--border);
    }

    .mini-row:last-child {
      border-bottom: none;
    }

    .mini-row-title {
      color: var(--text-primary);
      font-size: 0.85rem;
      font-weight: 600;
      margin: 0;
    }

    .mini-row-sub {
      color: var(--text-muted);
      font-size: 0.75rem;
      margin: 0.15rem 0 0 0;
    }

    .mini-row-end {
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
    }

    .mini-row-amount {
      color: var(--accent);
      font-weight: 700;
      font-size: 0.85rem;
      margin: 0;
    }

    /* Status Summary */
    .status-summary {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .status-summary-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 0.75rem;
      background: var(--bg-secondary);
      border-radius: 10px;
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .status-summary-label {
      flex: 1;
      color: var(--text-secondary);
      font-size: 0.85rem;
    }

    .status-summary-count {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.25rem;
      font-weight: 800;
    }

    /* Category Breakdown */
    .category-breakdown {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .category-item {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.45rem 0;
    }

    .category-icon {
      font-size: 1rem;
    }

    .category-label {
      flex: 1;
      color: var(--text-secondary);
      font-size: 0.8rem;
    }

    .category-count {
      color: var(--text-primary);
      font-weight: 700;
      font-size: 0.85rem;
    }

    /* ===== PAGE SECTIONS ===== */
    .page-section {
      max-width: 1400px;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.75rem;
    }

    .page-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }

    .page-subtitle {
      color: var(--text-secondary);
      font-size: 0.85rem;
      margin: 0.25rem 0 0 0;
    }

    /* ===== FLEET GRID ===== */
    .fleet-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.25rem;
    }

    .equipment-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .equipment-card:hover {
      border-color: var(--border-strong);
      transform: translateY(-3px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
    }

    .eq-card-image {
      position: relative;
      height: 180px;
      overflow: hidden;
    }

    .eq-card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .eq-status-badge {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      padding: 0.3rem 0.75rem;
      border-radius: 999px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .eq-card-body {
      padding: 1.15rem;
    }

    .eq-card-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .eq-card-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }

    .eq-type-badge {
      padding: 0.2rem 0.6rem;
      border-radius: 6px;
      font-size: 0.65rem;
      font-weight: 700;
      background: var(--accent-soft);
      color: var(--accent);
      white-space: nowrap;
      text-transform: uppercase;
    }

    .eq-card-location {
      color: var(--text-muted);
      font-size: 0.8rem;
      margin: 0 0 0.65rem 0;
    }

    .eq-card-rate {
      margin-bottom: 1rem;
    }

    .rate-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--accent);
    }

    .rate-unit {
      color: var(--text-muted);
      font-size: 0.8rem;
    }

    .eq-card-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    /* ===== BUTTONS ===== */
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 1.5rem;
      border-radius: 12px;
      border: none;
      background: var(--accent);
      color: white;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'Inter', sans-serif;
    }

    .btn-primary:hover:not(:disabled) {
      background: var(--accent-hover);
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 1.5rem;
      border-radius: 12px;
      border: 1px solid var(--border);
      background: var(--bg-card);
      color: var(--text-secondary);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'Inter', sans-serif;
    }

    .btn-secondary:hover {
      background: var(--bg-card-hover);
      color: var(--text-primary);
    }

    .btn-danger {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 1.5rem;
      border-radius: 12px;
      border: 1px solid rgba(239, 68, 68, 0.25);
      background: rgba(239, 68, 68, 0.1);
      color: var(--danger);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'Inter', sans-serif;
    }

    .btn-danger:hover {
      background: rgba(239, 68, 68, 0.2);
    }

    .btn-sm {
      padding: 0.4rem 0.85rem;
      font-size: 0.75rem;
      border-radius: 8px;
    }

    .btn-xs {
      padding: 0.3rem 0.7rem;
      font-size: 0.7rem;
      border-radius: 6px;
      border: none;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'Inter', sans-serif;
    }

    .btn-success {
      border: 1px solid rgba(34, 197, 94, 0.25);
      background: rgba(34, 197, 94, 0.1);
      color: var(--success);
    }

    .btn-success:hover {
      background: rgba(34, 197, 94, 0.2);
    }

    .btn-warning {
      border: 1px solid rgba(245, 158, 11, 0.25);
      background: rgba(245, 158, 11, 0.1);
      color: var(--warning);
    }

    .btn-warning:hover {
      background: rgba(245, 158, 11, 0.2);
    }

    .btn-xs.btn-success {
      background: rgba(34, 197, 94, 0.12);
      color: var(--success);
    }

    .btn-xs.btn-success:hover {
      background: rgba(34, 197, 94, 0.25);
    }

    .btn-xs.btn-danger {
      background: rgba(239, 68, 68, 0.12);
      color: var(--danger);
    }

    .btn-xs.btn-danger:hover {
      background: rgba(239, 68, 68, 0.25);
    }

    /* ===== FILTER TABS ===== */
    .filter-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      overflow-x: auto;
      padding-bottom: 0.25rem;
    }

    .filter-tab {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.55rem 1.15rem;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: var(--bg-card);
      color: var(--text-secondary);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      font-family: 'Inter', sans-serif;
    }

    .filter-tab:hover {
      background: var(--bg-card-hover);
    }

    .filter-active {
      background: var(--accent) !important;
      color: white !important;
      border-color: var(--accent) !important;
    }

    .filter-count {
      font-size: 0.65rem;
      padding: 0.1rem 0.45rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.15);
      font-weight: 700;
    }

    .filter-tab:not(.filter-active) .filter-count {
      background: var(--border);
    }

    /* ===== DATA TABLE ===== */
    .data-table-wrap {
      overflow-x: auto;
    }

    .data-table {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      min-width: 700px;
    }

    .table-header {
      display: flex;
      padding: 0.85rem 1.25rem;
      background: var(--bg-primary);
      border-bottom: 1px solid var(--border);
    }

    .th {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-muted);
    }

    .table-row {
      display: flex;
      padding: 0.85rem 1.25rem;
      border-bottom: 1px solid var(--border);
      align-items: center;
      transition: background 0.15s ease;
    }

    .table-row:last-child {
      border-bottom: none;
    }

    .table-row:hover {
      background: var(--bg-card-hover);
    }

    .td {
      font-size: 0.85rem;
    }

    .td-main {
      color: var(--text-primary);
      font-weight: 500;
    }

    .td-sub {
      color: var(--text-secondary);
      font-size: 0.78rem;
    }

    .td-mono {
      color: var(--text-muted);
      font-family: 'Space Grotesk', monospace;
      font-size: 0.8rem;
    }

    .td-accent {
      color: var(--accent);
      font-weight: 700;
    }

    .td-actions {
      display: flex;
      gap: 0.35rem;
    }

    /* Status Badge */
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.25rem 0.65rem;
      border-radius: 999px;
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      display: inline-block;
      animation: pulse-dot 1.5s infinite;
    }

    .method-badge {
      padding: 0.2rem 0.55rem;
      border-radius: 6px;
      font-size: 0.68rem;
      font-weight: 700;
      background: rgba(59, 130, 246, 0.12);
      color: var(--info);
    }

    /* ===== FORM ===== */
    .form-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 2rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .full-width {
      grid-column: span 2;
    }

    .form-label {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .input-field {
      padding: 0.7rem 1rem;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: var(--bg-input);
      color: var(--text-primary);
      font-size: 0.9rem;
      font-family: 'Inter', sans-serif;
      transition: all 0.2s ease;
      outline: none;
    }

    .input-field:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-glow);
    }

    .input-field::placeholder {
      color: var(--text-muted);
    }

    select.input-field {
      cursor: pointer;
      appearance: auto;
    }

    .textarea {
      resize: vertical;
      min-height: 100px;
    }

    .image-preview {
      margin: 1.5rem 0;
      text-align: center;
    }

    .image-preview img {
      width: 100%;
      max-width: 400px;
      height: 200px;
      object-fit: cover;
      border-radius: 12px;
      border: 1px solid var(--border);
    }

    .image-hint {
      color: var(--text-muted);
      font-size: 0.75rem;
      margin-top: 0.5rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
    }

    /* ===== PROFILE ===== */
    .profile-layout {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 1.5rem;
      align-items: start;
    }

    .profile-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
    }

    .profile-avatar-lg {
      width: 80px;
      height: 80px;
      border-radius: 20px;
      background: linear-gradient(135deg, var(--accent), var(--accent-hover));
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 2rem;
      color: white;
      margin: 0 auto 1rem;
    }

    .profile-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.5rem 0;
    }

    .profile-role-badge {
      display: inline-block;
      padding: 0.25rem 0.85rem;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 700;
      background: var(--accent-soft);
      color: var(--accent);
      margin-bottom: 1.25rem;
    }

    .profile-meta {
      text-align: left;
    }

    .profile-meta p {
      color: var(--text-secondary);
      font-size: 0.82rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--border);
      margin: 0;
    }

    .profile-meta p:last-child {
      border-bottom: none;
    }

    /* ===== EMPTY STATE ===== */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--bg-card);
      border: 1px dashed var(--border-strong);
      border-radius: 16px;
    }

    .empty-icon {
      font-size: 3.5rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-family: 'Space Grotesk', sans-serif;
      color: var(--text-primary);
      font-size: 1.15rem;
      margin: 0 0 0.5rem 0;
    }

    .empty-state p {
      color: var(--text-secondary);
      font-size: 0.85rem;
      margin: 0 0 1.5rem 0;
    }

    .empty-state-sm {
      text-align: center;
      padding: 2.5rem 1rem;
    }

    .empty-state-sm span {
      font-size: 2.5rem;
      display: block;
      margin-bottom: 0.5rem;
    }

    .empty-state-sm p {
      color: var(--text-muted);
      font-size: 0.85rem;
      margin: 0;
    }

    /* ===== MODALS ===== */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 200;
      padding: 1rem;
    }

    .modal-card {
      background: var(--bg-card);
      border: 1px solid var(--border-strong);
      border-radius: 20px;
      padding: 2rem;
      max-width: 420px;
      width: 100%;
      text-align: center;
    }

    .modal-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .modal-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.75rem 0;
    }

    .modal-text {
      color: var(--text-secondary);
      font-size: 0.85rem;
      margin: 0 0 1.5rem 0;
      line-height: 1.5;
    }

    .modal-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
    }

    /* ===== ANIMATIONS ===== */
    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.5); }
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .overview-grid {
        grid-template-columns: 1fr;
      }
      .profile-layout {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .mobile-header {
        display: flex;
      }

      .sidebar {
        transform: translateX(-100%);
      }

      .sidebar-open {
        transform: translateX(0);
      }

      .sidebar-overlay {
        display: block;
      }

      .main-content {
        margin-left: 0;
        padding: 1.25rem;
        padding-top: calc(56px + 1.25rem);
      }

      .welcome-banner {
        padding: 1.25rem;
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }

      .welcome-title {
        font-size: 1.25rem;
      }

      .welcome-icon {
        font-size: 2.5rem;
      }

      .stats-grid {
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }

      .stat-card {
        padding: 1rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.65rem;
      }

      .stat-value {
        font-size: 1.2rem;
      }

      .fleet-grid {
        grid-template-columns: 1fr;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .full-width {
        grid-column: span 1;
      }

      .filter-tabs {
        gap: 0.35rem;
      }

      .filter-tab {
        padding: 0.45rem 0.85rem;
        font-size: 0.75rem;
      }
    }
  `]
})
export class AgentComponent implements OnInit {
  activeTab = signal<string>('overview');
  sidebarOpen = signal(false);
  bookingFilter = signal<string>('all');

  myEquipment = signal<Equipment[]>([]);
  myBookings = signal<Booking[]>([]);
  myPayments = signal<Payment[]>([]);

  editingEquipment = signal<Equipment | null>(null);
  showDeleteModal = signal(false);
  deleteTarget = signal<Equipment | null>(null);
  showStatusModal = signal(false);
  statusTarget = signal<Equipment | null>(null);
  pendingStatus = signal<string>('');

  equipmentTypes = EQUIPMENT_TYPES;
  districts = DISTRICTS;

  newEquipment: Partial<Equipment> = {
    name: '', type: '', description: '', hourlyRate: 0,
    location: '', district: ''
  };

  profileForm = {
    fullName: '', email: '', phone: '', district: ''
  };

  navItems = [
    { key: 'overview', icon: '\uD83D\uDCCA', label: 'Overview', badge: null as (() => number) | null },
    { key: 'fleet', icon: '\uD83D\uDE9C', label: 'My Fleet', badge: () => this.myEquipment().length },
    { key: 'bookings', icon: '\uD83D\uDCCB', label: 'Booking Requests', badge: () => this.myBookings().filter(b => b.status === 'PENDING').length },
    { key: 'earnings', icon: '\uD83D\uDCB0', label: 'Earnings', badge: null },
    { key: 'add-equipment', icon: '\u2795', label: 'Add Equipment', badge: null },
    { key: 'profile', icon: '\uD83D\uDC64', label: 'Profile', badge: null }
  ];

  bookingFilters = [
    { key: 'all', label: 'All' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'ACTIVE', label: 'Active' },
    { key: 'COMPLETED', label: 'Completed' }
  ];

  constructor(
    private router: Router,
    private api: ApiService,
    public auth: AuthService,
    private toast: ToastService,
    private mockData: MockDataService
  ) {}

  ngOnInit(): void {
    if (!this.auth.isLoggedIn() || !this.auth.hasRole('AGENT')) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadProfileForm();
    this.loadData();
  }

  private loadProfileForm(): void {
    const user = this.auth.user();
    if (user) {
      this.profileForm = {
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        district: user.district
      };
    }
  }

  private loadData(): void {
    const userId = this.auth.user()?.id;
    if (!userId) return;

    // Load equipment
    this.api.getEquipment().subscribe(data => {
      if (data && data.length > 0) {
        this.myEquipment.set(data.filter(e => e.ownerId === userId));
      } else {
        this.myEquipment.set(this.mockData.getEquipment().filter(e => e.ownerId === userId));
      }
      this.loadBookingsForEquipment();
    });

    // Load payments
    this.api.getPaymentsByOwner(userId).subscribe(data => {
      if (data && data.length > 0) {
        this.myPayments.set(data);
      } else {
        this.myPayments.set(this.mockData.getPayments().filter(p => p.ownerId === userId));
      }
    });
  }

  private loadBookingsForEquipment(): void {
    const equipmentIds = this.myEquipment().map(e => e.id);
    if (equipmentIds.length === 0) {
      this.myBookings.set([]);
      return;
    }

    // Try API first, then fall back to mock
    const allBookings: Booking[] = [];
    let completed = 0;
    const total = equipmentIds.length;

    equipmentIds.forEach(eqId => {
      this.api.getBookingsByEquipment(eqId).subscribe(bookings => {
        if (bookings && bookings.length > 0) {
          allBookings.push(...bookings);
        }
        completed++;
        if (completed === total) {
          if (allBookings.length > 0) {
            this.myBookings.set(allBookings);
          } else {
            // Fallback to mock data
            const mockBookings = this.mockData.getBookings().filter(
              b => equipmentIds.includes(b.equipmentId)
            );
            this.myBookings.set(mockBookings);
          }
        }
      });
    });
  }

  // ===== COMPUTED VALUES =====
  overviewStats() {
    const equipment = this.myEquipment();
    const bookings = this.myBookings();
    const payments = this.myPayments();
    const totalEarned = payments.reduce((sum, p) => sum + p.ownerAmount, 0);
    const activeRentals = bookings.filter(b => b.status === 'ACTIVE' || b.status === 'CONFIRMED').length;
    const pendingRequests = bookings.filter(b => b.status === 'PENDING').length;

    return [
      { icon: '🚜', label: 'Total Equipment', value: equipment.length, color: 'var(--accent)', prefix: '', iconBg: 'var(--accent-glow)' },
      { icon: '📋', label: 'Active Rentals', value: activeRentals, color: 'var(--info)', prefix: '', iconBg: 'rgba(59,130,246,0.15)' },
      { icon: '💰', label: 'Total Earnings', value: totalEarned, color: 'var(--success)', prefix: '₹', iconBg: 'rgba(34,197,94,0.15)' },
      { icon: '⏳', label: 'Pending Requests', value: pendingRequests, color: 'var(--warning)', prefix: '', iconBg: 'rgba(245,158,11,0.15)' }
    ];
  }

  earningsStats() {
    const payments = this.myPayments();
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalFees = payments.reduce((sum, p) => sum + p.platformFee, 0);
    const netEarnings = payments.reduce((sum, p) => sum + p.ownerAmount, 0);
    const pending = payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.ownerAmount, 0);

    return [
      { icon: '💰', label: 'Total Earned', value: totalAmount, color: 'var(--text-primary)', iconBg: 'var(--accent-glow)' },
      { icon: '🏦', label: 'Platform Fees', value: totalFees, color: 'var(--danger)', iconBg: 'rgba(239,68,68,0.12)' },
      { icon: '✅', label: 'Net Earnings', value: netEarnings, color: 'var(--success)', iconBg: 'rgba(34,197,94,0.15)' },
      { icon: '⏳', label: 'Pending Payments', value: pending, color: 'var(--warning)', iconBg: 'rgba(245,158,11,0.15)' }
    ];
  }

  recentBookings() {
    return this.myBookings()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }

  filteredBookings() {
    const filter = this.bookingFilter();
    if (filter === 'all') return this.myBookings();
    return this.myBookings().filter(b => b.status === filter);
  }

  getFilteredBookingsCount(filter: string): number {
    if (filter === 'all') return this.myBookings().length;
    return this.myBookings().filter(b => b.status === filter).length;
  }

  fleetByType() {
    const equipment = this.myEquipment();
    const typeMap = new Map<string, number>();
    equipment.forEach(e => {
      typeMap.set(e.type, (typeMap.get(e.type) || 0) + 1);
    });
    return Array.from(typeMap.entries()).map(([type, count]) => {
      const typeInfo = EQUIPMENT_TYPES.find(t => t.value === type);
      return {
        type,
        label: typeInfo?.label || type,
        icon: typeInfo?.icon || '🔧',
        count
      };
    });
  }

  equipmentByStatus(status: string): number {
    return this.myEquipment().filter(e => e.status === status).length;
  }

  // ===== ACTIONS =====
  setTab(tab: string): void {
    this.activeTab.set(tab);
    this.sidebarOpen.set(false);
  }

  getUserInitial(): string {
    const name = this.auth.user()?.fullName;
    return name ? name.charAt(0).toUpperCase() : 'A';
  }

  getEquipmentImage(type: string): string {
    return CATEGORY_IMAGES[type] || CATEGORY_IMAGES['DEFAULT'];
  }

  getEquipmentTypeLabel(type: string): string {
    return EQUIPMENT_TYPES.find(t => t.value === type)?.label || type;
  }

  getStatusColor(status: string): string {
    return STATUS_COLORS[status]?.text || '#8a9a8a';
  }

  getStatusBg(status: string): string {
    return STATUS_COLORS[status]?.bg || 'rgba(138,154,138,0.15)';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  // Fleet management
  editEquipment(eq: Equipment): void {
    this.editingEquipment.set(eq);
    this.newEquipment = { ...eq };
    this.activeTab.set('add-equipment');
  }

  cancelEdit(): void {
    this.editingEquipment.set(null);
    this.resetForm();
  }

  toggleEquipmentStatus(eq: Equipment, newStatus: string): void {
    this.statusTarget.set(eq);
    this.pendingStatus.set(newStatus);
    this.showStatusModal.set(true);
  }

  confirmStatusToggle(): void {
    const eq = this.statusTarget();
    const status = this.pendingStatus();
    if (!eq) return;

    this.api.updateEquipmentStatus(eq.id, status).subscribe(result => {
      if (result) {
        this.myEquipment.update(list =>
          list.map(e => e.id === eq.id ? { ...e, status } : e)
        );
        this.toast.show(`${eq.name} marked as ${status}`, 'success');
      } else {
        // Fallback: update locally
        this.myEquipment.update(list =>
          list.map(e => e.id === eq.id ? { ...e, status } : e)
        );
        this.toast.show(`${eq.name} marked as ${status}`, 'success');
      }
      this.showStatusModal.set(false);
    });
  }

  confirmDeleteEquipment(eq: Equipment): void {
    this.deleteTarget.set(eq);
    this.showDeleteModal.set(true);
  }

  deleteEquipment(): void {
    const eq = this.deleteTarget();
    if (!eq) return;

    this.api.deleteEquipment(eq.id).subscribe(() => {
      this.myEquipment.update(list => list.filter(e => e.id !== eq.id));
      this.toast.show(`${eq.name} deleted successfully`, 'success');
      this.showDeleteModal.set(false);
    });
  }

  // Booking actions
  completeBooking(booking: Booking): void {
    this.api.completeBooking(booking.id).subscribe(result => {
      if (result) {
        this.myBookings.update(list =>
          list.map(b => b.id === booking.id ? { ...b, status: 'COMPLETED' } : b)
        );
      } else {
        this.myBookings.update(list =>
          list.map(b => b.id === booking.id ? { ...b, status: 'COMPLETED' } : b)
        );
      }
      this.toast.show('Booking marked as completed', 'success');
    });
  }

  cancelBooking(booking: Booking): void {
    this.api.cancelBooking(booking.id).subscribe(result => {
      if (result) {
        this.myBookings.update(list =>
          list.map(b => b.id === booking.id ? { ...b, status: 'CANCELLED' } : b)
        );
      } else {
        this.myBookings.update(list =>
          list.map(b => b.id === booking.id ? { ...b, status: 'CANCELLED' } : b)
        );
      }
      this.toast.show('Booking cancelled', 'warning');
    });
  }

  // Form
  isFormValid(): boolean {
    return !!(
      this.newEquipment.name &&
      this.newEquipment.type &&
      this.newEquipment.hourlyRate &&
      this.newEquipment.hourlyRate > 0 &&
      this.newEquipment.location &&
      this.newEquipment.district
    );
  }

  submitEquipment(): void {
    if (!this.isFormValid()) return;
    const userId = this.auth.user()?.id;
    if (!userId) return;

    const payload: Partial<Equipment> = {
      ...this.newEquipment,
      ownerId: userId,
      ownerName: this.auth.user()?.fullName || null,
      imageUrl: this.getEquipmentImage(this.newEquipment.type || ''),
      status: 'AVAILABLE'
    };

    if (this.editingEquipment()) {
      const eqId = this.editingEquipment()!.id;
      this.api.updateEquipment(eqId, payload).subscribe(result => {
        if (result) {
          this.myEquipment.update(list =>
            list.map(e => e.id === eqId ? { ...e, ...payload } as Equipment : e)
          );
        } else {
          this.myEquipment.update(list =>
            list.map(e => e.id === eqId ? { ...e, ...payload } as Equipment : e)
          );
        }
        this.toast.show('Equipment updated successfully!', 'success');
        this.editingEquipment.set(null);
        this.resetForm();
        this.activeTab.set('fleet');
      });
    } else {
      this.api.createEquipment(payload).subscribe(result => {
        if (result) {
          this.myEquipment.update(list => [...list, result]);
        } else {
          // Fallback: add locally with fake id
          const fakeEquipment: Equipment = {
            ...payload,
            id: Date.now(),
            createdAt: new Date().toISOString()
          } as Equipment;
          this.myEquipment.update(list => [...list, fakeEquipment]);
        }
        this.toast.show('Equipment added successfully!', 'success');
        this.resetForm();
        this.activeTab.set('fleet');
      });
    }
  }

  resetForm(): void {
    this.newEquipment = {
      name: '', type: '', description: '', hourlyRate: 0,
      location: '', district: ''
    };
    this.editingEquipment.set(null);
  }

  // Profile
  updateProfile(): void {
    const userId = this.auth.user()?.id;
    if (!userId) return;

    this.api.updateUser(userId, this.profileForm).subscribe(result => {
      if (result) {
        this.auth.login(result);
      } else {
        const updatedUser = { ...this.auth.user()!, ...this.profileForm };
        this.auth.login(updatedUser);
      }
      this.toast.show('Profile updated successfully!', 'success');
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
    this.toast.show('Logged out successfully', 'info');
  }
}
