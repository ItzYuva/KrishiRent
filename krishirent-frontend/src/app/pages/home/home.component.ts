import { Component, OnInit, OnDestroy, signal, computed, inject, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { MockDataService } from '../../services/mock-data.service';
import { AuthService } from '../../services/auth.service';
import { Equipment, CATEGORY_IMAGES, EQUIPMENT_TYPES } from '../../models/equipment.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- ===== HERO SECTION ===== -->
    <section class="hero-section relative overflow-hidden min-h-[92vh] flex items-center justify-center">
      <!-- Animated Background Particles -->
      <div class="particles-container absolute inset-0 overflow-hidden pointer-events-none">
        @for (p of particles; track p.id) {
          <div class="particle"
               [style.left.%]="p.x"
               [style.top.%]="p.y"
               [style.width.px]="p.size"
               [style.height.px]="p.size"
               [style.animationDelay]="p.delay + 's'"
               [style.animationDuration]="p.duration + 's'">
          </div>
        }
      </div>

      <!-- Grid Pattern Overlay -->
      <div class="absolute inset-0 opacity-[0.03]"
           style="background-image: radial-gradient(circle, var(--accent) 1px, transparent 1px); background-size: 40px 40px;"></div>

      <!-- Gradient Orbs -->
      <div class="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.07]"
           style="background: var(--accent);"></div>
      <div class="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full blur-[150px] opacity-[0.05]"
           style="background: var(--accent);"></div>

      <div class="relative container-app py-20 md:py-28 flex flex-col items-center text-center z-10">
        <!-- Badge -->
        <div class="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium"
             style="background: var(--accent-soft); border: 1px solid var(--border-strong); color: var(--accent);">
          <span class="w-2 h-2 rounded-full animate-pulse" style="background: var(--accent);"></span>
          India's Smart AgriTech Platform
        </div>

        <!-- Main Heading -->
        <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight hero-title"
            style="color: var(--text-primary); font-family: 'Space Grotesk', sans-serif;">
          Smart <span style="color: var(--accent);">Farm Equipment</span><br>
          <span style="color: var(--accent);">Rental</span> Platform
        </h1>

        <!-- Subtitle -->
        <p class="text-base sm:text-lg md:text-xl mb-10 max-w-2xl leading-relaxed hero-subtitle"
           style="color: var(--text-secondary);">
          Empowering Indian farmers with affordable, on-demand access to modern agricultural
          equipment. Rent by the hour, grow by the season.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 mb-14 hero-buttons">
          <a routerLink="/auth" [queryParams]="{mode: 'register'}"
             class="btn-primary px-8 py-3.5 text-base font-bold rounded-xl no-underline inline-flex items-center gap-2 hero-cta-primary">
            Get Started
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </a>
          <button (click)="scrollToSection('categories-section')"
                  class="btn-secondary px-8 py-3.5 text-base font-semibold rounded-xl inline-flex items-center gap-2">
            Browse Equipment
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>

        <!-- Floating Stat Badges -->
        <div class="flex flex-wrap justify-center gap-4 sm:gap-6 hero-stats">
          @for (badge of heroBadges; track badge.label) {
            <div class="glass-card px-5 py-3 flex items-center gap-3 hero-stat-badge"
                 [style.animationDelay]="badge.delay + 's'">
              <span class="text-xl">{{ badge.icon }}</span>
              <div class="text-left">
                <div class="text-sm font-bold" style="color: var(--accent);">{{ badge.value }}</div>
                <div class="text-xs" style="color: var(--text-muted);">{{ badge.label }}</div>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator">
        <div class="w-6 h-10 rounded-full border-2 flex items-start justify-center p-1.5"
             style="border-color: var(--border-strong);">
          <div class="w-1.5 h-3 rounded-full scroll-dot" style="background: var(--accent);"></div>
        </div>
      </div>
    </section>

    <!-- ===== HOW IT WORKS ===== -->
    <section class="py-20 md:py-28 section-animate" style="background: var(--bg-secondary);">
      <div class="container-app">
        <div class="text-center mb-14">
          <span class="text-xs font-bold uppercase tracking-[3px] mb-3 inline-block"
                style="color: var(--accent);">How It Works</span>
          <h2 class="text-3xl md:text-4xl font-bold" style="color: var(--text-primary); font-family: 'Space Grotesk', sans-serif;">
            Three Simple Steps
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          @for (step of howItWorks; track step.number; let i = $index) {
            <div class="glass-card p-8 text-center relative group step-card">
              <!-- Step Number -->
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-extrabold mx-auto mb-6 step-number"
                   style="background: var(--accent-soft); color: var(--accent); border: 1px solid var(--border-strong);">
                {{ step.number }}
              </div>
              <!-- Icon -->
              <div class="text-4xl mb-4">{{ step.icon }}</div>
              <h3 class="text-lg font-bold mb-3" style="color: var(--text-primary);">{{ step.title }}</h3>
              <p class="text-sm leading-relaxed" style="color: var(--text-secondary);">{{ step.description }}</p>

              <!-- Connector Line (between cards) -->
              @if (i < 2) {
                <div class="hidden md:block absolute top-1/4 -right-4 lg:-right-5 w-8 lg:w-10"
                     style="color: var(--text-muted);">
                  <svg class="w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ===== EQUIPMENT CATEGORIES ===== -->
    <section id="categories-section" class="py-20 md:py-28 section-animate" style="background: var(--bg-primary);">
      <div class="container-app">
        <div class="text-center mb-14">
          <span class="text-xs font-bold uppercase tracking-[3px] mb-3 inline-block"
                style="color: var(--accent);">Categories</span>
          <h2 class="text-3xl md:text-4xl font-bold" style="color: var(--text-primary); font-family: 'Space Grotesk', sans-serif;">
            Equipment Categories
          </h2>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5 max-w-4xl mx-auto">
          @for (cat of equipmentCategories; track cat.value) {
            <a [routerLink]="['/equipment']" [queryParams]="{type: cat.value}"
               class="glass-card p-6 text-center cursor-pointer group no-underline category-card">
              <div class="text-4xl sm:text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">{{ cat.icon }}</div>
              <h3 class="text-sm font-bold mb-1" style="color: var(--text-primary);">{{ cat.label }}</h3>
              <span class="text-xs" style="color: var(--text-muted);">{{ cat.count }}+ available</span>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- ===== FEATURED EQUIPMENT ===== -->
    <section class="py-20 md:py-28 section-animate" style="background: var(--bg-secondary);">
      <div class="container-app">
        <div class="text-center mb-14">
          <span class="text-xs font-bold uppercase tracking-[3px] mb-3 inline-block"
                style="color: var(--accent);">Featured</span>
          <h2 class="text-3xl md:text-4xl font-bold" style="color: var(--text-primary); font-family: 'Space Grotesk', sans-serif;">
            Popular Equipment
          </h2>
        </div>

        <!-- Loading Skeletons -->
        @if (loading()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            @for (s of [1,2,3,4]; track s) {
              <div class="glass-card overflow-hidden">
                <div class="skeleton h-[180px] w-full"></div>
                <div class="p-4 space-y-3">
                  <div class="skeleton h-4 w-3/4"></div>
                  <div class="skeleton h-3 w-1/2"></div>
                  <div class="skeleton h-3 w-2/3"></div>
                  <div class="skeleton h-10 w-full rounded-lg mt-2"></div>
                </div>
              </div>
            }
          </div>
        }

        @if (!loading()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            @for (eq of featuredEquipment(); track eq.id) {
              <div class="glass-card overflow-hidden equipment-card group">
                <!-- Image / Gradient Placeholder -->
                <div class="relative h-[180px] overflow-hidden"
                     [style.background]="'linear-gradient(135deg, ' + getCategoryColor(eq.type) + ', ' + getCategoryColorAlt(eq.type) + ')'">
                  <img [src]="getCategoryImage(eq.type)" [alt]="eq.name"
                       class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
                       (error)="onImgError($event)"/>
                  <div class="absolute inset-0"
                       style="background: linear-gradient(to top, rgba(10,15,10,0.9) 0%, transparent 60%);"></div>
                  <!-- Type Badge -->
                  <span class="absolute top-3 left-3 badge badge-success text-[10px]">
                    {{ getTypeIcon(eq.type) }} {{ eq.type }}
                  </span>
                  <!-- Rate -->
                  <div class="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg font-bold text-sm"
                       style="background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); color: var(--accent);">
                    &#8377;{{ eq.hourlyRate }}/hr
                  </div>
                </div>
                <!-- Card Body -->
                <div class="p-4">
                  <h3 class="text-sm font-bold mb-2 leading-snug truncate" style="color: var(--text-primary);">
                    {{ eq.name }}
                  </h3>
                  <div class="flex items-center gap-1.5 mb-4 text-xs" style="color: var(--text-muted);">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    {{ eq.district }}
                  </div>
                  <a [routerLink]="['/equipment', eq.id]"
                     class="block w-full text-center py-2.5 rounded-lg font-semibold text-sm no-underline transition-all duration-300 book-btn"
                     style="background: var(--accent-soft); color: var(--accent); border: 1px solid var(--border-strong);">
                    Book Now
                  </a>
                </div>
              </div>
            }
          </div>

          @if (featuredEquipment().length === 0) {
            <div class="text-center py-16 glass-card">
              <div class="text-6xl mb-4">🚜</div>
              <h3 class="text-lg font-bold mb-2" style="color: var(--text-primary);">No Equipment Available</h3>
              <p class="text-sm" style="color: var(--text-secondary);">Check back soon for new listings.</p>
            </div>
          }

          @if (featuredEquipment().length > 0) {
            <div class="text-center mt-10">
              <a routerLink="/equipment"
                 class="btn-secondary px-8 py-3 text-sm font-semibold rounded-xl no-underline inline-flex items-center gap-2">
                View All Equipment
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </a>
            </div>
          }
        }
      </div>
    </section>

    <!-- ===== STATS SECTION ===== -->
    <section class="py-20 md:py-28 section-animate" style="background: var(--bg-primary);" #statsSection>
      <div class="container-app">
        <div class="text-center mb-14">
          <span class="text-xs font-bold uppercase tracking-[3px] mb-3 inline-block"
                style="color: var(--accent);">Platform Stats</span>
          <h2 class="text-3xl md:text-4xl font-bold" style="color: var(--text-primary); font-family: 'Space Grotesk', sans-serif;">
            Trusted by Farmers Across India
          </h2>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          @for (stat of stats; track stat.key) {
            <div class="stat-card text-center group">
              <div class="text-3xl sm:text-4xl mb-3">{{ stat.icon }}</div>
              <div class="text-3xl sm:text-4xl font-extrabold mb-1 transition-colors"
                   style="color: var(--accent); font-family: 'Space Grotesk', sans-serif;">
                {{ animatedStats()[stat.key] | number }}+
              </div>
              <div class="text-xs sm:text-sm font-medium" style="color: var(--text-secondary);">
                {{ stat.label }}
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ===== CTA SECTION ===== -->
    <section class="py-20 md:py-28 relative overflow-hidden section-animate"
             style="background: var(--bg-secondary);">
      <!-- Background Glow -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="w-[600px] h-[600px] rounded-full blur-[180px] opacity-[0.08]"
             style="background: var(--accent);"></div>
      </div>

      <div class="relative container-app text-center z-10">
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 leading-tight"
            style="color: var(--text-primary); font-family: 'Space Grotesk', sans-serif;">
          Ready to <span style="color: var(--accent);">Modernize</span><br>
          Your Farming?
        </h2>
        <p class="text-base sm:text-lg mb-10 max-w-xl mx-auto" style="color: var(--text-secondary);">
          Join thousands of farmers who are already saving time and money with KrishiRent.
          Start your journey today.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a routerLink="/auth" [queryParams]="{mode: 'register'}"
             class="btn-primary px-10 py-4 text-base font-bold rounded-xl no-underline inline-flex items-center gap-2 cta-glow">
            Get Started Free
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </a>
          <a routerLink="/auth" [queryParams]="{mode: 'login'}"
             class="btn-secondary px-10 py-4 text-base font-semibold rounded-xl no-underline">
            Sign In
          </a>
        </div>
      </div>
    </section>

    <!-- ===== BACK TO TOP ===== -->
    @if (showBackToTop()) {
      <button (click)="scrollToTop()"
              class="fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-2xl flex items-center justify-center text-white text-lg cursor-pointer border-0 z-50 transition-all hover:scale-110 back-to-top"
              style="background: var(--accent); box-shadow: 0 0 30px var(--accent-glow);">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"/>
        </svg>
      </button>
    }
  `,
  styles: [`
    :host { display: block; }

    /* ===== HERO ===== */
    .hero-section {
      background: linear-gradient(180deg, #060d06 0%, var(--bg-primary) 100%);
    }

    .hero-title {
      animation: heroFadeIn 1s ease-out;
    }
    .hero-subtitle {
      animation: heroFadeIn 1s ease-out 0.2s both;
    }
    .hero-badge {
      animation: heroFadeIn 0.8s ease-out 0.1s both;
    }
    .hero-buttons {
      animation: heroFadeIn 1s ease-out 0.4s both;
    }
    .hero-stats {
      animation: heroFadeIn 1s ease-out 0.6s both;
    }

    @keyframes heroFadeIn {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .hero-stat-badge {
      animation: float 4s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    .hero-cta-primary {
      position: relative;
      overflow: hidden;
    }
    .hero-cta-primary::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(
        45deg,
        transparent 30%,
        rgba(255,255,255,0.15) 50%,
        transparent 70%
      );
      animation: shimmerBtn 3s infinite;
    }
    @keyframes shimmerBtn {
      0% { transform: translateX(-100%) rotate(0deg); }
      100% { transform: translateX(100%) rotate(0deg); }
    }

    /* ===== PARTICLES ===== */
    .particle {
      position: absolute;
      border-radius: 50%;
      background: var(--accent);
      opacity: 0;
      animation: particleFloat linear infinite;
      box-shadow: 0 0 6px var(--accent-glow), 0 0 12px var(--accent-glow);
    }

    @keyframes particleFloat {
      0% { opacity: 0; transform: translateY(0) scale(0); }
      10% { opacity: 0.6; transform: translateY(-20px) scale(1); }
      90% { opacity: 0.3; transform: translateY(-200px) scale(0.5); }
      100% { opacity: 0; transform: translateY(-250px) scale(0); }
    }

    /* ===== SCROLL INDICATOR ===== */
    .scroll-indicator {
      animation: heroFadeIn 1s ease-out 1s both;
    }
    .scroll-dot {
      animation: scrollDot 2s ease-in-out infinite;
    }
    @keyframes scrollDot {
      0% { transform: translateY(0); opacity: 1; }
      50% { transform: translateY(10px); opacity: 0.3; }
      100% { transform: translateY(0); opacity: 1; }
    }

    /* ===== STEP CARDS ===== */
    .step-card:hover .step-number {
      background: var(--accent);
      color: #000;
      box-shadow: 0 0 25px var(--accent-glow);
    }

    /* ===== CATEGORY CARDS ===== */
    .category-card {
      position: relative;
      overflow: hidden;
    }
    .category-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 50%, var(--accent-glow), transparent 70%);
      opacity: 0;
      transition: opacity 0.4s ease;
    }
    .category-card:hover::before {
      opacity: 1;
    }

    /* ===== EQUIPMENT CARDS ===== */
    .equipment-card {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .equipment-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 50px rgba(0,0,0,0.3), 0 0 30px var(--accent-glow);
      border-color: var(--border-strong);
    }
    .equipment-card:hover .book-btn {
      background: var(--accent) !important;
      color: #000 !important;
      border-color: var(--accent) !important;
    }

    /* ===== CTA GLOW ===== */
    .cta-glow {
      box-shadow: 0 0 30px var(--accent-glow), 0 0 60px rgba(34,197,94,0.08);
    }
    .cta-glow:hover {
      box-shadow: 0 0 40px var(--accent-glow), 0 0 80px rgba(34,197,94,0.15);
    }

    /* ===== SECTION ANIMATIONS ===== */
    .section-animate {
      opacity: 0;
      transform: translateY(40px);
      transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }
    .section-animate.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* ===== BACK TO TOP ===== */
    .back-to-top {
      animation: heroFadeIn 0.3s ease-out;
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 640px) {
      .hero-section { min-height: 85vh; }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  private api = inject(ApiService);
  private mockData = inject(MockDataService);
  private auth = inject(AuthService);
  private elRef = inject(ElementRef);

  equipment = signal<Equipment[]>([]);
  loading = signal(true);
  showBackToTop = signal(false);
  animatedStats = signal<{ [key: string]: number }>({
    farmers: 0, equipment: 0, bookings: 0, districts: 0
  });

  private statsAnimated = false;
  private scrollListener!: () => void;
  private observers: IntersectionObserver[] = [];

  // Particles for hero background
  particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: 60 + Math.random() * 40,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 8,
    duration: 4 + Math.random() * 6
  }));

  // Hero stat badges
  heroBadges = [
    { icon: '👨‍🌾', value: '500+', label: 'Farmers', delay: 0 },
    { icon: '🚜', value: '200+', label: 'Equipment', delay: 0.5 },
    { icon: '📍', value: '50+', label: 'Districts', delay: 1 }
  ];

  // How It Works
  howItWorks = [
    {
      number: 1,
      icon: '🔍',
      title: 'Browse & Select',
      description: 'Explore our wide range of farm equipment. Filter by category, location, or search by name to find exactly what you need.'
    },
    {
      number: 2,
      icon: '📋',
      title: 'Book & Pay',
      description: 'Choose your time slot, confirm the booking, and pay securely. Transparent hourly pricing with no hidden charges.'
    },
    {
      number: 3,
      icon: '✅',
      title: 'Use & Return',
      description: 'Pick up the equipment, use it on your farm, and return it on time. Simple, reliable, and hassle-free rental experience.'
    }
  ];

  // Equipment categories
  equipmentCategories = [
    { value: 'TRACTOR', label: 'Tractor', icon: '🚜', count: 45 },
    { value: 'HARVESTER', label: 'Harvester', icon: '🌾', count: 28 },
    { value: 'IRRIGATION', label: 'Irrigation', icon: '💧', count: 35 },
    { value: 'PUMP', label: 'Pump', icon: '⛽', count: 40 },
    { value: 'SPRAYER', label: 'Sprayer', icon: '🔫', count: 32 },
    { value: 'SEEDER', label: 'Seeder', icon: '🌱', count: 22 },
    { value: 'PLOUGH', label: 'Plough', icon: '⚙️', count: 18 },
    { value: 'THRESHER', label: 'Thresher', icon: '🏭', count: 15 }
  ];

  // Stats
  stats = [
    { key: 'farmers', icon: '👨‍🌾', value: 500, label: 'Total Farmers' },
    { key: 'equipment', icon: '🚜', value: 200, label: 'Equipment Listed' },
    { key: 'bookings', icon: '📋', value: 1200, label: 'Bookings Completed' },
    { key: 'districts', icon: '📍', value: 50, label: 'Districts Covered' }
  ];

  // Category colors for gradient cards
  private categoryColors: { [key: string]: string } = {
    TRACTOR: '#2E7D32',
    HARVESTER: '#F57F17',
    IRRIGATION: '#0277BD',
    PUMP: '#455A64',
    SPRAYER: '#558B2F',
    SEEDER: '#33691E',
    PLOUGH: '#4E342E',
    THRESHER: '#BF360C'
  };

  private categoryColorsAlt: { [key: string]: string } = {
    TRACTOR: '#1B5E20',
    HARVESTER: '#E65100',
    IRRIGATION: '#01579B',
    PUMP: '#263238',
    SPRAYER: '#33691E',
    SEEDER: '#1B5E20',
    PLOUGH: '#3E2723',
    THRESHER: '#8D2301'
  };

  featuredEquipment = computed(() => this.equipment().slice(0, 8));

  ngOnInit(): void {
    this.loadEquipment();
    this.scrollListener = this.onScroll.bind(this);
    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  ngAfterViewInit(): void {
    this.setupSectionObserver();
    this.setupStatsObserver();
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollListener);
    this.observers.forEach(obs => obs.disconnect());
  }

  private loadEquipment(): void {
    this.loading.set(true);
    this.api.getEquipment().subscribe(data => {
      if (data && data.length > 0) {
        this.equipment.set(data);
      } else {
        // Fallback to mock data
        this.equipment.set(this.mockData.getEquipment());
      }
      this.loading.set(false);
    });
  }

  getCategoryImage(type: string): string {
    return CATEGORY_IMAGES[type] || CATEGORY_IMAGES['DEFAULT'];
  }

  getCategoryColor(type: string): string {
    return this.categoryColors[type] || '#2E7D32';
  }

  getCategoryColorAlt(type: string): string {
    return this.categoryColorsAlt[type] || '#1B5E20';
  }

  getTypeIcon(type: string): string {
    const found = EQUIPMENT_TYPES.find(t => t.value === type);
    return found ? found.icon : '🔧';
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  scrollToSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private onScroll(): void {
    this.showBackToTop.set(window.scrollY > 400);
  }

  private setupSectionObserver(): void {
    const sections = this.elRef.nativeElement.querySelectorAll('.section-animate');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    sections.forEach((section: Element) => observer.observe(section));
    this.observers.push(observer);
  }

  private setupStatsObserver(): void {
    const statsEl = this.elRef.nativeElement.querySelector('[#statsSection]') ||
                    this.elRef.nativeElement.querySelectorAll('.stat-card')[0]?.closest('section');
    if (!statsEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.statsAnimated) {
            this.statsAnimated = true;
            this.animateCounters();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(statsEl);
    this.observers.push(observer);
  }

  private animateCounters(): void {
    const duration = 2000;
    const steps = 80;
    const interval = duration / steps;
    let currentStep = 0;

    const targets: { [key: string]: number } = {};
    this.stats.forEach(s => targets[s.key] = s.value);

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      const current: { [key: string]: number } = {};
      for (const key in targets) {
        current[key] = Math.floor(targets[key] * eased);
      }
      this.animatedStats.set(current);

      if (currentStep >= steps) {
        clearInterval(timer);
        this.animatedStats.set({ ...targets });
      }
    }, interval);
  }
}
