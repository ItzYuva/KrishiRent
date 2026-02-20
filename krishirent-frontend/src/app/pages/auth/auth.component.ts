import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { MockDataService } from '../../services/mock-data.service';
import { DISTRICTS, UserRole } from '../../models/equipment.model';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <!-- Background glow -->
      <div class="bg-glow"></div>

      <div class="auth-card glass-card">
        <!-- Logo -->
        <div class="logo-section">
          <div class="logo-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="10" fill="var(--accent)" fill-opacity="0.15"/>
              <path d="M20 8L28 14V26L20 32L12 26V14L20 8Z" stroke="var(--accent)" stroke-width="2" fill="var(--accent)" fill-opacity="0.1"/>
              <path d="M20 14C20 14 16 18 16 22C16 24.2 17.8 26 20 26C22.2 26 24 24.2 24 22C24 18 20 14 20 14Z" fill="var(--accent)" fill-opacity="0.6"/>
            </svg>
          </div>
          <h1 class="logo-text">KrishiRent</h1>
          <p class="logo-subtitle">Farm Equipment Rental Platform</p>
        </div>

        <!-- Tab Toggle -->
        <div class="tab-toggle">
          <button
            class="tab-btn"
            [class.active]="isLogin()"
            (click)="isLogin.set(true)">
            Login
          </button>
          <button
            class="tab-btn"
            [class.active]="!isLogin()"
            (click)="isLogin.set(false)">
            Register
          </button>
          <div class="tab-indicator" [class.register]="!isLogin()"></div>
        </div>

        <!-- Login Form -->
        @if (isLogin()) {
          <form class="auth-form" (ngSubmit)="onLogin()" #loginForm="ngForm">
            <div class="field-group">
              <label class="field-label">Email</label>
              <input
                type="email"
                class="input-field"
                placeholder="Enter your email"
                [(ngModel)]="loginEmail"
                name="loginEmail"
                #lEmail="ngModel"
                required
                email
              />
              @if (lEmail.touched && lEmail.errors) {
                <span class="field-error">
                  @if (lEmail.errors['required']) { Email is required }
                  @if (lEmail.errors['email']) { Enter a valid email }
                </span>
              }
            </div>

            <div class="field-group">
              <label class="field-label">Password</label>
              <input
                type="password"
                class="input-field"
                placeholder="Enter your password"
                [(ngModel)]="loginPassword"
                name="loginPassword"
                #lPass="ngModel"
                required
                minlength="6"
              />
              @if (lPass.touched && lPass.errors) {
                <span class="field-error">
                  @if (lPass.errors['required']) { Password is required }
                  @if (lPass.errors['minlength']) { Password must be at least 6 characters }
                </span>
              }
            </div>

            <button
              type="submit"
              class="btn-primary submit-btn"
              [disabled]="loginForm.invalid || isLoading()">
              @if (isLoading()) {
                <span class="spinner"></span> Signing in...
              } @else {
                Login
              }
            </button>
          </form>
        }

        <!-- Register Form -->
        @if (!isLogin()) {
          <form class="auth-form" (ngSubmit)="onRegister()" #registerForm="ngForm">
            <div class="field-group">
              <label class="field-label">Full Name</label>
              <input
                type="text"
                class="input-field"
                placeholder="Enter your full name"
                [(ngModel)]="regName"
                name="regName"
                #rName="ngModel"
                required
              />
              @if (rName.touched && rName.errors?.['required']) {
                <span class="field-error">Full name is required</span>
              }
            </div>

            <div class="field-group">
              <label class="field-label">Email</label>
              <input
                type="email"
                class="input-field"
                placeholder="Enter your email"
                [(ngModel)]="regEmail"
                name="regEmail"
                #rEmail="ngModel"
                required
                email
              />
              @if (rEmail.touched && rEmail.errors) {
                <span class="field-error">
                  @if (rEmail.errors['required']) { Email is required }
                  @if (rEmail.errors['email']) { Enter a valid email }
                </span>
              }
            </div>

            <div class="field-group">
              <label class="field-label">Phone</label>
              <input
                type="tel"
                class="input-field"
                placeholder="Enter your phone number"
                [(ngModel)]="regPhone"
                name="regPhone"
                #rPhone="ngModel"
                required
                pattern="[0-9]{10}"
              />
              @if (rPhone.touched && rPhone.errors) {
                <span class="field-error">
                  @if (rPhone.errors['required']) { Phone number is required }
                  @if (rPhone.errors['pattern']) { Enter a valid 10-digit phone number }
                </span>
              }
            </div>

            <div class="field-row">
              <div class="field-group flex-1">
                <label class="field-label">Password</label>
                <input
                  type="password"
                  class="input-field"
                  placeholder="Min 6 characters"
                  [(ngModel)]="regPassword"
                  name="regPassword"
                  #rPass="ngModel"
                  required
                  minlength="6"
                />
                @if (rPass.touched && rPass.errors) {
                  <span class="field-error">
                    @if (rPass.errors['required']) { Required }
                    @if (rPass.errors['minlength']) { Min 6 chars }
                  </span>
                }
              </div>
              <div class="field-group flex-1">
                <label class="field-label">Confirm Password</label>
                <input
                  type="password"
                  class="input-field"
                  placeholder="Re-enter password"
                  [(ngModel)]="regConfirmPassword"
                  name="regConfirmPassword"
                  #rConfirm="ngModel"
                  required
                />
                @if (rConfirm.touched && regPassword !== regConfirmPassword) {
                  <span class="field-error">Passwords do not match</span>
                }
              </div>
            </div>

            <!-- Role Selection -->
            <div class="field-group">
              <label class="field-label">Select Role</label>
              <div class="role-cards">
                @for (role of roles; track role.value) {
                  <button
                    type="button"
                    class="role-card"
                    [class.selected]="regRole === role.value"
                    (click)="regRole = role.value">
                    <span class="role-icon">{{ role.icon }}</span>
                    <span class="role-name">{{ role.label }}</span>
                    <span class="role-desc">{{ role.desc }}</span>
                  </button>
                }
              </div>
              @if (submitted() && !regRole) {
                <span class="field-error">Please select a role</span>
              }
            </div>

            <!-- District Selection -->
            <div class="field-group">
              <label class="field-label">District</label>
              <select
                class="input-field"
                [(ngModel)]="regDistrict"
                name="regDistrict"
                #rDistrict="ngModel"
                required>
                <option value="" disabled>Select your district</option>
                @for (district of districts; track district) {
                  <option [value]="district">{{ district }}</option>
                }
              </select>
              @if (rDistrict.touched && rDistrict.errors?.['required']) {
                <span class="field-error">District is required</span>
              }
            </div>

            <button
              type="submit"
              class="btn-primary submit-btn"
              [disabled]="registerForm.invalid || isLoading()">
              @if (isLoading()) {
                <span class="spinner"></span> Creating Account...
              } @else {
                Create Account
              }
            </button>
          </form>
        }

        <!-- Footer -->
        <div class="auth-footer">
          @if (isLogin()) {
            <p>Don't have an account?
              <a class="link" (click)="isLogin.set(false)">Register here</a>
            </p>
          } @else {
            <p>Already have an account?
              <a class="link" (click)="isLogin.set(true)">Login here</a>
            </p>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-primary);
      padding: 2rem 1rem;
      position: relative;
      overflow: hidden;
    }

    .bg-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }

    .auth-card {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 480px;
      padding: 2.5rem;
      border-radius: 1.25rem;
      background: var(--bg-card);
      border: 1px solid var(--border);
      box-shadow: 0 0 80px rgba(34, 197, 94, 0.06), 0 25px 50px rgba(0, 0, 0, 0.4);
    }

    /* Logo */
    .logo-section {
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.75rem;
    }

    .logo-text {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.02em;
      margin: 0;
    }

    .logo-subtitle {
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin: 0.25rem 0 0;
    }

    /* Tabs */
    .tab-toggle {
      display: flex;
      position: relative;
      background: var(--bg-input);
      border-radius: 0.75rem;
      padding: 4px;
      margin-bottom: 1.75rem;
      border: 1px solid var(--border);
    }

    .tab-btn {
      flex: 1;
      padding: 0.6rem;
      font-family: 'Inter', sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-secondary);
      background: transparent;
      border: none;
      cursor: pointer;
      border-radius: 0.6rem;
      z-index: 1;
      position: relative;
      transition: color 0.25s ease;
    }

    .tab-btn.active {
      color: var(--bg-primary);
    }

    .tab-indicator {
      position: absolute;
      top: 4px;
      left: 4px;
      width: calc(50% - 4px);
      height: calc(100% - 8px);
      background: var(--accent);
      border-radius: 0.6rem;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .tab-indicator.register {
      transform: translateX(100%);
    }

    /* Form */
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.1rem;
    }

    .field-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .field-label {
      font-family: 'Inter', sans-serif;
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--text-secondary);
      letter-spacing: 0.02em;
    }

    .field-row {
      display: flex;
      gap: 0.75rem;
    }

    .flex-1 {
      flex: 1;
    }

    .field-error {
      font-family: 'Inter', sans-serif;
      font-size: 0.75rem;
      color: var(--danger);
      margin-top: 2px;
    }

    /* Input overrides for select */
    select.input-field {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238a9a8a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 1rem center;
      padding-right: 2.5rem;
      cursor: pointer;
    }

    select.input-field option {
      background: var(--bg-secondary);
      color: var(--text-primary);
    }

    /* Role Cards */
    .role-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.65rem;
    }

    .role-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      padding: 1rem 0.5rem;
      background: var(--bg-input);
      border: 1.5px solid var(--border);
      border-radius: 0.75rem;
      cursor: pointer;
      transition: all 0.25s ease;
      text-align: center;
    }

    .role-card:hover {
      border-color: var(--border-strong);
      background: rgba(34, 197, 94, 0.04);
    }

    .role-card.selected {
      border-color: var(--accent);
      background: var(--accent-glow);
      box-shadow: 0 0 20px rgba(34, 197, 94, 0.12), inset 0 0 20px rgba(34, 197, 94, 0.05);
    }

    .role-icon {
      font-size: 1.5rem;
      line-height: 1;
    }

    .role-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .role-desc {
      font-family: 'Inter', sans-serif;
      font-size: 0.65rem;
      color: var(--text-muted);
      line-height: 1.3;
    }

    .role-card.selected .role-name {
      color: var(--accent);
    }

    /* Submit Button */
    .submit-btn {
      width: 100%;
      margin-top: 0.5rem;
      padding: 0.8rem;
      font-size: 0.95rem;
      font-weight: 600;
      font-family: 'Space Grotesk', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      letter-spacing: 0.01em;
    }

    .submit-btn:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    /* Spinner */
    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Footer */
    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--border);
    }

    .auth-footer p {
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin: 0;
    }

    .link {
      color: var(--accent);
      cursor: pointer;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .link:hover {
      color: var(--accent-hover);
    }

    /* Responsive */
    @media (max-width: 520px) {
      .auth-card {
        padding: 1.75rem 1.25rem;
      }

      .role-cards {
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;
      }

      .role-card {
        padding: 0.75rem 0.35rem;
      }

      .field-row {
        flex-direction: column;
        gap: 1.1rem;
      }

      .bg-glow {
        width: 350px;
        height: 350px;
      }
    }
  `]
})
export class AuthComponent implements OnInit {
  isLogin = signal(true);
  isLoading = signal(false);
  submitted = signal(false);

  // Login fields
  loginEmail = '';
  loginPassword = '';

  // Register fields
  regName = '';
  regEmail = '';
  regPhone = '';
  regPassword = '';
  regConfirmPassword = '';
  regRole: UserRole | '' = '';
  regDistrict = '';

  districts = DISTRICTS;

  roles: { value: UserRole; icon: string; label: string; desc: string }[] = [
    { value: 'FARMER', icon: '\uD83C\uDF3E', label: 'Farmer', desc: 'Rent equipment for your farm' },
    { value: 'AGENT', icon: '\uD83D\uDE9C', label: 'Owner', desc: 'List & rent out your equipment' },
    { value: 'ADMIN', icon: '\uD83D\uDD11', label: 'Admin', desc: 'Platform administration' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private auth: AuthService,
    private toast: ToastService,
    private mockData: MockDataService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['mode'] === 'register') {
        this.isLogin.set(false);
      }
    });
  }

  onLogin(): void {
    this.isLoading.set(true);
    this.api.loginUser({ email: this.loginEmail, password: this.loginPassword }).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        if (user) {
          this.auth.login(user);
          this.toast.show('Welcome back, ' + user.fullName + '!', 'success');
          this.navigateByRole(user.role as UserRole);
        } else {
          this.toast.show('Invalid email or password. Please try again.', 'error');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.toast.show('Login failed. Please try again.', 'error');
      }
    });
  }

  onRegister(): void {
    this.submitted.set(true);

    if (!this.regRole) {
      this.toast.show('Please select a role to continue.', 'error');
      return;
    }

    if (this.regPassword !== this.regConfirmPassword) {
      this.toast.show('Passwords do not match.', 'error');
      return;
    }

    this.isLoading.set(true);
    this.api.registerUser({
      fullName: this.regName,
      email: this.regEmail,
      phone: this.regPhone,
      password: this.regPassword,
      role: this.regRole,
      district: this.regDistrict
    }).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        if (user) {
          this.auth.login(user);
          this.toast.show('Account created successfully! Welcome to KrishiRent.', 'success');
          this.navigateByRole(user.role as UserRole);
        } else {
          this.toast.show('Registration failed. Please try again.', 'error');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.toast.show('Registration failed. Please try again.', 'error');
      }
    });
  }

  private navigateByRole(role: UserRole): void {
    const routes: Record<UserRole, string> = {
      FARMER: '/farmer',
      AGENT: '/owner',
      ADMIN: '/admin'
    };
    this.router.navigate([routes[role] || '/']);
  }
}
