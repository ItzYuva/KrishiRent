import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex">
      <!-- Left Panel -->
      <div class="hidden lg:flex lg:w-1/2 items-center justify-center p-12"
           style="background: var(--bg-hero);">
        <div class="text-center text-white max-w-md">
          <div class="text-6xl mb-6">🌾</div>
          <h2 class="text-3xl font-bold mb-4">KrishiRent</h2>
          <p class="text-white/80 text-lg leading-relaxed mb-8">
            Empowering Indian Farmers with Technology
          </p>
          <div class="space-y-4 text-white/60 text-sm">
            <div class="flex items-center gap-3 justify-center">
              <span class="text-xl">🚜</span>
              <span>500+ Equipment Available</span>
            </div>
            <div class="flex items-center gap-3 justify-center">
              <span class="text-xl">📍</span>
              <span>50+ Districts Covered</span>
            </div>
            <div class="flex items-center gap-3 justify-center">
              <span class="text-xl">👨‍🌾</span>
              <span>10,000+ Farmers Served</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel - Form -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8"
           style="background: var(--bg-primary);">
        <div class="w-full max-w-md">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold mb-2" style="color: var(--text-primary);">Welcome Back</h1>
            <p style="color: var(--text-secondary);">Login to your KrishiRent account</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()"
                class="p-8 rounded-2xl shadow-lg"
                style="background: var(--bg-card); border: 1px solid var(--border);">

            <!-- Email -->
            <div class="mb-5">
              <label class="block text-sm font-medium mb-2" style="color: var(--text-primary);">Email Address</label>
              <input formControlName="email" type="email" placeholder="farmer@example.com"
                     class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                     style="background: var(--bg-primary); border: 1px solid var(--border); color: var(--text-primary);"
                     [style.borderColor]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched ? '#C62828' : ''">
              @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                <p class="text-red-500 text-xs mt-1">Valid email is required</p>
              }
            </div>

            <!-- Password -->
            <div class="mb-6">
              <label class="block text-sm font-medium mb-2" style="color: var(--text-primary);">Password</label>
              <input formControlName="password" type="password" placeholder="Enter your password"
                     class="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                     style="background: var(--bg-primary); border: 1px solid var(--border); color: var(--text-primary);"
                     [style.borderColor]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched ? '#C62828' : ''">
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <p class="text-red-500 text-xs mt-1">Password is required</p>
              }
            </div>

            @if (errorMsg()) {
              <div class="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center">
                {{ errorMsg() }}
              </div>
            }

            <!-- Submit -->
            <button type="submit" [disabled]="loading()"
                    class="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all ripple cursor-pointer border-0"
                    style="background: linear-gradient(135deg, #FF8F00, #F57C00);">
              {{ loading() ? 'Logging in...' : 'Login' }}
            </button>
          </form>

          <p class="text-center mt-6 text-sm" style="color: var(--text-secondary);">
            Don't have an account?
            <a routerLink="/register" class="font-semibold no-underline" style="color: var(--accent);">Register</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = signal(false);
  errorMsg = signal('');

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');

    const { email, password } = this.loginForm.value;
    this.api.loginUser({ email, password }).subscribe(user => {
      this.loading.set(false);
      if (user) {
        this.auth.login(user);
        this.toast.show(`Welcome back, ${user.fullName}!`, 'success');
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      } else {
        this.errorMsg.set('Invalid email or password. Please try again.');
        this.toast.show('Login failed', 'error');
      }
    });
  }
}
