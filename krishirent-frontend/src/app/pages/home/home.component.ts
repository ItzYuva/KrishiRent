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
    <!-- ===== HERO ===== -->
    <section class="relative overflow-hidden" style="background: var(--bg-hero);">
      <div class="absolute inset-0 opacity-[0.06]" style="background-image: radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px); background-size: 32px 32px;"></div>
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl animate-pulse" style="animation-delay:1s;"></div>
      </div>
      <div class="relative container-app py-16 md:py-24 flex flex-col items-center text-center">
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight hero-title">
          Rent the Right Tool,<br>Grow the Right Crop
        </h1>
        <p class="text-base sm:text-lg text-green-100/90 mb-8 max-w-lg">
          Affordable farm equipment for every Indian farmer — book by the hour
        </p>
        <div class="w-full max-w-[560px] flex items-center bg-white rounded-full shadow-2xl overflow-hidden pl-4 pr-1.5 py-1.5">
          <svg class="w-5 h-5 text-gray-400 shrink-0 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input type="text" [ngModel]="searchQuery()" (ngModelChange)="onSearchChange($event)"
                 placeholder="Search by name or district..."
                 class="flex-1 text-gray-700 placeholder-gray-400 outline-none text-sm bg-transparent min-w-0"/>
          <button (click)="scrollToEquipment()"
                  class="px-5 py-2.5 rounded-full font-semibold text-white text-sm cursor-pointer border-0 whitespace-nowrap transition-all hover:opacity-90"
                  style="background: var(--accent);">
            Browse Equipment
          </button>
        </div>
      </div>
    </section>

    <!-- ===== STATS ===== -->
    <section class="py-12 md:py-16" style="background: var(--bg-primary);" #statsSection>
      <div class="container-app">
        <div class="grid grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          @for (stat of stats; track stat.key) {
            <div class="text-center p-4 sm:p-6 rounded-2xl transition-all duration-300 hover:shadow-lg"
                 style="background: var(--bg-card); border: 1px solid var(--border);">
              <div class="text-3xl sm:text-4xl mb-2">{{ stat.icon }}</div>
              <div class="text-xl sm:text-2xl md:text-3xl font-extrabold mb-1" style="color: var(--accent);">
                {{ animatedStats()[stat.key] | number }}+
              </div>
              <div class="text-xs sm:text-sm font-medium" style="color: var(--text-secondary);">{{ stat.label }}</div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ===== EQUIPMENT SECTION ===== -->
    <section id="equipment-section" class="py-12 md:py-16" style="background: var(--bg-primary);">
      <div class="container-app">
        <h2 class="text-2xl md:text-3xl font-bold mb-6 text-center" style="color: var(--text-primary);">
          Available Equipment
        </h2>

        <!-- Category Chips -->
        <div class="flex gap-2 sm:gap-3 overflow-x-auto pb-4 justify-center flex-wrap mb-8 scrollbar-hide">
          @for (cat of categories; track cat.key) {
            <button (click)="selectCategory(cat.key)"
                    class="px-4 sm:px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer"
                    [style.background]="selectedCategory() === cat.key ? 'var(--accent)' : 'var(--bg-card)'"
                    [style.color]="selectedCategory() === cat.key ? '#fff' : 'var(--text-secondary)'"
                    [style.border]="'2px solid ' + (selectedCategory() === cat.key ? 'var(--accent)' : 'var(--border)')">
              {{ cat.icon }} {{ cat.label }}
            </button>
          }
        </div>

        <!-- Skeleton Loading -->
        @if (loading()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (s of [1,2,3]; track s) {
              <div class="rounded-2xl overflow-hidden" style="background: var(--bg-card); border: 1px solid var(--border);">
                <div class="skeleton h-[220px] w-full"></div>
                <div class="p-5 space-y-3">
                  <div class="skeleton h-5 w-3/4"></div>
                  <div class="skeleton h-4 w-1/2"></div>
                  <div class="skeleton h-4 w-2/3"></div>
                  <div class="skeleton h-10 w-full rounded-lg mt-2"></div>
                </div>
              </div>
            }
          </div>
        }

        <!-- Equipment Cards -->
        @if (!loading()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (eq of filteredEquipment(); track eq.id) {
              <div class="rounded-2xl overflow-hidden transition-all duration-300 equipment-card"
                   [style.borderLeft]="'4px solid ' + getCategoryColor(eq.type)"
                   style="background: var(--bg-card); border-top: 1px solid var(--border); border-right: 1px solid var(--border); border-bottom: 1px solid var(--border);">
                <!-- Image -->
                <div class="relative overflow-hidden h-[220px]"
                     [style.background]="'linear-gradient(135deg, ' + getCategoryColor(eq.type) + 'CC, ' + getCategoryColor(eq.type) + '66)'">
                  <img [src]="getCategoryImage(eq.type)" [alt]="eq.name"
                       class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                       (error)="onImgError($event)"/>
                  <div class="absolute inset-0" style="background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%);"></div>
                  <span class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md"
                        [style.background]="getCategoryColor(eq.type)">
                    {{ eq.type }}
                  </span>
                  <span class="absolute bottom-3 right-3 px-3 py-1 rounded-lg text-white font-bold text-base"
                        style="background: rgba(0,0,0,0.55); backdrop-filter: blur(4px);">
                    ₹{{ eq.hourlyRate }}/hr
                  </span>
                </div>
                <!-- Body -->
                <div class="p-5">
                  <h3 class="text-base font-bold mb-2 leading-snug" style="color: var(--text-primary);">{{ eq.name }}</h3>
                  <div class="flex items-center justify-between mb-4">
                    <span class="text-amber-400 text-sm tracking-wide">{{ getStarRating(eq.id) }}</span>
                    <span class="text-xs flex items-center gap-1" style="color: var(--text-secondary);">
                      📍 {{ eq.district }}
                    </span>
                  </div>
                  <a [routerLink]="['/equipment', eq.id]"
                     class="block w-full text-center py-2.5 rounded-xl font-semibold text-white text-sm no-underline transition-all hover:opacity-90"
                     style="background: linear-gradient(135deg, #2E7D32, #1B5E20);">
                    View Details →
                  </a>
                </div>
              </div>
            }
          </div>

          @if (filteredEquipment().length === 0) {
            <div class="text-center py-16 rounded-2xl mt-4" style="background: var(--bg-card); border: 1px solid var(--border);">
              <div class="text-6xl mb-4">🚜</div>
              <h3 class="text-lg font-bold mb-2" style="color: var(--text-primary);">No Equipment Found</h3>
              <p class="text-sm" style="color: var(--text-secondary);">Try adjusting your search or filter criteria.</p>
            </div>
          }
        }
      </div>
    </section>

    <!-- ===== HOW IT WORKS ===== -->
    <section class="py-16 md:py-20" style="background: var(--bg-hero);">
      <div class="container-app text-center">
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-10">How It Works</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          @for (step of howItWorks; track step.number; let i = $index) {
            <div class="relative rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 hover:bg-white/20 flex flex-col items-center"
                 style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); backdrop-filter: blur(8px);">
              <div class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-4 text-white"
                   style="background: var(--accent);">
                {{ step.number }}
              </div>
              <h3 class="text-lg font-bold text-white mb-2">{{ step.title }}</h3>
              <p class="text-green-100/80 text-sm leading-relaxed">{{ step.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ===== BACK TO TOP ===== -->
    @if (showBackToTop()) {
      <button (click)="scrollToTop()"
              class="fixed bottom-6 right-6 w-11 h-11 rounded-full shadow-xl flex items-center justify-center text-white text-lg cursor-pointer border-0 z-50 transition-all hover:scale-110"
              style="background: var(--accent);">
        ↑
      </button>
    }
  `,
  styles: [`
    :host { display: block; }
    .hero-title { animation: fadeInUp 0.8s ease-out; }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .equipment-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 32px rgba(0,0,0,0.15);
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  private api = inject(ApiService);
  @ViewChild('statsSection', { static: false }) statsSectionRef!: ElementRef;

  equipment = signal<Equipment[]>([]);
  loading = signal(true);
  selectedCategory = signal('All');
  searchQuery = signal('');
  showBackToTop = signal(false);
  animatedStats = signal<{ [key: string]: number }>({ equipment: 0, districts: 0, farmers: 0 });

  private statsAnimated = false;
  private scrollListener!: () => void;
  private observer: IntersectionObserver | null = null;

  categories = [
    { key: 'All', label: 'All', icon: '📋' },
    { key: 'TRACTOR', label: 'Tractor', icon: '🚜' },
    { key: 'HARVESTER', label: 'Harvester', icon: '🌾' },
    { key: 'PUMP', label: 'Pump', icon: '💧' },
    { key: 'SPRAYER', label: 'Sprayer', icon: '🌿' },
    { key: 'SEEDER', label: 'Seeder', icon: '🌱' },
    { key: 'PLOUGH', label: 'Plough', icon: '⚙️' }
  ];

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

  filteredEquipment = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    let list = this.equipment();
    if (query) {
      list = list.filter(eq => eq.name.toLowerCase().includes(query) || eq.district.toLowerCase().includes(query));
    }
    return list;
  });

  ngOnInit(): void {
    this.loadEquipment();
    this.scrollListener = this.onScroll.bind(this);
    window.addEventListener('scroll', this.scrollListener);
  }
  ngAfterViewInit(): void { this.setupStatsObserver(); }
  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollListener);
    if (this.observer) this.observer.disconnect();
  }

  private loadEquipment(): void {
    this.loading.set(true);
    this.api.getEquipment().subscribe(data => { this.equipment.set(data); this.loading.set(false); });
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
    this.loading.set(true);
    if (category === 'All') {
      this.api.getEquipment().subscribe(data => { this.equipment.set(data); this.loading.set(false); });
    } else {
      this.api.getEquipmentByType(category).subscribe(data => { this.equipment.set(data); this.loading.set(false); });
    }
  }

  onSearchChange(value: string): void { this.searchQuery.set(value); }
  getCategoryImage(type: string): string { return CATEGORY_IMAGES[type] || CATEGORY_IMAGES['DEFAULT']; }
  getCategoryColor(type: string): string { return CATEGORY_COLORS[type] || '#6b7280'; }
  getStarRating(id: number): string { return ((id * 7 + 3) % 2) === 0 ? '★★★★☆' : '★★★★★'; }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  scrollToEquipment(): void { document.getElementById('equipment-section')?.scrollIntoView({ behavior: 'smooth' }); }
  scrollToTop(): void { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  private onScroll(): void { this.showBackToTop.set(window.scrollY > 400); }

  private setupStatsObserver(): void {
    if (!this.statsSectionRef) return;
    this.observer = new IntersectionObserver(
      (entries) => { entries.forEach(entry => { if (entry.isIntersecting && !this.statsAnimated) { this.statsAnimated = true; this.animateCounters(); } }); },
      { threshold: 0.3 }
    );
    this.observer.observe(this.statsSectionRef.nativeElement);
  }

  private animateCounters(): void {
    const duration = 1500; const steps = 60; const interval = duration / steps;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const eased = 1 - Math.pow(1 - currentStep / steps, 3);
      this.animatedStats.set({ equipment: Math.floor(500 * eased), districts: Math.floor(50 * eased), farmers: Math.floor(10000 * eased) });
      if (currentStep >= steps) { clearInterval(timer); this.animatedStats.set({ equipment: 500, districts: 50, farmers: 10000 }); }
    }, interval);
  }
}
