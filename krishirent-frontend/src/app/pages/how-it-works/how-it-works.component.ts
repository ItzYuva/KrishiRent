import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-5xl mx-auto px-4 py-12">
      <!-- Hero -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold mb-4" style="color: var(--text-primary);">
          How KrishiRent Works
        </h1>
        <p class="text-lg max-w-2xl mx-auto" style="color: var(--text-secondary);">
          Rent agricultural equipment in 3 simple steps. No ownership hassle, just hourly rental.
        </p>
      </div>

      <!-- Steps Timeline -->
      <div class="relative mb-20">
        <!-- Vertical line -->
        <div class="absolute left-8 top-0 bottom-0 w-0.5 hidden md:block" style="background: var(--border);"></div>

        @for (step of steps; track step.num; let i = $index) {
          <div class="flex items-start gap-6 mb-12 relative">
            <!-- Step circle -->
            <div class="w-16 h-16 rounded-full flex items-center justify-center text-2xl flex-shrink-0 z-10 shadow-lg"
                 style="background: linear-gradient(135deg, #2E7D32, #1B5E20);">
              {{ step.icon }}
            </div>
            <!-- Content -->
            <div class="flex-1 p-6 rounded-2xl transition-all hover:shadow-lg"
                 style="background: var(--bg-card); border: 1px solid var(--border);">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                      style="background: var(--accent);">Step {{ step.num }}</span>
                <h3 class="text-xl font-semibold" style="color: var(--text-primary);">{{ step.title }}</h3>
              </div>
              <p class="leading-relaxed" style="color: var(--text-secondary);">{{ step.desc }}</p>
            </div>
          </div>
        }
      </div>

      <!-- Cancellation Policy -->
      <div class="mb-20">
        <h2 class="text-2xl font-bold text-center mb-8" style="color: var(--text-primary);">
          Cancellation Policy
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          @for (policy of policies; track policy.label) {
            <div class="p-5 rounded-2xl text-center transition-all hover:shadow-lg"
                 style="background: var(--bg-card); border: 1px solid var(--border);">
              <div class="text-3xl mb-3">{{ policy.icon }}</div>
              <div class="font-semibold mb-1" style="color: var(--text-primary);">{{ policy.label }}</div>
              <div class="text-2xl font-bold mb-1" [style.color]="policy.color">{{ policy.refund }}</div>
              <div class="text-xs" style="color: var(--text-secondary);">{{ policy.note }}</div>
            </div>
          }
        </div>
      </div>

      <!-- FAQ -->
      <div class="mb-20">
        <h2 class="text-2xl font-bold text-center mb-8" style="color: var(--text-primary);">
          Frequently Asked Questions
        </h2>
        <div class="space-y-3 max-w-3xl mx-auto">
          @for (faq of faqs; track faq.q; let i = $index) {
            <div class="rounded-2xl overflow-hidden transition-all"
                 style="background: var(--bg-card); border: 1px solid var(--border);">
              <button (click)="toggleFaq(i)"
                      class="w-full flex items-center justify-between p-5 text-left cursor-pointer bg-transparent border-0"
                      style="color: var(--text-primary);">
                <span class="font-medium text-sm pr-4">{{ faq.q }}</span>
                <span class="text-lg transition-transform duration-300 flex-shrink-0"
                      [style.transform]="openFaq() === i ? 'rotate(180deg)' : 'rotate(0)'">
                  ▾
                </span>
              </button>
              @if (openFaq() === i) {
                <div class="px-5 pb-5 text-sm leading-relaxed" style="color: var(--text-secondary);">
                  {{ faq.a }}
                </div>
              }
            </div>
          }
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center p-12 rounded-3xl" style="background: var(--bg-hero);">
        <h2 class="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
        <p class="text-white/70 mb-8 max-w-lg mx-auto">
          Browse our collection of farm equipment and book your first rental today.
        </p>
        <a routerLink="/"
           class="inline-block px-8 py-3 rounded-xl text-white font-semibold text-sm no-underline transition-all ripple"
           style="background: var(--accent);">
          Browse Equipment →
        </a>
      </div>
    </div>
  `
})
export class HowItWorksComponent {
  openFaq = signal<number | null>(null);

  steps = [
    { num: 1, icon: '🔍', title: 'Browse & Search', desc: 'Search for equipment in your district. Filter by category — tractors, harvesters, pumps, and more. Compare hourly rates and availability.' },
    { num: 2, icon: '📅', title: 'Book & Pay', desc: 'Select your preferred time slot (minimum 2 hours, maximum 72 hours). Review the cost breakdown including platform fees. Confirm and pay securely.' },
    { num: 3, icon: '🚜', title: 'Use & Return', desc: 'Pick up the equipment from the owner\'s location. Use it for your farming needs during the booked hours. Return it on time for a smooth experience.' }
  ];

  policies = [
    { icon: '🟢', label: '> 24 hours', refund: '100%', color: '#2E7D32', note: 'Platform fee non-refundable' },
    { icon: '🟡', label: '12-24 hours', refund: '80%', color: '#FF8F00', note: 'Before start time' },
    { icon: '🟠', label: '< 12 hours', refund: '50%', color: '#E65100', note: 'Before start time' },
    { icon: '🔴', label: 'After start', refund: '0%', color: '#C62828', note: 'No refund available' }
  ];

  faqs = [
    { q: 'How do I book equipment?', a: 'Browse the equipment catalog on the home page, select an item, choose your time slot, and click "Book Now". You\'ll need to create an account first if you haven\'t already.' },
    { q: 'What payment methods are accepted?', a: 'Currently we support Cash on Delivery (COD). You pay the equipment owner directly when you pick up the equipment. Online payment methods coming soon!' },
    { q: 'What if the equipment breaks down?', a: 'If the equipment malfunctions during your rental period, contact the owner immediately. The remaining rental hours will be refunded. KrishiRent is not liable for equipment failures but will mediate disputes.' },
    { q: 'Can I extend my booking?', a: 'Yes, you can extend your booking if the equipment is available for the extended period. Contact the owner or create a new booking for the additional hours.' }
  ];

  toggleFaq(index: number) {
    this.openFaq.set(this.openFaq() === index ? null : index);
  }
}
