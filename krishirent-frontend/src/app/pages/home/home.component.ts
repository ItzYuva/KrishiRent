import { Component, OnInit, OnDestroy, signal, computed, inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Equipment, CATEGORY_IMAGES, CATEGORY_COLORS } from '../../models/equipment.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <!-- ==================== HERO SECTION ==================== -->
    <section class="relative overflow-hidden" style="background: var(--bg-hero, linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #43a047 100%)); min-height: 520px;">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
      </div>
      <div class="relative max-w-6xl mx-auto px-4 py-20 md:py-28 text-center">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight hero-title">
          Rent the Right Tool,<br/>Grow the Right Crop
        </h1>
        <p class="text-lg md:text-xl text-green-100 mb-10 max-w-2xl mx-auto">
          Affordable farm equipment for every Indian farmer — book by the hour
        </p>

        <!-- Search Bar -->
        <div class="max-w-xl mx-auto flex items-center bg-white rounded-full shadow-2xl overflow-hidden pl-5 pr-2 py-2">
          <svg class="w-5 h-5 text-gray-400 flex-shrink-0 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="onSearchChange($event)"
            placeholder="Search equipment by name or district..."
            class="flex-1 text-gray-700 placeholder-gray-400 outline-none text-base bg-transparent"
          />
          <button
            (click)="scrollToEquipment()"
            class="px-6 py-2.5 rounded-full font-semibold text-white text-sm transition-all duration-200 hover:shadow-lg"
            style="background-color: #f59e0b;"
            onmouseover="this.style.backgroundColor='#d97706'"
            onmouseout="this.style.backgroundColor='#f59e0b'">
            Browse Equipment
          </button>
        </div>
      </div>
    </section>

    <!-- ==================== STATS ROW ==================== -->
    <section class="py-12 px-4" style="background: var(--bg-card, #fff);" #statsSection>
      <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div *ngFor="let stat of stats" class="text-center p-6 rounded-2xl transition-all duration-300 hover:shadow-lg" style="border: 1px solid var(--border, #e5e7eb);">
          <div class="text-4xl mb-2">{{ stat.icon }}</div>
          <div class="text-3xl md:text-4xl font-extrabold mb-1" style="color: var(--accent, #2e7d32);">
            {{ animatedStats()[stat.key] | number }}+
          </div>
          <div class="text-sm font-medium" style="color: var(--text-secondary, #6b7280);">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- ==================== CATEGORY FILTER CHIPS ==================== -->
    <section id="equipment-section" class="pt-10 pb-4 px-4" style="background: var(--bg-card, #fff);">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-2xl md:text-3xl font-bold mb-6 text-center" style="color: var(--text-primary, #111827);">
          Available Equipment
        </h2>
        <div class="flex gap-3 overflow-x-auto pb-3 scrollbar-hide justify-center flex-wrap">
          <button
            *ngFor="let cat of categories"
            (click)="selectCategory(cat)"
            class="px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0"
            [style.background-color]="selectedCategory() === cat ? 'var(--accent, #2e7d32)' : 'transparent'"
            [style.color]="selectedCategory() === cat ? '#fff' : 'var(--text-secondary, #6b7280)'"
            [style.border]="selectedCategory() === cat ? '2px solid var(--accent, #2e7d32)' : '2px solid var(--border, #d1d5db)'"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </section>

    <!-- ==================== EQUIPMENT GRID ==================== -->
    <section class="py-8 px-4" style="background: var(--bg-card, #fff);">
      <div class="max-w-6xl mx-auto">

        <!-- Skeleton Loading Cards -->
        <div *ngIf="loading()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let s of [1,2,3]" class="rounded-2xl overflow-hidden shadow-md" style="border: 1px solid var(--border, #e5e7eb);">
            <div class="skeleton h-48 w-full"></div>
            <div class="p-5 space-y-3">
              <div class="skeleton h-5 w-3/4 rounded"></div>
              <div class="skeleton h-4 w-1/2 rounded"></div>
              <div class="skeleton h-4 w-2/3 rounded"></div>
              <div class="skeleton h-10 w-full rounded-lg mt-3"></div>
            </div>
          </div>
        </div>

        <!-- Equipment Cards -->
        <div *ngIf="!loading()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            *ngFor="let eq of filteredEquipment()"
            class="rounded-2xl overflow-hidden shadow-md transition-all duration-300 equipment-card"
            [style.border-left]="'4px solid ' + getCategoryColor(eq.type)"
            style="border-top: 1px solid var(--border, #e5e7eb); border-right: 1px solid var(--border, #e5e7eb); border-bottom: 1px solid var(--border, #e5e7eb); background: var(--bg-card, #fff);"
          >
            <div class="relative overflow-hidden">
              <img
                [src]="getCategoryImage(eq.type)"
                [alt]="eq.name"
                class="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
              />
              <span
                class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white"
                [style.background-color]="getCategoryColor(eq.type)"
              >
                {{ eq.type }}
              </span>
            </div>
            <div class="p-5">
              <h3 class="text-lg font-bold mb-1" style="color: var(--text-primary, #111827);">{{ eq.name }}</h3>
              <div class="flex items-center gap-1 mb-2">
                <span class="text-amber-400 text-sm">{{ getStarRating(eq.id) }}</span>
              </div>
              <div class="flex items-center justify-between mb-3">
                <span class="text-xl font-extrabold" style="color: var(--accent, #2e7d32);">
                  &#8377;{{ eq.hourlyRate }}/hr
                </span>
                <span class="text-sm flex items-center gap-1" style="color: var(--text-secondary, #6b7280);">
                  <span>&#128205;</span> {{ eq.district }}
                </span>
              </div>
              <a
                [routerLink]="['/equipment', eq.id]"
                class="block w-full text-center py-2.5 rounded-lg font-semibold text-white text-sm transition-all duration-200"
                style="background-color: var(--accent, #2e7d32);"
                onmouseover="this.style.opacity='0.9'"
                onmouseout="this.style.opacity='1'"
              >
                View Details
              </a>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading() && filteredEquipment().length === 0" class="text-center py-16">
          <div class="text-6xl mb-4">🚜</div>
          <h3 class="text-xl font-bold mb-2" style="color: var(--text-primary, #111827);">No Equipment Found</h3>
          <p style="color: var(--text-secondary, #6b7280);">Try adjusting your search or filter criteria.</p>
        </div>
      </div>
    </section>

    <!-- ==================== HOW IT WORKS ==================== -->
    <section class="py-16 px-4" style="background: var(--bg-hero, linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #43a047 100%));">
      <div class="max-w-5xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-12">How It Works</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div *ngFor="let step of howItWorks" class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 transition-all duration-300 hover:bg-white/20">
            <div class="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" style="background-color: #f59e0b; color: #fff;">
              {{ step.number }}
            </div>
            <h3 class="text-xl font-bold text-white mb-3">{{ step.title }}</h3>
            <p class="text-green-100 text-sm leading-relaxed">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== BACK TO TOP BUTTON ==================== -->
    <button
      *ngIf="showBackToTop()"
      (click)="scrollToTop()"
      class="fixed bottom-8 right-8 w-12 h-12 rounded-full shadow-2xl flex items-center justify-center text-white text-xl transition-all duration-300 hover:scale-110 z-50"
      style="background-color: var(--accent, #2e7d32);"
      aria-label="Back to top"
    >
      &#8593;
    </button>
  `,
  styles: [`
    :host {
      display: block;
    }

    .hero-title {
      animation: fadeInUp 0.8s ease-out;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .equipment-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
    }

    .skeleton {
      background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
    }

    @keyframes shimmer {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  private api = inject(ApiService);

  @ViewChild('statsSection', { static: false }) statsSectionRef!: ElementRef;

  // State signals
  equipment = signal<Equipment[]>([]);
  loading = signal(true);
  selectedCategory = signal('All');
  searchQuery = signal('');
  showBackToTop = signal(false);

  // Animated stats
  animatedStats = signal<{ [key: string]: number }>({
    equipment: 0,
    districts: 0,
    farmers: 0
  });

  private statsAnimated = false;
  private scrollListener!: () => void;
  private observer: IntersectionObserver | null = null;

  // Static data
  categories = ['All', 'TRACTOR', 'HARVESTER', 'PUMP', 'SPRAYER', 'SEEDER', 'PLOUGH'];

  stats = [
    { key: 'equipment', icon: '🚜', value: 500, label: 'Equipment Listed' },
    { key: 'districts', icon: '📍', value: 50, label: 'Districts Covered' },
    { key: 'farmers', icon: '👨‍🌾', value: 10000, label: 'Happy Farmers' }
  ];

  howItWorks = [
    { number: 1, title: 'Browse & Search', description: 'Find the perfect farm equipment near you. Filter by category, district, or search by name.' },
    { number: 2, title: 'Book & Pay', description: 'Select your time slot and pay securely. Transparent hourly pricing with no hidden fees.' },
    { number: 3, title: 'Use & Return', description: 'Pick up the equipment, use it on your farm, and return it when done. Simple and hassle-free.' }
  ];

  // Computed filtered equipment
  filteredEquipment = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    let list = this.equipment();
    if (query) {
      list = list.filter(eq =>
        eq.name.toLowerCase().includes(query) ||
        eq.district.toLowerCase().includes(query)
      );
    }
    return list;
  });

  ngOnInit(): void {
    this.loadEquipment();
    this.scrollListener = this.onScroll.bind(this);
    window.addEventListener('scroll', this.scrollListener);
  }

  ngAfterViewInit(): void {
    this.setupStatsObserver();
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollListener);
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private loadEquipment(): void {
    this.loading.set(true);
    this.api.getEquipment().subscribe(data => {
      this.equipment.set(data);
      this.loading.set(false);
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
    this.loading.set(true);

    if (category === 'All') {
      this.api.getEquipment().subscribe(data => {
        this.equipment.set(data);
        this.loading.set(false);
      });
    } else {
      this.api.getEquipmentByType(category).subscribe(data => {
        this.equipment.set(data);
        this.loading.set(false);
      });
    }
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  getCategoryImage(type: string): string {
    return CATEGORY_IMAGES[type] || CATEGORY_IMAGES['DEFAULT'];
  }

  getCategoryColor(type: string): string {
    return CATEGORY_COLORS[type] || '#6b7280';
  }

  getStarRating(id: number): string {
    const seed = ((id * 7 + 3) % 2);
    return seed === 0 ? '\u2605\u2605\u2605\u2605\u2606' : '\u2605\u2605\u2605\u2605\u2605';
  }

  scrollToEquipment(): void {
    const el = document.getElementById('equipment-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private onScroll(): void {
    this.showBackToTop.set(window.scrollY > 400);
  }

  private setupStatsObserver(): void {
    if (!this.statsSectionRef) return;

    this.observer = new IntersectionObserver(
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

    this.observer.observe(this.statsSectionRef.nativeElement);
  }

  private animateCounters(): void {
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const eased = 1 - Math.pow(1 - progress, 3);

      this.animatedStats.set({
        equipment: Math.floor(500 * eased),
        districts: Math.floor(50 * eased),
        farmers: Math.floor(10000 * eased)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        this.animatedStats.set({
          equipment: 500,
          districts: 50,
          farmers: 10000
        });
      }
    }, interval);
  }
}
