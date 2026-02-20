import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { MockDataService } from '../../services/mock-data.service';
import { Equipment, Booking, Payment, CATEGORY_IMAGES, EQUIPMENT_TYPES, STATUS_COLORS } from '../../models/equipment.model';

@Component({
  selector: 'app-farmer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- Mobile sidebar toggle -->
    <button class="sidebar-toggle" (click)="sidebarOpen.set(!sidebarOpen())" [class.shifted]="sidebarOpen()">
      @if (sidebarOpen()) {
        <span>✕</span>
      } @else {
        <span>☰</span>
      }
    </button>

    <!-- Sidebar overlay on mobile -->
    @if (sidebarOpen()) {
      <div class="sidebar-overlay" (click)="sidebarOpen.set(false)"></div>
    }

    <!-- SIDEBAR -->
    <aside class="sidebar" [class.open]="sidebarOpen()">
      <!-- Logo -->
      <div class="sidebar-logo">
        <div class="logo-icon">
          <span>🌾</span>
        </div>
        <div>
          <h2 class="logo-title">KrishiRent</h2>
          <span class="logo-subtitle">Farm Equipment Rental</span>
        </div>
      </div>

      <div class="sidebar-divider"></div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        @for (item of navItems; track item.key) {
          <button class="nav-item" [class.active]="activeTab() === item.key"
                  (click)="setActiveTab(item.key)">
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-label">{{ item.label }}</span>
            @if (item.key === 'bookings' && activeBookingsCount() > 0) {
              <span class="nav-badge">{{ activeBookingsCount() }}</span>
            }
            @if (item.key === 'payments' && pendingPaymentsCount() > 0) {
              <span class="nav-badge warn">{{ pendingPaymentsCount() }}</span>
            }
          </button>
        }
      </nav>

      <!-- Spacer -->
      <div class="sidebar-spacer"></div>

      <!-- User info at bottom -->
      <div class="sidebar-user">
        <div class="sidebar-divider"></div>
        <div class="user-info">
          <div class="user-avatar">
            {{ userName().charAt(0).toUpperCase() }}
          </div>
          <div class="user-details">
            <span class="user-name">{{ userName() }}</span>
            <span class="user-role-badge">FARMER</span>
          </div>
        </div>
        <button class="logout-btn" (click)="logout()">
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main-content">

      <!-- ==================== OVERVIEW TAB ==================== -->
      @if (activeTab() === 'overview') {
        <div class="fade-in">
          <!-- Welcome -->
          <div class="welcome-section">
            <div class="welcome-text">
              <h1 class="page-title">Welcome back, {{ userName() }}</h1>
              <p class="page-subtitle">Here's what's happening with your farm equipment rentals</p>
            </div>
            <div class="welcome-actions">
              <button class="btn-primary" (click)="setActiveTab('equipment')">
                🔍 Browse Equipment
              </button>
              <button class="btn-secondary" (click)="setActiveTab('bookings')">
                📋 View Bookings
              </button>
            </div>
          </div>

          <!-- Stat Cards -->
          <div class="stats-grid">
            <div class="stat-card" style="--stat-accent: var(--accent);">
              <div class="stat-icon">📋</div>
              <div class="stat-info">
                <span class="stat-label">Active Bookings</span>
                <span class="stat-value">{{ activeBookingsCount() }}</span>
              </div>
              <div class="stat-glow"></div>
            </div>
            <div class="stat-card" style="--stat-accent: var(--info);">
              <div class="stat-icon">💰</div>
              <div class="stat-info">
                <span class="stat-label">Total Spent</span>
                <span class="stat-value" style="color: var(--info);">₹{{ totalSpent() | number }}</span>
              </div>
              <div class="stat-glow" style="--stat-accent: var(--info);"></div>
            </div>
            <div class="stat-card" style="--stat-accent: var(--warning);">
              <div class="stat-icon">🚜</div>
              <div class="stat-info">
                <span class="stat-label">Equipment Used</span>
                <span class="stat-value" style="color: var(--warning);">{{ equipmentUsedCount() }}</span>
              </div>
              <div class="stat-glow" style="--stat-accent: var(--warning);"></div>
            </div>
            <div class="stat-card" style="--stat-accent: var(--danger);">
              <div class="stat-icon">⏳</div>
              <div class="stat-info">
                <span class="stat-label">Pending Payments</span>
                <span class="stat-value" style="color: var(--danger);">₹{{ pendingPaymentAmount() | number }}</span>
              </div>
              <div class="stat-glow" style="--stat-accent: var(--danger);"></div>
            </div>
          </div>

          <!-- Recent Bookings -->
          <div class="section-header">
            <h2 class="section-title">Recent Bookings</h2>
            <button class="btn-link" (click)="setActiveTab('bookings')">View All →</button>
          </div>
          <div class="glass-card table-wrapper">
            @if (recentBookings().length > 0) {
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Equipment</th>
                    <th>Date</th>
                    <th>Hours</th>
                    <th>Cost</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  @for (booking of recentBookings(); track booking.id) {
                    <tr>
                      <td style="color: var(--text-primary); font-weight: 500;">{{ booking.equipmentName }}</td>
                      <td>{{ formatDate(booking.startTime) }}</td>
                      <td>{{ booking.totalHours }}h</td>
                      <td style="color: var(--accent); font-weight: 600;">₹{{ booking.totalCost | number }}</td>
                      <td>
                        <span class="badge"
                              [style.background]="getStatusBg(booking.status)"
                              [style.color]="getStatusColor(booking.status)">
                          @if (booking.status === 'ACTIVE') {
                            <span class="pulse-dot" [style.background]="getStatusColor(booking.status)"></span>
                          }
                          {{ booking.status }}
                        </span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            } @else {
              <div class="empty-state">
                <div class="empty-icon">📋</div>
                <p>No bookings yet. Start by browsing equipment!</p>
                <button class="btn-primary mt-3" (click)="setActiveTab('equipment')">Browse Equipment</button>
              </div>
            }
          </div>
        </div>
      }

      <!-- ==================== BROWSE EQUIPMENT TAB ==================== -->
      @if (activeTab() === 'equipment') {
        <div class="fade-in">
          <div class="page-header">
            <div>
              <h1 class="page-title">Browse Equipment</h1>
              <p class="page-subtitle">Find and book the right equipment for your farm</p>
            </div>
          </div>

          <!-- Search and Filters -->
          <div class="search-bar-row">
            <div class="search-input-wrap">
              <span class="search-icon">🔍</span>
              <input class="input-field search-field"
                     type="text"
                     placeholder="Search equipment by name, location..."
                     [(ngModel)]="equipmentSearch"
                     (ngModelChange)="filterEquipment(); equipmentPage.set(1)">
            </div>
            <select class="input-field filter-select" [(ngModel)]="equipmentTypeFilter" (ngModelChange)="filterEquipment(); equipmentPage.set(1)">
              <option value="">All Types</option>
              @for (type of equipmentTypes; track type.value) {
                <option [value]="type.value">{{ type.icon }} {{ type.label }}</option>
              }
            </select>
            <select class="input-field filter-select" style="width:160px;" [(ngModel)]="equipmentStatusFilter" (ngModelChange)="filterEquipment(); equipmentPage.set(1)">
              <option value="">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="RENTED">Rented</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>
          <div class="text-xs mb-4" style="color: var(--text-muted);">{{ filteredEquipment().length }} equipment found</div>

          <!-- Equipment Grid -->
          @if (loading()) {
            <div class="equipment-grid">
              @for (i of [1,2,3,4,5,6]; track i) {
                <div class="glass-card equipment-card-skeleton">
                  <div class="skeleton" style="height: 180px; border-radius: var(--radius) var(--radius) 0 0;"></div>
                  <div class="p-4">
                    <div class="skeleton" style="height: 20px; width: 70%; margin-bottom: 8px;"></div>
                    <div class="skeleton" style="height: 14px; width: 50%; margin-bottom: 12px;"></div>
                    <div class="skeleton" style="height: 36px; width: 100%;"></div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="equipment-grid">
              @for (eq of paginatedEquipment(); track eq.id) {
                <div class="glass-card equipment-card">
                  <!-- Image -->
                  <div class="equipment-img" [style.background-image]="'url(' + getCategoryImage(eq.type) + ')'">
                    <div class="equipment-img-overlay"></div>
                    <span class="equipment-type-badge">
                      {{ getTypeIcon(eq.type) }} {{ eq.type }}
                    </span>
                    <span class="equipment-status-badge"
                          [style.background]="getStatusBg(eq.status)"
                          [style.color]="getStatusColor(eq.status)">
                      {{ eq.status }}
                    </span>
                  </div>
                  <!-- Details -->
                  <div class="equipment-details">
                    <h3 class="equipment-name">{{ eq.name }}</h3>
                    <p class="equipment-location">📍 {{ eq.location }}, {{ eq.district }}</p>
                    <p class="equipment-desc">{{ eq.description }}</p>
                    <div class="equipment-footer">
                      <div class="equipment-rate">
                        <span class="rate-amount">₹{{ eq.hourlyRate }}</span>
                        <span class="rate-unit">/hour</span>
                      </div>
                      <button class="btn-primary btn-sm"
                              [disabled]="eq.status !== 'AVAILABLE'"
                              (click)="openBookingModal(eq)">
                        @if (eq.status === 'AVAILABLE') {
                          Book Now
                        } @else {
                          Unavailable
                        }
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
            @if (filteredEquipment().length === 0) {
              <div class="empty-state glass-card">
                <div class="empty-icon">🔍</div>
                <p>No equipment found matching your search.</p>
              </div>
            }

            <!-- Pagination -->
            @if (equipmentTotalPages() > 1) {
              <div class="pagination">
                <button class="page-btn" [disabled]="equipmentPage() === 1" (click)="equipmentPage.set(equipmentPage() - 1)">← Prev</button>
                @for (p of getPageNumbers(equipmentTotalPages()); track p) {
                  <button class="page-btn" [class.active]="equipmentPage() === p" (click)="equipmentPage.set(p)">{{ p }}</button>
                }
                <button class="page-btn" [disabled]="equipmentPage() === equipmentTotalPages()" (click)="equipmentPage.set(equipmentPage() + 1)">Next →</button>
              </div>
            }
          }
        </div>
      }

      <!-- ==================== MY BOOKINGS TAB ==================== -->
      @if (activeTab() === 'bookings') {
        <div class="fade-in">
          <div class="page-header">
            <div>
              <h1 class="page-title">My Bookings</h1>
              <p class="page-subtitle">Track and manage all your equipment bookings</p>
            </div>
          </div>

          <!-- Filter Tabs -->
          <div class="filter-tabs">
            @for (filter of bookingFilters; track filter.key) {
              <button class="tab-btn" [class.active]="bookingFilter() === filter.key"
                      (click)="bookingFilter.set(filter.key)">
                {{ filter.label }}
                <span class="tab-count">{{ getBookingCountByFilter(filter.key) }}</span>
              </button>
            }
          </div>

          <!-- Bookings List -->
          <div class="bookings-list">
            @for (booking of paginatedBookings(); track booking.id) {
              <div class="glass-card booking-item">
                <div class="booking-main">
                  <div class="booking-icon">
                    {{ getTypeIconByName(booking.equipmentName) }}
                  </div>
                  <div class="booking-info">
                    <h3 class="booking-equipment-name">{{ booking.equipmentName }}</h3>
                    <div class="booking-meta">
                      <span>📅 {{ formatDate(booking.startTime) }} - {{ formatTime(booking.endTime) }}</span>
                      <span>⏱️ {{ booking.totalHours }} hours</span>
                    </div>
                  </div>
                  <div class="booking-right">
                    <span class="booking-cost">₹{{ booking.totalCost | number }}</span>
                    <span class="badge"
                          [style.background]="getStatusBg(booking.status)"
                          [style.color]="getStatusColor(booking.status)">
                      @if (booking.status === 'ACTIVE') {
                        <span class="pulse-dot" [style.background]="getStatusColor(booking.status)"></span>
                      }
                      {{ booking.status }}
                    </span>
                  </div>
                </div>
                <div class="booking-actions">
                  @if (booking.status === 'PENDING' || booking.status === 'CONFIRMED') {
                    <button class="btn-danger btn-sm" (click)="cancelBooking(booking)">Cancel</button>
                  }
                  @if (booking.status === 'CONFIRMED') {
                    <button class="btn-primary btn-sm" (click)="payForBooking(booking)">💳 Pay ₹{{ booking.totalCost | number }}</button>
                  }
                  @if (booking.status === 'COMPLETED') {
                    <span class="text-muted text-sm">Completed</span>
                  }
                </div>
              </div>
            }
            @if (filteredBookings().length === 0) {
              <div class="empty-state glass-card">
                <div class="empty-icon">📋</div>
                <p>No {{ bookingFilter() === 'ALL' ? '' : bookingFilter().toLowerCase() }} bookings found.</p>
              </div>
            }
          </div>
          <!-- Booking Pagination -->
          @if (bookingTotalPages() > 1) {
            <div class="pagination">
              <button class="page-btn" [disabled]="bookingPage() === 1" (click)="bookingPage.set(bookingPage() - 1)">← Prev</button>
              @for (p of getPageNumbers(bookingTotalPages()); track p) {
                <button class="page-btn" [class.active]="bookingPage() === p" (click)="bookingPage.set(p)">{{ p }}</button>
              }
              <button class="page-btn" [disabled]="bookingPage() === bookingTotalPages()" (click)="bookingPage.set(bookingPage() + 1)">Next →</button>
            </div>
          }
        </div>
      }

      <!-- ==================== PAYMENTS TAB ==================== -->
      @if (activeTab() === 'payments') {
        <div class="fade-in">
          <div class="page-header">
            <div>
              <h1 class="page-title">Payments</h1>
              <p class="page-subtitle">View your payment history and pending transactions</p>
            </div>
          </div>

          <!-- Payment Summary Cards -->
          <div class="payment-summary-grid">
            <div class="glass-card payment-summary-card">
              <div class="payment-summary-icon" style="background: rgba(34,197,94,0.15); color: var(--accent);">✓</div>
              <div>
                <span class="payment-summary-label">Total Paid</span>
                <span class="payment-summary-value" style="color: var(--accent);">₹{{ totalPaid() | number }}</span>
              </div>
            </div>
            <div class="glass-card payment-summary-card">
              <div class="payment-summary-icon" style="background: rgba(245,158,11,0.15); color: var(--warning);">⏳</div>
              <div>
                <span class="payment-summary-label">Pending</span>
                <span class="payment-summary-value" style="color: var(--warning);">₹{{ totalPending() | number }}</span>
              </div>
            </div>
            <div class="glass-card payment-summary-card">
              <div class="payment-summary-icon" style="background: rgba(59,130,246,0.15); color: var(--info);">📊</div>
              <div>
                <span class="payment-summary-label">Platform Fees</span>
                <span class="payment-summary-value" style="color: var(--info);">₹{{ totalPlatformFees() | number }}</span>
              </div>
            </div>
          </div>

          <!-- Payment History Table -->
          <div class="glass-card table-wrapper">
            @if (payments().length > 0) {
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Amount</th>
                    <th>Platform Fee</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  @for (payment of payments(); track payment.id) {
                    <tr>
                      <td style="color: var(--text-primary); font-weight: 500;">#{{ payment.bookingId }}</td>
                      <td style="color: var(--accent); font-weight: 600;">₹{{ payment.amount | number }}</td>
                      <td>₹{{ payment.platformFee | number }}</td>
                      <td>
                        <span class="badge badge-info">{{ payment.paymentMethod }}</span>
                      </td>
                      <td>
                        <span class="badge"
                              [style.background]="getStatusBg(payment.status)"
                              [style.color]="getStatusColor(payment.status)">
                          {{ payment.status }}
                        </span>
                      </td>
                      <td>{{ formatDate(payment.createdAt) }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            } @else {
              <div class="empty-state">
                <div class="empty-icon">💰</div>
                <p>No payment history yet.</p>
              </div>
            }
          </div>
        </div>
      }

      <!-- ==================== PROFILE TAB ==================== -->
      @if (activeTab() === 'profile') {
        <div class="fade-in">
          <div class="page-header">
            <div>
              <h1 class="page-title">My Profile</h1>
              <p class="page-subtitle">Manage your account information</p>
            </div>
          </div>

          <div class="glass-card profile-card">
            <div class="profile-avatar-section">
              <div class="profile-avatar-large">
                {{ profileForm.fullName.charAt(0).toUpperCase() }}
              </div>
              <div>
                <h2 class="profile-name">{{ profileForm.fullName }}</h2>
                <span class="user-role-badge">FARMER</span>
              </div>
            </div>

            <div class="profile-form">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input class="input-field" type="text" [(ngModel)]="profileForm.fullName" placeholder="Enter your full name">
              </div>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input class="input-field" type="email" [(ngModel)]="profileForm.email" placeholder="Enter your email">
              </div>
              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input class="input-field" type="tel" [(ngModel)]="profileForm.phone" placeholder="Enter your phone number">
              </div>
              <div class="form-group">
                <label class="form-label">District</label>
                <input class="input-field" type="text" [(ngModel)]="profileForm.district" placeholder="Enter your district">
              </div>
              <div class="form-actions">
                <button class="btn-primary" (click)="saveProfile()">Save Changes</button>
                <button class="btn-secondary" (click)="resetProfile()">Reset</button>
              </div>
            </div>
          </div>
        </div>
      }
    </main>

    <!-- ==================== BOOKING MODAL ==================== -->
    @if (bookingModalOpen()) {
      <div class="modal-overlay" (click)="closeBookingModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2 class="modal-title">Book Equipment</h2>
            <button class="modal-close" (click)="closeBookingModal()">✕</button>
          </div>

          @if (selectedEquipment()) {
            <div class="modal-body">
              <!-- Equipment preview -->
              <div class="modal-equipment-preview">
                <div class="modal-equipment-img"
                     [style.background-image]="'url(' + getCategoryImage(selectedEquipment()!.type) + ')'">
                  <div class="equipment-img-overlay"></div>
                </div>
                <div class="modal-equipment-info">
                  <h3>{{ selectedEquipment()!.name }}</h3>
                  <p>📍 {{ selectedEquipment()!.location }}, {{ selectedEquipment()!.district }}</p>
                  <p class="modal-rate">₹{{ selectedEquipment()!.hourlyRate }}/hour</p>
                </div>
              </div>

              <!-- Date/time pickers -->
              <div class="modal-form">
                <div class="form-group">
                  <label class="form-label">Start Date & Time</label>
                  <input class="input-field" type="datetime-local"
                         [(ngModel)]="bookingStartTime"
                         (ngModelChange)="calculateBookingCost()">
                </div>
                <div class="form-group">
                  <label class="form-label">End Date & Time</label>
                  <input class="input-field" type="datetime-local"
                         [(ngModel)]="bookingEndTime"
                         (ngModelChange)="calculateBookingCost()">
                </div>
              </div>

              <!-- Cost preview -->
              @if (bookingCostPreview().hours > 0) {
                <div class="cost-preview">
                  <div class="cost-row">
                    <span>Duration</span>
                    <span>{{ bookingCostPreview().hours }} hours</span>
                  </div>
                  <div class="cost-row">
                    <span>Base Cost (₹{{ selectedEquipment()!.hourlyRate }} x {{ bookingCostPreview().hours }}h)</span>
                    <span>₹{{ bookingCostPreview().baseCost | number }}</span>
                  </div>
                  <div class="cost-row">
                    <span>Platform Fee (10%)</span>
                    <span>₹{{ bookingCostPreview().platformFee | number }}</span>
                  </div>
                  <div class="cost-row total">
                    <span>Total Cost</span>
                    <span>₹{{ bookingCostPreview().totalCost | number }}</span>
                  </div>
                </div>
              }
            </div>

            <div class="modal-footer">
              <button class="btn-secondary" (click)="closeBookingModal()">Cancel</button>
              <button class="btn-primary"
                      [disabled]="bookingCostPreview().hours <= 0"
                      (click)="confirmBooking()">
                Confirm Booking
              </button>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--bg-primary);
    }

    /* ===== SIDEBAR ===== */
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      width: var(--sidebar-width);
      height: 100vh;
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      z-index: 100;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow-y: auto;
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 24px 20px 16px;
    }

    .logo-icon {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--accent), var(--accent-hover));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      box-shadow: 0 0 20px var(--accent-glow);
      flex-shrink: 0;
    }

    .logo-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.2;
    }

    .logo-subtitle {
      font-size: 10px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .sidebar-divider {
      height: 1px;
      background: var(--border);
      margin: 4px 20px;
    }

    .sidebar-nav {
      padding: 12px 12px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 16px;
      border-radius: 10px;
      border: none;
      background: transparent;
      color: var(--text-secondary);
      font-size: 13.5px;
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

    .nav-item.active {
      background: var(--accent-soft);
      color: var(--accent);
      font-weight: 600;
    }

    .nav-item.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 6px;
      bottom: 6px;
      width: 3px;
      border-radius: 0 3px 3px 0;
      background: var(--accent);
    }

    .nav-icon {
      font-size: 18px;
      width: 24px;
      text-align: center;
      flex-shrink: 0;
    }

    .nav-label {
      flex: 1;
    }

    .nav-badge {
      background: var(--accent);
      color: #000;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 10px;
      min-width: 20px;
      text-align: center;
    }

    .nav-badge.warn {
      background: var(--warning);
    }

    .sidebar-spacer {
      flex: 1;
    }

    .sidebar-user {
      padding: 12px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 8px;
    }

    .user-avatar {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--accent), var(--accent-hover));
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
      font-weight: 700;
      font-size: 16px;
      flex-shrink: 0;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .user-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role-badge {
      font-size: 9px;
      font-weight: 700;
      color: var(--accent);
      background: var(--accent-soft);
      padding: 2px 8px;
      border-radius: 6px;
      width: fit-content;
      letter-spacing: 0.5px;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 9px 16px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: transparent;
      color: var(--text-secondary);
      font-size: 12.5px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
      font-family: 'Inter', sans-serif;
    }

    .logout-btn:hover {
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.3);
      color: var(--danger);
    }

    /* Sidebar toggle (mobile) */
    .sidebar-toggle {
      display: none;
      position: fixed;
      top: 16px;
      left: 16px;
      z-index: 200;
      width: 42px;
      height: 42px;
      border-radius: 12px;
      border: 1px solid var(--border);
      background: var(--bg-card);
      color: var(--text-primary);
      font-size: 20px;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      backdrop-filter: blur(10px);
    }

    .sidebar-toggle:hover {
      border-color: var(--accent);
      box-shadow: 0 0 15px var(--accent-glow);
    }

    .sidebar-toggle.shifted {
      left: calc(var(--sidebar-width) + 16px);
    }

    .sidebar-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      z-index: 90;
      backdrop-filter: blur(4px);
    }

    /* ===== MAIN CONTENT ===== */
    .main-content {
      margin-left: var(--sidebar-width);
      padding: 32px 40px;
      min-height: 100vh;
    }

    .fade-in {
      animation: fadeInUp 0.4s ease;
    }

    /* ===== PAGE HEADERS ===== */
    .welcome-section {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 32px;
      flex-wrap: wrap;
    }

    .welcome-actions {
      display: flex;
      gap: 10px;
      flex-shrink: 0;
    }

    .page-header {
      margin-bottom: 28px;
    }

    .page-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 26px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    .page-subtitle {
      font-size: 14px;
      color: var(--text-secondary);
    }

    /* ===== STAT CARDS ===== */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 36px;
    }

    .stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 22px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      border-color: var(--stat-accent, var(--accent));
      box-shadow: 0 0 30px rgba(34, 197, 94, 0.08);
      transform: translateY(-2px);
    }

    .stat-icon {
      font-size: 28px;
      margin-bottom: 12px;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stat-label {
      font-size: 12px;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }

    .stat-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: var(--accent);
      line-height: 1;
    }

    .stat-glow {
      position: absolute;
      top: -40px;
      right: -40px;
      width: 100px;
      height: 100px;
      background: radial-gradient(circle, var(--stat-accent, var(--accent-glow)) 0%, transparent 70%);
      opacity: 0.3;
      pointer-events: none;
    }

    /* ===== SECTION ===== */
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .section-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .btn-link {
      background: none;
      border: none;
      color: var(--accent);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      padding: 0;
      transition: opacity 0.2s;
      font-family: 'Inter', sans-serif;
    }

    .btn-link:hover {
      opacity: 0.8;
    }

    .table-wrapper {
      overflow-x: auto;
      padding: 0;
    }

    .table-wrapper .data-table {
      min-width: 600px;
    }

    /* ===== SEARCH & FILTER ===== */
    .search-bar-row {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
    }

    .search-input-wrap {
      flex: 1;
      position: relative;
    }

    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
      pointer-events: none;
    }

    .search-field {
      padding-left: 42px !important;
    }

    .filter-select {
      width: 200px;
      flex-shrink: 0;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238a9a8a' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 14px center;
      padding-right: 36px !important;
    }

    /* ===== EQUIPMENT GRID ===== */
    .equipment-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .equipment-card {
      overflow: hidden;
      cursor: default;
    }

    .equipment-card-skeleton {
      overflow: hidden;
    }

    .equipment-img {
      height: 180px;
      background-size: cover;
      background-position: center;
      position: relative;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 12px;
    }

    .equipment-img-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%);
    }

    .equipment-type-badge {
      position: relative;
      z-index: 1;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 8px;
      letter-spacing: 0.3px;
    }

    .equipment-status-badge {
      position: relative;
      z-index: 1;
      font-size: 10px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 8px;
      letter-spacing: 0.3px;
      text-transform: uppercase;
    }

    .equipment-details {
      padding: 18px;
    }

    .equipment-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 6px;
    }

    .equipment-location {
      font-size: 12.5px;
      color: var(--text-secondary);
      margin-bottom: 6px;
    }

    .equipment-desc {
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 16px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .equipment-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .equipment-rate {
      display: flex;
      align-items: baseline;
      gap: 2px;
    }

    .rate-amount {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: var(--accent);
    }

    .rate-unit {
      font-size: 12px;
      color: var(--text-muted);
    }

    .btn-sm {
      padding: 8px 18px !important;
      font-size: 12.5px !important;
      border-radius: 8px !important;
    }

    .btn-primary:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    /* ===== FILTER TABS ===== */
    .filter-tabs {
      display: flex;
      gap: 2px;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--border);
      overflow-x: auto;
    }

    .tab-count {
      background: var(--border);
      color: var(--text-muted);
      font-size: 10px;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 6px;
      margin-left: 6px;
    }

    .tab-btn.active .tab-count {
      background: var(--accent-soft);
      color: var(--accent);
    }

    /* ===== BOOKINGS LIST ===== */
    .bookings-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .booking-item {
      padding: 20px !important;
    }

    .booking-main {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .booking-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: var(--accent-soft);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
    }

    .booking-info {
      flex: 1;
      min-width: 0;
    }

    .booking-equipment-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 15px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    .booking-meta {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: var(--text-secondary);
      flex-wrap: wrap;
    }

    .booking-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
      flex-shrink: 0;
    }

    .booking-cost {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: var(--accent);
    }

    .booking-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--border);
    }

    .text-muted {
      color: var(--text-muted);
    }

    .text-sm {
      font-size: 12px;
    }

    .mt-3 {
      margin-top: 12px;
    }

    /* ===== PAYMENT SUMMARY ===== */
    .payment-summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 28px;
    }

    .payment-summary-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px !important;
    }

    .payment-summary-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
      font-weight: 700;
    }

    .payment-summary-label {
      font-size: 12px;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
      display: block;
      margin-bottom: 2px;
    }

    .payment-summary-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 24px;
      font-weight: 700;
      display: block;
    }

    /* ===== EMPTY STATE ===== */
    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: var(--text-secondary);
      font-size: 14px;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 12px;
    }

    /* ===== PROFILE ===== */
    .profile-card {
      max-width: 640px;
      padding: 32px !important;
    }

    .profile-avatar-section {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border);
    }

    .profile-avatar-large {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: linear-gradient(135deg, var(--accent), var(--accent-hover));
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
      font-weight: 700;
      font-size: 28px;
      flex-shrink: 0;
      box-shadow: 0 0 25px var(--accent-glow);
    }

    .profile-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 8px;
    }

    /* ===== BADGE (inline) ===== */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      display: inline-block;
      animation: pulse-dot 1.5s infinite;
    }

    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.5); }
    }

    /* ===== MODAL ===== */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(6px);
      z-index: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn 0.2s ease;
    }

    .modal-content {
      background: var(--bg-secondary);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 520px;
      max-height: 90vh;
      overflow-y: auto;
      animation: fadeInUp 0.3s ease;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid var(--border);
    }

    .modal-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .modal-close {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 20px;
      cursor: pointer;
      padding: 4px;
      transition: color 0.2s;
      line-height: 1;
    }

    .modal-close:hover {
      color: var(--text-primary);
    }

    .modal-body {
      padding: 24px;
    }

    .modal-equipment-preview {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border);
    }

    .modal-equipment-img {
      width: 100px;
      height: 80px;
      border-radius: 10px;
      background-size: cover;
      background-position: center;
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
    }

    .modal-equipment-info h3 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    .modal-equipment-info p {
      font-size: 12.5px;
      color: var(--text-secondary);
      margin-bottom: 2px;
    }

    .modal-rate {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: var(--accent) !important;
      margin-top: 4px !important;
    }

    .modal-form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }

    .cost-preview {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 16px;
    }

    .cost-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      font-size: 13px;
      color: var(--text-secondary);
    }

    .cost-row + .cost-row {
      border-top: 1px solid var(--border);
    }

    .cost-row.total {
      font-size: 16px;
      font-weight: 700;
      color: var(--accent);
      padding-top: 12px;
      margin-top: 4px;
    }

    .modal-footer {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 16px 24px;
      border-top: 1px solid var(--border);
    }

    /* ===== PAGINATION ===== */
    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: 24px;
      padding-top: 16px;
    }

    .page-btn {
      padding: 8px 14px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: transparent;
      color: var(--text-secondary);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'Inter', sans-serif;
    }

    .page-btn:hover:not(:disabled) {
      border-color: var(--accent);
      color: var(--accent);
    }

    .page-btn.active {
      background: var(--accent);
      color: #000;
      border-color: var(--accent);
      font-weight: 600;
    }

    .page-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .text-xs { font-size: 12px; }
    .mb-4 { margin-bottom: 16px; }

    /* ===== ANIMATIONS ===== */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* ===== p-4 helper ===== */
    .p-4 { padding: 16px; }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .payment-summary-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
      }

      .sidebar.open {
        transform: translateX(0);
      }

      .sidebar-toggle {
        display: flex;
      }

      .sidebar-overlay {
        display: block;
      }

      .main-content {
        margin-left: 0;
        padding: 24px 16px;
        padding-top: 72px;
      }

      .welcome-section {
        flex-direction: column;
      }

      .welcome-actions {
        width: 100%;
      }

      .welcome-actions .btn-primary,
      .welcome-actions .btn-secondary {
        flex: 1;
        text-align: center;
      }

      .stats-grid {
        grid-template-columns: 1fr 1fr;
      }

      .search-bar-row {
        flex-direction: column;
      }

      .filter-select {
        width: 100%;
      }

      .equipment-grid {
        grid-template-columns: 1fr;
      }

      .booking-main {
        flex-wrap: wrap;
      }

      .booking-right {
        flex-direction: row;
        align-items: center;
        width: 100%;
        justify-content: space-between;
        padding-top: 8px;
      }

      .payment-summary-grid {
        grid-template-columns: 1fr;
      }

      .modal-form {
        grid-template-columns: 1fr;
      }

      .profile-card {
        max-width: 100%;
      }

      .sidebar-toggle.shifted {
        left: calc(var(--sidebar-width) + 8px);
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .page-title {
        font-size: 22px;
      }

      .stat-value {
        font-size: 22px;
      }

      .booking-icon {
        display: none;
      }

      .form-actions {
        flex-direction: column;
      }

      .form-actions .btn-primary,
      .form-actions .btn-secondary {
        width: 100%;
        text-align: center;
      }
    }
  `]
})
export class FarmerComponent implements OnInit {
  // State
  activeTab = signal<string>('overview');
  sidebarOpen = signal(false);
  loading = signal(true);
  bookingModalOpen = signal(false);
  selectedEquipment = signal<Equipment | null>(null);

  // Data
  equipmentList = signal<Equipment[]>([]);
  filteredEquipment = signal<Equipment[]>([]);
  bookings = signal<Booking[]>([]);
  payments = signal<Payment[]>([]);

  // Search & Filters
  equipmentSearch = '';
  equipmentTypeFilter = '';
  equipmentStatusFilter = '';
  bookingFilter = signal<string>('ALL');
  equipmentTypes = EQUIPMENT_TYPES;

  // Pagination
  equipmentPage = signal(1);
  bookingPage = signal(1);
  pageSize = 8;

  // Booking modal
  bookingStartTime = '';
  bookingEndTime = '';
  bookingCostPreview = signal<{ hours: number; baseCost: number; platformFee: number; totalCost: number }>({
    hours: 0, baseCost: 0, platformFee: 0, totalCost: 0
  });

  // Profile form
  profileForm = { fullName: '', email: '', phone: '', district: '' };

  // Nav items
  navItems = [
    { key: 'overview', icon: '📊', label: 'Overview' },
    { key: 'equipment', icon: '🔍', label: 'Browse Equipment' },
    { key: 'bookings', icon: '📋', label: 'My Bookings' },
    { key: 'payments', icon: '💰', label: 'Payments' },
    { key: 'profile', icon: '👤', label: 'Profile' }
  ];

  // Booking filter tabs
  bookingFilters = [
    { key: 'ALL', label: 'All' },
    { key: 'ACTIVE', label: 'Active' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'CANCELLED', label: 'Cancelled' }
  ];

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private toast: ToastService,
    private mockData: MockDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProfile();
    this.loadAllData();
  }

  // ===== COMPUTED VALUES =====

  userName = () => {
    const user = this.auth.user();
    return user?.fullName || this.profileForm.fullName || 'Farmer';
  };

  activeBookingsCount = () => {
    return this.bookings().filter(b => b.status === 'ACTIVE' || b.status === 'CONFIRMED').length;
  };

  pendingPaymentsCount = () => {
    return this.payments().filter(p => p.status === 'PENDING').length;
  };

  totalSpent = () => {
    return this.payments()
      .filter(p => p.status === 'PAID')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  equipmentUsedCount = () => {
    const ids = new Set(this.bookings().filter(b => b.status !== 'CANCELLED').map(b => b.equipmentId));
    return ids.size;
  };

  pendingPaymentAmount = () => {
    return this.payments()
      .filter(p => p.status === 'PENDING')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  recentBookings = () => {
    return [...this.bookings()]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  filteredBookings = () => {
    const filter = this.bookingFilter();
    if (filter === 'ALL') return this.bookings();
    return this.bookings().filter(b => b.status === filter);
  };

  totalPaid = () => {
    return this.payments()
      .filter(p => p.status === 'PAID')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  totalPending = () => {
    return this.payments()
      .filter(p => p.status === 'PENDING')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  totalPlatformFees = () => {
    return this.payments().reduce((sum, p) => sum + p.platformFee, 0);
  };

  // ===== DATA LOADING =====

  loadAllData() {
    this.loading.set(true);
    const user = this.auth.user();
    const farmerId = user?.id || 1;
    let completed = 0;
    const total = 3;
    const checkDone = () => {
      completed++;
      if (completed >= total) this.loading.set(false);
    };

    // Load equipment
    this.api.getEquipment().subscribe(data => {
      if (data && data.length > 0) {
        this.equipmentList.set(data);
      } else {
        this.equipmentList.set(this.mockData.getEquipment());
      }
      this.filterEquipment();
      checkDone();
    });

    // Load bookings
    this.api.getBookingsByFarmer(farmerId).subscribe(data => {
      if (data && data.length > 0) {
        this.bookings.set(data);
      } else {
        this.bookings.set(this.mockData.getBookings().filter(b => b.farmerId === farmerId));
      }
      checkDone();
    });

    // Load payments
    this.api.getPaymentsByFarmer(farmerId).subscribe(data => {
      if (data && data.length > 0) {
        this.payments.set(data);
      } else {
        this.payments.set(this.mockData.getPayments().filter(p => p.farmerId === farmerId));
      }
      checkDone();
    });
  }

  loadProfile() {
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

  // ===== ACTIONS =====

  setActiveTab(tab: string) {
    this.activeTab.set(tab);
    this.sidebarOpen.set(false);
  }

  filterEquipment() {
    let list = this.equipmentList();
    const search = this.equipmentSearch.toLowerCase().trim();
    if (search) {
      list = list.filter(eq =>
        eq.name.toLowerCase().includes(search) ||
        eq.location.toLowerCase().includes(search) ||
        eq.district.toLowerCase().includes(search) ||
        eq.type.toLowerCase().includes(search)
      );
    }
    if (this.equipmentTypeFilter) {
      list = list.filter(eq => eq.type === this.equipmentTypeFilter);
    }
    if (this.equipmentStatusFilter) {
      list = list.filter(eq => eq.status === this.equipmentStatusFilter);
    }
    this.filteredEquipment.set(list);
  }

  // Pagination helpers
  paginatedEquipment() {
    const start = (this.equipmentPage() - 1) * this.pageSize;
    return this.filteredEquipment().slice(start, start + this.pageSize);
  }

  equipmentTotalPages() {
    return Math.ceil(this.filteredEquipment().length / this.pageSize);
  }

  paginatedBookings() {
    const start = (this.bookingPage() - 1) * this.pageSize;
    return this.filteredBookings().slice(start, start + this.pageSize);
  }

  bookingTotalPages() {
    return Math.ceil(this.filteredBookings().length / this.pageSize);
  }

  getPageNumbers(total: number): number[] {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  openBookingModal(equipment: Equipment) {
    this.selectedEquipment.set(equipment);
    this.bookingStartTime = '';
    this.bookingEndTime = '';
    this.bookingCostPreview.set({ hours: 0, baseCost: 0, platformFee: 0, totalCost: 0 });
    this.bookingModalOpen.set(true);
  }

  closeBookingModal() {
    this.bookingModalOpen.set(false);
    this.selectedEquipment.set(null);
  }

  calculateBookingCost() {
    if (!this.bookingStartTime || !this.bookingEndTime || !this.selectedEquipment()) {
      this.bookingCostPreview.set({ hours: 0, baseCost: 0, platformFee: 0, totalCost: 0 });
      return;
    }
    const start = new Date(this.bookingStartTime);
    const end = new Date(this.bookingEndTime);
    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) {
      this.bookingCostPreview.set({ hours: 0, baseCost: 0, platformFee: 0, totalCost: 0 });
      return;
    }
    const hours = Math.ceil(diffMs / (1000 * 60 * 60));
    const rate = this.selectedEquipment()!.hourlyRate;
    const baseCost = hours * rate;
    const platformFee = Math.round(baseCost * 0.1);
    const totalCost = baseCost + platformFee;
    this.bookingCostPreview.set({ hours, baseCost, platformFee, totalCost });
  }

  confirmBooking() {
    const equipment = this.selectedEquipment();
    const user = this.auth.user();
    if (!equipment || !this.bookingStartTime || !this.bookingEndTime) {
      this.toast.show('Please select valid start and end times', 'warning');
      return;
    }
    const request = {
      equipmentId: equipment.id,
      farmerId: user?.id || 1,
      startTime: new Date(this.bookingStartTime).toISOString(),
      endTime: new Date(this.bookingEndTime).toISOString()
    };
    this.api.createBooking(request).subscribe(result => {
      if (result) {
        this.toast.show('Booking created successfully!', 'success');
        this.closeBookingModal();
        this.loadAllData();
      } else {
        // Add mock booking locally as fallback
        const preview = this.bookingCostPreview();
        const mockBooking: Booking = {
          id: Date.now(),
          equipmentId: equipment.id,
          equipmentName: equipment.name,
          farmerId: user?.id || 1,
          farmerName: user?.fullName || 'Farmer',
          startTime: new Date(this.bookingStartTime).toISOString(),
          endTime: new Date(this.bookingEndTime).toISOString(),
          totalHours: preview.hours,
          baseCost: preview.baseCost,
          platformFee: preview.platformFee,
          totalCost: preview.totalCost,
          status: 'PENDING',
          createdAt: new Date().toISOString()
        };
        this.bookings.update(list => [mockBooking, ...list]);
        this.toast.show('Booking created (offline mode)', 'info');
        this.closeBookingModal();
      }
    });
  }

  cancelBooking(booking: Booking) {
    this.api.cancelBooking(booking.id).subscribe(result => {
      if (result) {
        this.toast.show('Booking cancelled', 'success');
        this.loadAllData();
      } else {
        // Update locally as fallback
        this.bookings.update(list =>
          list.map(b => b.id === booking.id ? { ...b, status: 'CANCELLED' } : b)
        );
        this.toast.show('Booking cancelled (offline mode)', 'info');
      }
    });
  }

  payForBooking(booking: Booking) {
    const request = {
      bookingId: booking.id,
      amount: booking.totalCost,
      platformFee: booking.platformFee,
      paymentMethod: 'UPI'
    };
    this.api.createPayment(request).subscribe(result => {
      if (result) {
        this.toast.show('Payment successful!', 'success');
        this.loadAllData();
      } else {
        // Add mock payment locally
        const mockPayment: Payment = {
          id: Date.now(),
          bookingId: booking.id,
          farmerId: booking.farmerId,
          ownerId: 0,
          amount: booking.totalCost,
          platformFee: booking.platformFee,
          ownerAmount: booking.baseCost,
          paymentMethod: 'UPI',
          status: 'PAID',
          createdAt: new Date().toISOString()
        };
        this.payments.update(list => [mockPayment, ...list]);
        this.bookings.update(list =>
          list.map(b => b.id === booking.id ? { ...b, status: 'ACTIVE' } : b)
        );
        this.toast.show('Payment recorded (offline mode)', 'info');
      }
    });
  }

  saveProfile() {
    const user = this.auth.user();
    if (user) {
      this.api.updateUser(user.id, this.profileForm).subscribe(result => {
        if (result) {
          this.auth.login(result);
          this.toast.show('Profile updated successfully!', 'success');
        } else {
          this.toast.show('Profile saved (offline mode)', 'info');
        }
      });
    } else {
      this.toast.show('Profile saved (offline mode)', 'info');
    }
  }

  resetProfile() {
    this.loadProfile();
    this.toast.show('Profile form reset', 'info');
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
    this.toast.show('Logged out successfully', 'info');
  }

  // ===== HELPERS =====

  getBookingCountByFilter(filter: string): number {
    if (filter === 'ALL') return this.bookings().length;
    return this.bookings().filter(b => b.status === filter).length;
  }

  getStatusColor(status: string): string {
    return STATUS_COLORS[status]?.text || '#8a9a8a';
  }

  getStatusBg(status: string): string {
    return STATUS_COLORS[status]?.bg || 'rgba(138,154,138,0.15)';
  }

  getCategoryImage(type: string): string {
    return CATEGORY_IMAGES[type] || CATEGORY_IMAGES['DEFAULT'];
  }

  getTypeIcon(type: string): string {
    const found = EQUIPMENT_TYPES.find(t => t.value === type);
    return found?.icon || '🔧';
  }

  getTypeIconByName(name: string): string {
    if (!name) return '🔧';
    const lower = name.toLowerCase();
    if (lower.includes('tractor')) return '🚜';
    if (lower.includes('harvester')) return '🌾';
    if (lower.includes('pump')) return '⛽';
    if (lower.includes('irrigation') || lower.includes('drip')) return '💧';
    if (lower.includes('sprayer')) return '🔫';
    if (lower.includes('seed')) return '🌱';
    if (lower.includes('plough')) return '⚙️';
    if (lower.includes('thresher')) return '🏭';
    return '🔧';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  formatTime(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }
}
