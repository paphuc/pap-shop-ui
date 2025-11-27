import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
          <h1 class="text-2xl font-light text-black mb-2">
            Kết quả tìm kiếm: "{{ searchQuery }}"
          </h1>
          <p class="text-gray-600">{{ products.length }} sản phẩm được tìm thấy</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" *ngIf="products.length > 0">
          <div 
            *ngFor="let product of products" 
            class="group bg-white hover:luxury-shadow transition-all duration-300 cursor-pointer"
            (click)="viewProduct(product.id!)">
            
            <div class="aspect-square bg-gray-50 overflow-hidden relative mb-4 group-hover:ring-2 group-hover:ring-accent transition-all duration-300">
              <img 
                [src]="getImageUrl(product)" 
                [alt]="product.name" 
                (error)="onImageError($event)"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <button 
                  class="luxury-btn-accent px-4 py-2 text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                  (click)="addToCart(product, $event)">
                  Thêm vào giỏ
                </button>
              </div>
            </div>
            
            <div>
              <h3 class="text-base font-medium text-black mb-2 line-clamp-2">
                {{ product.name }}
              </h3>
              <p class="text-sm text-gray-900">{{ formatPrice(product.price) }}</p>
            </div>
          </div>
        </div>
        
        <div *ngIf="products.length === 0 && !loading" class="text-center py-20">
          <div class="mx-auto w-16 h-16 bg-gray-100 flex items-center justify-center mb-6">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-light text-black mb-2">Không tìm thấy sản phẩm</h3>
          <p class="text-gray-600">Thử tìm kiếm với từ khóa khác</p>
        </div>

        <div *ngIf="loading" class="text-center py-20">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p class="mt-4 text-gray-600">Đang tìm kiếm...</p>
        </div>
      </div>
    </div>
  `
})
export class SearchResultsComponent implements OnInit {
  products: Product[] = [];
  searchQuery: string = '';
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      if (this.searchQuery) {
        this.searchProducts();
      }
    });
  }

  searchProducts() {
    this.loading = true;
    this.apiService.searchProducts(this.searchQuery).subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching products:', error);
        this.products = [];
        this.loading = false;
      }
    });
  }

  viewProduct(productId: number) {
    this.router.navigate(['/product', productId]);
  }

  getImageUrl(product: Product): string {
    if (product.images && product.images.length > 0 && product.images[0].imageUrl) {
      return product.images[0].imageUrl;
    }
    if (product.image) {
      return product.image.startsWith('http') ? product.image : `/assets/${product.image}`;
    }
    return '/assets/no-image.svg';
  }

  onImageError(event: any) {
    event.target.src = '/assets/no-image.svg';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  addToCart(product: Product, event: Event) {
    event.stopPropagation();
    if (product.id) {
      this.cartService.addToCart(product.id, 1).subscribe({
        next: () => alert('Đã thêm vào giỏ hàng!'),
        error: () => alert('Lỗi khi thêm vào giỏ hàng!')
      });
    }
  }
}