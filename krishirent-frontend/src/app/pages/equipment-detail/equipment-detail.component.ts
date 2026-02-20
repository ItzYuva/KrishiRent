import { Component, OnInit, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Equipment, CATEGORY_IMAGES, BookingRequest, PaymentRequest } from '../../models/equipment.model';

@Component({
  selector: 'app-equipment-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- Loading State -->
    <div *ngIf="loading()" class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600 text-lg">Loading equipment details...</p>
      </div>
    </div>

    <!-- Not Found State -->
    <div *ngIf="!loading() && !equipment()" class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center">
        <div class="text-6xl mb-4">🚜</div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Equipment Not Found</h2>
        <p class="text-gray-600 mb-6">The equipment you're looking for doesn't exist or has been removed.</p>
        <a routerLink="/" class="inline-block px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors">
          Back to Home
        </a>
      </div>
    </div>

    <!-- Main Content -->
    <div *ngIf="!loading() && equipment()" class="min-h-screen bg-gray-50">
      <!-- Back Navigation -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <a routerLink="/" class="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors group">
          <svg class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span class="font-medium">Back to Equipment</span>
        </a>
      </div>

      <!-- Two Column Layout -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <!-- LEFT COLUMN -->
          <div class="lg:col-span-2 space-y-6">

            <!-- Hero Image -->
            <div class="relative rounded-2xl overflow-hidden shadow-xl" style="height: 400px;">
              <img
                [src]="heroImage()"
                [alt]="equipment()!.name"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0" [style.background]="'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 40%, transparent 60%)'"></div>
              <div class="absolute bottom-0 left-0 right-0 p-8">
                <span
                  class="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3"
                  [style.background-color]="categoryColor()"
                  style="color: white;"
                >
                  {{ equipment()!.type }}
                </span>
                <h1 class="text-3xl sm:text-4xl font-bold text-white leading-tight">{{ equipment()!.name }}</h1>
                <div class="flex items-center gap-3 mt-3">
                  <span class="text-amber-400 text-2xl font-bold">{{ '\u20B9' }}{{ equipment()!.hourlyRate }}/hr</span>
                  <span class="text-gray-300">|</span>
                  <span class="text-gray-300 flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    {{ equipment()!.location }}, {{ equipment()!.district }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Description Section -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 class="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                About this Equipment
              </h2>
              <p class="text-gray-600 leading-relaxed text-base">
                {{ equipment()!.description || 'No description available for this equipment. Contact the owner for more details about specifications and usage guidelines.' }}
              </p>
            </div>

            <!-- Specs Table -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                Specifications
              </h2>
              <div class="overflow-hidden rounded-xl border border-gray-200">
                <table class="w-full">
                  <tbody>
                    <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td class="px-5 py-3.5 text-sm font-semibold text-gray-500 bg-gray-50/50 w-40">Type</td>
                      <td class="px-5 py-3.5 text-sm text-gray-800 font-medium">
                        <span class="inline-flex items-center gap-1.5">
                          <span class="w-2.5 h-2.5 rounded-full" [style.background-color]="categoryColor()"></span>
                          {{ equipment()!.type }}
                        </span>
                      </td>
                    </tr>
                    <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td class="px-5 py-3.5 text-sm font-semibold text-gray-500 bg-gray-50/50">Hourly Rate</td>
                      <td class="px-5 py-3.5 text-sm text-gray-800 font-medium">{{ '\u20B9' }}{{ equipment()!.hourlyRate }} per hour</td>
                    </tr>
                    <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td class="px-5 py-3.5 text-sm font-semibold text-gray-500 bg-gray-50/50">Location</td>
                      <td class="px-5 py-3.5 text-sm text-gray-800 font-medium">{{ equipment()!.location }}</td>
                    </tr>
                    <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td class="px-5 py-3.5 text-sm font-semibold text-gray-500 bg-gray-50/50">District</td>
                      <td class="px-5 py-3.5 text-sm text-gray-800 font-medium">{{ equipment()!.district }}</td>
                    </tr>
                    <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td class="px-5 py-3.5 text-sm font-semibold text-gray-500 bg-gray-50/50">Status</td>
                      <td class="px-5 py-3.5 text-sm">
                        <span
                          class="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                          [class.bg-green-100]="equipment()!.status === 'AVAILABLE'"
                          [class.text-green-700]="equipment()!.status === 'AVAILABLE'"
                          [class.bg-red-100]="equipment()!.status !== 'AVAILABLE'"
                          [class.text-red-700]="equipment()!.status !== 'AVAILABLE'"
                        >
                          {{ equipment()!.status }}
                        </span>
                      </td>
                    </tr>
                    <tr class="hover:bg-gray-50 transition-colors">
                      <td class="px-5 py-3.5 text-sm font-semibold text-gray-500 bg-gray-50/50">Owner ID</td>
                      <td class="px-5 py-3.5 text-sm text-gray-800 font-medium">#{{ equipment()!.ownerId }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Cancellation Policy -->
            <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 class="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
                <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Cancellation Policy
              </h2>
              <div class="relative">
                <!-- Timeline line -->
                <div class="absolute left-[22px] top-3 bottom-3 w-0.5 bg-gray-200"></div>

                <!-- >24 hrs -->
                <div class="relative flex items-start gap-4 mb-6">
                  <div class="relative z-10 flex-shrink-0 w-11 h-11 rounded-full bg-green-100 flex items-center justify-center text-lg shadow-sm border-2 border-green-300">
                    🟢
                  </div>
                  <div class="pt-1.5">
                    <p class="font-semibold text-gray-800 text-sm">More than 24 hours before start</p>
                    <p class="text-green-600 font-bold text-sm mt-0.5">100% refund</p>
                  </div>
                </div>

                <!-- 12-24 hrs -->
                <div class="relative flex items-start gap-4 mb-6">
                  <div class="relative z-10 flex-shrink-0 w-11 h-11 rounded-full bg-yellow-100 flex items-center justify-center text-lg shadow-sm border-2 border-yellow-300">
                    🟡
                  </div>
                  <div class="pt-1.5">
                    <p class="font-semibold text-gray-800 text-sm">12 to 24 hours before start</p>
                    <p class="text-yellow-600 font-bold text-sm mt-0.5">80% refund</p>
                  </div>
                </div>

                <!-- <12 hrs -->
                <div class="relative flex items-start gap-4 mb-6">
                  <div class="relative z-10 flex-shrink-0 w-11 h-11 rounded-full bg-orange-100 flex items-center justify-center text-lg shadow-sm border-2 border-orange-300">
                    🟠
                  </div>
                  <div class="pt-1.5">
                    <p class="font-semibold text-gray-800 text-sm">Less than 12 hours before start</p>
                    <p class="text-orange-600 font-bold text-sm mt-0.5">50% refund</p>
                  </div>
                </div>

                <!-- After start -->
                <div class="relative flex items-start gap-4">
                  <div class="relative z-10 flex-shrink-0 w-11 h-11 rounded-full bg-red-100 flex items-center justify-center text-lg shadow-sm border-2 border-red-300">
                    🔴
                  </div>
                  <div class="pt-1.5">
                    <p class="font-semibold text-gray-800 text-sm">After rental has started</p>
                    <p class="text-red-600 font-bold text-sm mt-0.5">No refund</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN - Booking Widget -->
          <div class="lg:col-span-1">
            <div class="lg:sticky lg:top-6">
              <div class="booking-widget rounded-2xl p-6 shadow-xl border border-white/20">

                <!-- Progress Steps -->
                <div class="flex items-center justify-between mb-6">
                  <div *ngFor="let step of bookingSteps; let i = index" class="flex items-center" [class.flex-1]="i < bookingSteps.length - 1">
                    <div class="flex flex-col items-center">
                      <div
                        class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                        [class]="currentStep() > i + 1 ? 'bg-green-500 text-white' : currentStep() === i + 1 ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' : 'bg-gray-200 text-gray-500'"
                      >
                        <svg *ngIf="currentStep() > i + 1" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                        </svg>
                        <span *ngIf="currentStep() <= i + 1">{{ i + 1 }}</span>
                      </div>
                      <span class="text-[10px] font-medium mt-1 whitespace-nowrap" [class.text-amber-600]="currentStep() === i + 1" [class.text-green-600]="currentStep() > i + 1" [class.text-gray-400]="currentStep() < i + 1">
                        {{ step }}
                      </span>
                    </div>
                    <div *ngIf="i < bookingSteps.length - 1" class="flex-1 h-0.5 mx-2 mt-[-16px] transition-all duration-300" [class.bg-green-400]="currentStep() > i + 1" [class.bg-gray-200]="currentStep() <= i + 1"></div>
                  </div>
                </div>

                <!-- Step 1: Select Time -->
                <div *ngIf="currentStep() === 1">
                  <h3 class="text-lg font-bold text-gray-800 mb-4">Select Rental Period</h3>

                  <!-- Start DateTime -->
                  <div class="mb-4">
                    <label class="block text-sm font-semibold text-gray-600 mb-1.5">Start Date & Time</label>
                    <input
                      type="datetime-local"
                      [(ngModel)]="startDateTime"
                      (ngModelChange)="validateDates()"
                      class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-0 outline-none transition-colors bg-white text-sm"
                      [min]="minDateTime()"
                    />
                  </div>

                  <!-- End DateTime -->
                  <div class="mb-4">
                    <label class="block text-sm font-semibold text-gray-600 mb-1.5">End Date & Time</label>
                    <input
                      type="datetime-local"
                      [(ngModel)]="endDateTime"
                      (ngModelChange)="validateDates()"
                      class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-500 focus:ring-0 outline-none transition-colors bg-white text-sm"
                      [min]="startDateTime || minDateTime()"
                    />
                  </div>

                  <!-- Validation Errors -->
                  <div *ngIf="validationError()" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p class="text-red-600 text-sm font-medium flex items-start gap-2">
                      <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                      </svg>
                      {{ validationError() }}
                    </p>
                  </div>

                  <!-- Price Calculator -->
                  <div *ngIf="durationHours() > 0 && !validationError()" class="mb-5 p-4 bg-amber-50/80 rounded-xl border border-amber-200">
                    <h4 class="text-sm font-bold text-gray-700 mb-3">Price Breakdown</h4>
                    <div class="space-y-2">
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Duration</span>
                        <span class="font-medium text-gray-800">{{ durationHours() }} hours</span>
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Base Cost</span>
                        <span class="font-medium text-gray-800">{{ '\u20B9' }}{{ baseCost() | number:'1.2-2' }}</span>
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Platform Fee (5%)</span>
                        <span class="font-medium text-gray-800">{{ '\u20B9' }}{{ platformFee() | number:'1.2-2' }}</span>
                      </div>
                      <div class="border-t border-amber-300 pt-2 mt-2 flex justify-between">
                        <span class="font-bold text-gray-800">Total</span>
                        <span class="font-bold text-2xl text-amber-600">{{ '\u20B9' }}{{ totalCost() | number:'1.2-2' }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Next / Book Now Button -->
                  <button
                    (click)="proceedToReview()"
                    [disabled]="!canProceed()"
                    class="ripple w-full py-3.5 rounded-xl font-bold text-white text-base transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                    [class]="canProceed() ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5' : 'bg-gray-300'"
                  >
                    Continue to Review
                  </button>
                </div>

                <!-- Step 2: Review -->
                <div *ngIf="currentStep() === 2">
                  <h3 class="text-lg font-bold text-gray-800 mb-4">Review Your Booking</h3>

                  <div class="space-y-3 mb-5">
                    <div class="p-3 bg-gray-50 rounded-xl">
                      <p class="text-xs text-gray-500 font-medium">Equipment</p>
                      <p class="text-sm font-semibold text-gray-800">{{ equipment()!.name }}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                      <div class="p-3 bg-gray-50 rounded-xl">
                        <p class="text-xs text-gray-500 font-medium">Start</p>
                        <p class="text-sm font-semibold text-gray-800">{{ formatDateTime(startDateTime) }}</p>
                      </div>
                      <div class="p-3 bg-gray-50 rounded-xl">
                        <p class="text-xs text-gray-500 font-medium">End</p>
                        <p class="text-sm font-semibold text-gray-800">{{ formatDateTime(endDateTime) }}</p>
                      </div>
                    </div>
                    <div class="p-3 bg-gray-50 rounded-xl flex justify-between items-center">
                      <span class="text-xs text-gray-500 font-medium">Duration</span>
                      <span class="text-sm font-semibold text-gray-800">{{ durationHours() }} hours</span>
                    </div>
                    <div class="p-4 bg-amber-50 rounded-xl border border-amber-200 flex justify-between items-center">
                      <span class="font-bold text-gray-800">Total Amount</span>
                      <span class="font-bold text-2xl text-amber-600">{{ '\u20B9' }}{{ totalCost() | number:'1.2-2' }}</span>
                    </div>
                    <div class="p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <p class="text-xs text-blue-700 font-medium flex items-center gap-1">
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                        </svg>
                        Payment Method: Cash on Delivery
                      </p>
                    </div>
                  </div>

                  <div class="flex gap-3">
                    <button
                      (click)="currentStep.set(1)"
                      class="flex-1 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
                    >
                      Back
                    </button>
                    <button
                      (click)="confirmBooking()"
                      [disabled]="bookingInProgress()"
                      class="ripple flex-[2] py-3 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25 transition-all duration-300 disabled:opacity-60"
                    >
                      <span *ngIf="!bookingInProgress()">Confirm Booking</span>
                      <span *ngIf="bookingInProgress()" class="flex items-center justify-center gap-2">
                        <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </span>
                    </button>
                  </div>
                </div>

                <!-- Step 3: Confirmed -->
                <div *ngIf="currentStep() === 3" class="text-center py-4">
                  <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <h3 class="text-lg font-bold text-gray-800 mb-1">Booking Confirmed!</h3>
                  <p class="text-sm text-gray-500 mb-4">Your booking ID: #{{ confirmedBookingId() }}</p>
                  <a routerLink="/my-bookings" class="inline-block w-full py-3 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 text-center">
                    View My Bookings
                  </a>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Success Overlay -->
    <div
      *ngIf="showSuccessOverlay()"
      class="success-overlay fixed inset-0 z-50 flex items-center justify-center"
    >
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <!-- Confetti -->
      <div class="confetti-container absolute inset-0 overflow-hidden pointer-events-none">
        <div *ngFor="let c of confettiPieces" class="confetti-piece" [style.left.%]="c.left" [style.animation-delay]="c.delay + 's'" [style.background-color]="c.color"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 text-center p-8 max-w-md mx-4">
        <!-- Animated Checkmark -->
        <div class="mx-auto mb-6">
          <svg class="checkmark-svg" width="120" height="120" viewBox="0 0 120 120">
            <circle class="checkmark-circle" cx="60" cy="60" r="54" fill="none" stroke="#22c55e" stroke-width="4"/>
            <path class="checkmark-check" d="M38 62 l15 15 l30 -35" fill="none" stroke="#22c55e" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <h2 class="text-3xl font-bold text-white mb-2">Booking Confirmed!</h2>
        <p class="text-gray-300 text-lg mb-2">Your equipment has been reserved</p>
        <p class="text-amber-400 font-semibold text-lg mb-8">Booking ID: #{{ confirmedBookingId() }}</p>

        <button
          (click)="navigateToBookings()"
          class="ripple px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/30 transition-all duration-300 hover:-translate-y-0.5"
        >
          View My Bookings
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .booking-widget {
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .ripple {
      position: relative;
      overflow: hidden;
    }
    .ripple::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at var(--ripple-x, 50%) var(--ripple-y, 50%), rgba(255,255,255,0.3) 0%, transparent 60%);
      opacity: 0;
      transition: opacity 0.3s;
    }
    .ripple:hover::after {
      opacity: 1;
    }

    /* Checkmark SVG Animation */
    .checkmark-svg {
      filter: drop-shadow(0 0 20px rgba(34, 197, 94, 0.4));
    }
    .checkmark-circle {
      stroke-dasharray: 340;
      stroke-dashoffset: 340;
      animation: checkmark-circle-anim 0.6s ease-out 0.2s forwards;
    }
    .checkmark-check {
      stroke-dasharray: 80;
      stroke-dashoffset: 80;
      animation: checkmark-check-anim 0.4s ease-out 0.7s forwards;
    }
    @keyframes checkmark-circle-anim {
      to { stroke-dashoffset: 0; }
    }
    @keyframes checkmark-check-anim {
      to { stroke-dashoffset: 0; }
    }

    /* Success overlay fade in */
    .success-overlay {
      animation: overlay-fade-in 0.3s ease-out;
    }
    @keyframes overlay-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Confetti */
    .confetti-piece {
      position: absolute;
      top: -20px;
      width: 10px;
      height: 10px;
      border-radius: 2px;
      animation: confetti-fall 3s ease-in forwards;
    }
    @keyframes confetti-fall {
      0% {
        transform: translateY(0) rotate(0deg) scale(1);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(720deg) scale(0.5);
        opacity: 0;
      }
    }

    /* datetime-local input styling */
    input[type="datetime-local"] {
      color-scheme: light;
    }
    input[type="datetime-local"]::-webkit-calendar-picker-indicator {
      cursor: pointer;
      opacity: 0.6;
    }
    input[type="datetime-local"]::-webkit-calendar-picker-indicator:hover {
      opacity: 1;
    }
  `]
})
export class EquipmentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  // State signals
  equipment = signal<Equipment | null>(null);
  loading = signal(true);
  currentStep = signal(1);
  bookingInProgress = signal(false);
  showSuccessOverlay = signal(false);
  confirmedBookingId = signal<number | null>(null);
  validationError = signal<string>('');

  // Form state
  startDateTime = '';
  endDateTime = '';

  // Booking steps
  bookingSteps = ['Select Time', 'Review', 'Confirmed'];

  // Confetti pieces
  confettiPieces: { left: number; delay: number; color: string }[] = [];

  // Computed values
  heroImage = computed(() => {
    const eq = this.equipment();
    if (!eq) return CATEGORY_IMAGES['DEFAULT'];
    return CATEGORY_IMAGES[eq.type] || CATEGORY_IMAGES['DEFAULT'];
  });

  categoryColor = computed(() => {
    const eq = this.equipment();
    if (!eq) return '#6B7280';
    const typeColors: Record<string, string> = {
      TRACTOR: '#22c55e', HARVESTER: '#f59e0b', IRRIGATION: '#3b82f6',
      PUMP: '#06b6d4', SPRAYER: '#8b5cf6', SEEDER: '#10b981',
      PLOUGH: '#f97316', THRESHER: '#14b8a6'
    };
    return typeColors[eq.type] || '#6B7280';
  });

  minDateTime = computed(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 60);
    return this.toLocalDateTimeString(now);
  });

  durationHours = computed(() => {
    if (!this.startDateTime || !this.endDateTime) return 0;
    const start = new Date(this.startDateTime);
    const end = new Date(this.endDateTime);
    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) return 0;
    return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
  });

  baseCost = computed(() => {
    const eq = this.equipment();
    if (!eq) return 0;
    return Math.round(eq.hourlyRate * this.durationHours() * 100) / 100;
  });

  platformFee = computed(() => {
    return Math.round(this.baseCost() * 0.05 * 100) / 100;
  });

  totalCost = computed(() => {
    return Math.round((this.baseCost() + this.platformFee()) * 100) / 100;
  });

  canProceed = computed(() => {
    return this.durationHours() > 0 && !this.validationError() && this.startDateTime && this.endDateTime;
  });

  constructor() {
    // Generate confetti pieces
    const colors = ['#f59e0b', '#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#eab308'];
    for (let i = 0; i < 20; i++) {
      this.confettiPieces.push({
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        color: colors[i % colors.length]
      });
    }
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.loading.set(false);
      return;
    }

    const id = Number(idParam);
    if (isNaN(id)) {
      this.loading.set(false);
      return;
    }

    this.api.getEquipmentById(id).subscribe(eq => {
      this.equipment.set(eq);
      this.loading.set(false);
    });
  }

  validateDates(): void {
    if (!this.startDateTime || !this.endDateTime) {
      this.validationError.set('');
      // Force recomputation by reading the signals
      this.durationHours();
      return;
    }

    const start = new Date(this.startDateTime);
    const end = new Date(this.endDateTime);
    const now = new Date();

    // Check if start is in the past
    if (start <= now) {
      this.validationError.set('Start time must be in the future.');
      return;
    }

    // Check end is after start
    if (end <= start) {
      this.validationError.set('End time must be after start time.');
      return;
    }

    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    // Min 2 hours
    if (diffHours < 2) {
      this.validationError.set('Minimum rental duration is 2 hours.');
      return;
    }

    // Max 72 hours
    if (diffHours > 72) {
      this.validationError.set('Maximum rental duration is 72 hours.');
      return;
    }

    // Operating hours: 6 AM to 8 PM
    const startHour = start.getHours();
    const endHour = end.getHours();
    const endMinutes = end.getMinutes();

    if (startHour < 6) {
      this.validationError.set('Operating hours are 6:00 AM to 8:00 PM. Start time is too early.');
      return;
    }

    if (startHour >= 20) {
      this.validationError.set('Operating hours are 6:00 AM to 8:00 PM. Start time is too late.');
      return;
    }

    if (endHour > 20 || (endHour === 20 && endMinutes > 0)) {
      this.validationError.set('Operating hours are 6:00 AM to 8:00 PM. End time exceeds operating hours.');
      return;
    }

    if (endHour < 6) {
      this.validationError.set('Operating hours are 6:00 AM to 8:00 PM. End time is too early.');
      return;
    }

    this.validationError.set('');
  }

  proceedToReview(): void {
    if (!this.canProceed()) return;
    this.currentStep.set(2);
  }

  confirmBooking(): void {
    const eq = this.equipment();
    if (!eq) return;

    // Check login
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/equipment/${eq.id}` }
      });
      return;
    }

    const user = this.auth.user();
    if (!user) return;

    this.bookingInProgress.set(true);

    const bookingRequest: BookingRequest = {
      equipmentId: eq.id,
      farmerId: user.id,
      startTime: new Date(this.startDateTime).toISOString(),
      endTime: new Date(this.endDateTime).toISOString()
    };

    this.api.createBooking(bookingRequest).subscribe(booking => {
      if (!booking) {
        this.bookingInProgress.set(false);
        this.toast.show('Failed to create booking. Please try again.', 'error');
        return;
      }

      // Create payment
      const paymentRequest: PaymentRequest = {
        bookingId: booking.id,
        amount: this.totalCost(),
        platformFee: this.platformFee(),
        paymentMethod: 'CASH'
      };

      this.api.createPayment(paymentRequest).subscribe(payment => {
        this.bookingInProgress.set(false);

        if (!payment) {
          this.toast.show('Booking created but payment registration failed.', 'error');
          this.confirmedBookingId.set(booking.id);
          this.currentStep.set(3);
          return;
        }

        this.confirmedBookingId.set(booking.id);
        this.currentStep.set(3);
        this.showSuccessOverlay.set(true);
        this.toast.show('Booking confirmed successfully!', 'success');
      });
    });
  }

  navigateToBookings(): void {
    this.showSuccessOverlay.set(false);
    this.router.navigate(['/my-bookings']);
  }

  formatDateTime(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  private toLocalDateTimeString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}
