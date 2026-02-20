import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex">
      <!-- Left Panel -->
      <div class="hidden lg:flex lg:w-1/2 items-center justify-center p-12"
           style="background: var(--bg-hero);">
        <div class="text-center text-white max-w-md">
          <div class="text-6xl mb-6">🌾</div>
          <h2 class="text-3xl font-bold mb-4">Join KrishiRent</h2>
          <p class="text-white/80 text-lg leading-relaxed mb-8">
            Start renting farm equipment at affordable hourly rates
          </p>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <div class="text-2xl mb-2">⚡</div>
              <div class="text-white/80">Instant Booking</div>
            </div>
            <div class="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <div class="text-2xl mb-2">💰</div>
              <div class="text-white/80">Pay Per Hour</div>
            </div>
            <div class="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <div class="text-2xl mb-2">🛡️</div>
              <div class="text-white/80">Secure & Safe</div>
            </div>
            <div class="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
              <div class="text-2xl mb-2">📍</div>
              <div class="text-white/80">Near Your Farm</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8"
           style="background: var(--bg-primary);">
        <div class="w-full max-w-md">
          <div class="text-center mb-6">
            <h1 class="text-3xl font-bold mb-2" style="color: var(--text-primary);">Create Account</h1>
            <p style="color: var(--text-secondary);">Join thousands of Indian farmers</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()"
                class="p-8 rounded-2xl shadow-lg"
                style="background: var(--bg-card); border: 1px solid var(--border);">

            <!-- Full Name -->
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary);">Full Name</label>
              <input formControlName="fullName" type="text" placeholder="Ravi Kumar"
                     class="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                     style="background: var(--bg-primary); border: 1px solid var(--border); color: var(--text-primary);">
              @if (registerForm.get('fullName')?.invalid && registerForm.get('fullName')?.touched) {
                <p class="text-red-500 text-xs mt-1">Full name is required</p>
              }
            </div>

            <!-- Email -->
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary);">Email</label>
              <input formControlName="email" type="email" placeholder="farmer@example.com"
                     class="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                     style="background: var(--bg-primary); border: 1px solid var(--border); color: var(--text-primary);">
              @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
                <p class="text-red-500 text-xs mt-1">Valid email is required</p>
              }
            </div>

            <!-- Phone & District row -->
            <div class="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary);">Phone</label>
                <input formControlName="phone" type="tel" placeholder="9876543210"
                       class="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                       style="background: var(--bg-primary); border: 1px solid var(--border); color: var(--text-primary);">
                @if (registerForm.get('phone')?.invalid && registerForm.get('phone')?.touched) {
                  <p class="text-red-500 text-xs mt-1">10-digit number</p>
                }
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary);">District</label>
                <input formControlName="district" type="text" placeholder="Pune"
                       class="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                       style="background: var(--bg-primary); border: 1px solid var(--border); color: var(--text-primary);">
                @if (registerForm.get('district')?.invalid && registerForm.get('district')?.touched) {
                  <p class="text-red-500 text-xs mt-1">Required</p>
                }
              </div>
            </div>

            <!-- Password -->
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary);">Password</label>
              <input formControlName="password" type="password" placeholder="Min 6 characters"
                     class="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                     style="background: var(--bg-primary); border: 1px solid var(--border); color: var(--text-primary);">
              @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
                <p class="text-red-500 text-xs mt-1">Minimum 6 characters</p>
              }
            </div>

            <!-- Confirm Password -->
            <div class="mb-6">
              <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary);">Confirm Password</label>
              <input formControlName="confirmPassword" type="password" placeholder="Re-enter password"
                     class="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                     style="background: var(--bg-primary); border: 1px solid var(--border); color: var(--text-primary);">
              @if (registerForm.get('confirmPassword')?.touched && registerForm.hasError('mismatch')) {
                <p class="text-red-500 text-xs mt-1">Passwords do not match</p>
              }
            </div>

            @if (errorMsg()) {
              <div class="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center">
                {{ errorMsg() }}
              </div>
            }

            <button type="submit" [disabled]="loading()"
                    class="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all ripple cursor-pointer border-0"
                    style="background: linear-gradient(135deg, #FF8F00, #F57C00);">
              {{ loading() ? 'Creating Account...' : 'Register' }}
            </button>
          </form>

          <p class="text-center mt-6 text-sm" style="color: var(--text-secondary);">
            Already have an account?
            <a routerLink="/login" class="font-semibold no-underline" style="color: var(--accent);">Login</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = signal(false);
  errorMsg = signal('');

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      district: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatch });
  }

  passwordMatch(group: AbstractControl) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');

    const { fullName, email, phone, district, password } = this.registerForm.value;
    this.api.registerUser({ fullName, email, phone, password, role: 'FARMER', district }).subscribe(user => {
      this.loading.set(false);
      if (user) {
        this.auth.login(user);
        this.toast.show(`Welcome to KrishiRent, ${user.fullName}!`, 'success');
        this.router.navigate(['/']);
      } else {
        this.errorMsg.set('Registration failed. Email may already exist.');
        this.toast.show('Registration failed', 'error');
      }
    });
  }
}
