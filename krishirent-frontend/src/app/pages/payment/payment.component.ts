import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { MockDataService } from '../../services/mock-data.service';
import { Booking, Payment } from '../../models/equipment.model';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container-app py-10">
      <div class="max-w-2xl mx-auto">

        @if (paymentSuccess()) {
          <!-- Success State -->
          <div class="glass-card p-10 text-center">
            <div class="text-6xl mb-4" style="animation: float 3s ease-in-out infinite;">✅</div>
            <h2 class="text-2xl font-bold mb-2" style="color: var(--text-primary); font-family: 'Space Grotesk';">Payment Successful!</h2>
            <p class="text-sm mb-6" style="color: var(--text-muted);">Your payment of ₹{{ booking()?.totalCost?.toLocaleString() }} has been processed</p>
            <div class="glass-card p-4 mb-6 text-left">
              <div class="grid grid-cols-2 gap-3 text-sm">
                <div style="color: var(--text-muted);">Transaction ID</div>
                <div style="color: var(--text-primary);">#TXN{{ booking()?.id }}{{ Date.now().toString().slice(-4) }}</div>
                <div style="color: var(--text-muted);">Equipment</div>
                <div style="color: var(--text-primary);">{{ booking()?.equipmentName }}</div>
                <div style="color: var(--text-muted);">Amount Paid</div>
                <div class="font-bold" style="color: var(--accent);">₹{{ booking()?.totalCost?.toLocaleString() }}</div>
                <div style="color: var(--text-muted);">Payment Method</div>
                <div style="color: var(--text-primary);">{{ selectedMethod() }}</div>
              </div>
            </div>
            <div class="flex gap-3 justify-center">
              <a routerLink="/bookings" class="btn-secondary no-underline">View Bookings</a>
              <a routerLink="/farmer" class="btn-primary no-underline">Go to Dashboard</a>
            </div>
          </div>
        } @else {
          <!-- Payment Form -->
          <div class="mb-8">
            <h1 class="text-2xl font-bold" style="color: var(--text-primary); font-family: 'Space Grotesk';">Make Payment</h1>
            <p class="text-sm mt-1" style="color: var(--text-muted);">Complete your booking payment securely</p>
          </div>

          @if (booking(); as b) {
            <!-- Booking Summary -->
            <div class="glass-card p-5 mb-6">
              <h3 class="text-sm font-semibold mb-3" style="color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Booking Summary</h3>
              <div class="flex items-center justify-between mb-3">
                <span style="color: var(--text-primary);" class="font-medium">{{ b.equipmentName }}</span>
                <span class="text-xs px-2 py-1 rounded" style="background: var(--accent-soft); color: var(--accent);">Booking #{{ b.id }}</span>
              </div>
              <div class="space-y-2 text-sm" style="color: var(--text-secondary);">
                <div class="flex justify-between">
                  <span>Duration</span>
                  <span>{{ b.totalHours }} hours</span>
                </div>
                <div class="flex justify-between">
                  <span>Base Cost</span>
                  <span>₹{{ b.baseCost.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Platform Fee</span>
                  <span>₹{{ b.platformFee }}</span>
                </div>
                <div class="flex justify-between pt-2 font-bold" style="border-top: 1px solid var(--border); color: var(--text-primary);">
                  <span>Total</span>
                  <span style="color: var(--accent);">₹{{ b.totalCost.toLocaleString() }}</span>
                </div>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="glass-card p-5 mb-6">
              <h3 class="text-sm font-semibold mb-4" style="color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Payment Method</h3>
              <div class="grid grid-cols-3 gap-3">
                @for (method of methods; track method.value) {
                  <button (click)="selectedMethod.set(method.value)"
                          class="p-4 rounded-xl text-center transition-all cursor-pointer"
                          [style.background]="selectedMethod() === method.value ? 'var(--accent-soft)' : 'var(--bg-input)'"
                          [style.border]="selectedMethod() === method.value ? '1px solid var(--accent)' : '1px solid var(--border)'"
                          [style.boxShadow]="selectedMethod() === method.value ? '0 0 20px var(--accent-glow)' : 'none'">
                    <div class="text-2xl mb-1">{{ method.icon }}</div>
                    <div class="text-xs font-medium" [style.color]="selectedMethod() === method.value ? 'var(--accent)' : 'var(--text-secondary)'">{{ method.label }}</div>
                  </button>
                }
              </div>

              @if (selectedMethod() === 'UPI') {
                <div class="mt-4">
                  <label class="block text-xs mb-1" style="color: var(--text-muted);">UPI ID</label>
                  <input class="input-field" placeholder="yourname@upi" [(ngModel)]="upiId">
                </div>
              }
              @if (selectedMethod() === 'CARD') {
                <div class="mt-4 space-y-3">
                  <div>
                    <label class="block text-xs mb-1" style="color: var(--text-muted);">Card Number</label>
                    <input class="input-field" placeholder="1234 5678 9012 3456" [(ngModel)]="cardNumber">
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-xs mb-1" style="color: var(--text-muted);">Expiry</label>
                      <input class="input-field" placeholder="MM/YY" [(ngModel)]="cardExpiry">
                    </div>
                    <div>
                      <label class="block text-xs mb-1" style="color: var(--text-muted);">CVV</label>
                      <input class="input-field" type="password" placeholder="***" [(ngModel)]="cardCvv">
                    </div>
                  </div>
                </div>
              }
              @if (selectedMethod() === 'NET_BANKING') {
                <div class="mt-4">
                  <label class="block text-xs mb-1" style="color: var(--text-muted);">Select Bank</label>
                  <select class="input-field" [(ngModel)]="selectedBank">
                    <option value="">Choose your bank</option>
                    <option value="SBI">State Bank of India</option>
                    <option value="HDFC">HDFC Bank</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="AXIS">Axis Bank</option>
                    <option value="BOB">Bank of Baroda</option>
                  </select>
                </div>
              }
            </div>

            <!-- Pay Button -->
            <button (click)="processPayment()"
                    [disabled]="processing()"
                    class="btn-primary w-full py-3 text-base"
                    [style.opacity]="processing() ? '0.6' : '1'">
              @if (processing()) {
                <span class="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full mr-2" style="animation: spin 0.6s linear infinite;"></span>
                Processing...
              } @else {
                Pay ₹{{ b.totalCost.toLocaleString() }}
              }
            </button>
          } @else {
            <div class="glass-card p-10 text-center">
              <div class="text-4xl mb-4">🔍</div>
              <h3 class="text-lg font-semibold mb-2" style="color: var(--text-primary); font-family: 'Space Grotesk';">No booking selected</h3>
              <p class="text-sm mb-4" style="color: var(--text-muted);">Go to your bookings to select one for payment</p>
              <a routerLink="/bookings" class="btn-primary no-underline inline-block">View Bookings</a>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `]
})
export class PaymentComponent implements OnInit {
  booking = signal<Booking | null>(null);
  selectedMethod = signal('UPI');
  processing = signal(false);
  paymentSuccess = signal(false);

  upiId = '';
  cardNumber = '';
  cardExpiry = '';
  cardCvv = '';
  selectedBank = '';

  Date = Date;

  methods = [
    { value: 'UPI', label: 'UPI', icon: '📱' },
    { value: 'CARD', label: 'Card', icon: '💳' },
    { value: 'NET_BANKING', label: 'Net Banking', icon: '🏦' }
  ];

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private toast: ToastService,
    private mock: MockDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const bookingId = this.route.snapshot.queryParams['bookingId'];
    if (bookingId) {
      this.api.getBookingById(+bookingId).subscribe(b => {
        if (b) {
          this.booking.set(b);
        } else {
          const mockBooking = this.mock.getBookings().find(bk => bk.id === +bookingId);
          if (mockBooking) this.booking.set(mockBooking);
        }
      });
    }
  }

  processPayment() {
    const b = this.booking();
    if (!b) return;

    this.processing.set(true);

    const request = {
      bookingId: b.id,
      amount: b.totalCost,
      platformFee: b.platformFee,
      paymentMethod: this.selectedMethod()
    };

    this.api.createPayment(request).subscribe(payment => {
      setTimeout(() => {
        this.processing.set(false);
        this.paymentSuccess.set(true);
        this.toast.show('Payment successful!', 'success');
      }, 1500);
    });
  }
}
