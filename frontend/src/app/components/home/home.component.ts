import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-white">
      <!-- Hero Section -->
      <div class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div class="text-center">
            <h1 class="text-6xl font-light text-black tracking-tight mb-6">
              Pap Shop
            </h1>
            <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Miễn phí vận chuyển - Đăng ký ngay
            </p>
            <button class="luxury-btn-accent px-8 py-3 text-sm font-medium">
              Khám phá bộ sưu tập
            </button>
          </div>
        </div>
      </div>

      <!-- Products Section -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-light text-black mb-4">Sản phẩm nổi bật</h2>
          <div class="w-16 h-px bg-black mx-auto"></div>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div 
            *ngFor="let product of products" 
            class="group bg-white hover:luxury-shadow transition-all duration-300 cursor-pointer"
            (click)="viewProduct(product.id!)">
            
            <!-- Product Image -->
            <div class="aspect-square bg-gray-50 overflow-hidden relative mb-4 group-hover:ring-2 group-hover:ring-accent transition-all duration-300">
              <img 
                [src]="getImageUrl(product)" 
                [alt]="product.name" 
                (error)="onImageError($event)"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              
              <!-- Quick Add Button Overlay -->
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <button 
                  class="luxury-btn-accent px-4 py-2 text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                  (click)="addToCart(product, $event)">
                  Thêm vào giỏ
                </button>
              </div>
            </div>
            
            <!-- Product Info -->
            <div class="">
              <h3 class="text-base font-medium text-black mb-2 line-clamp-2">
                {{ product.name }}
              </h3>
              <p class="text-sm text-gray-900">{{ formatPrice(product.price) }}</p>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div *ngIf="products.length === 0" class="text-center py-20">
          <div class="mx-auto w-16 h-16 bg-gray-100 flex items-center justify-center mb-6">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
          </div>
          <h3 class="text-xl font-light text-black mb-2">Chưa có sản phẩm</h3>
          <p class="text-gray-600">Các sản phẩm sẽ được cập nhật sớm</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit {
  products: Product[] = [];

  constructor(
    private apiService: ApiService, 
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.apiService.getProducts().subscribe({
      next: (data) => {
        console.log('Products loaded:', data);
        this.products = data;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.products = [];
      }
    });
  }

  getImageUrl(product: Product): string {
    // Kiểm tra images array trước
    if (product.images && product.images.length > 0 && product.images[0].imageUrl) {
      const imageUrl = product.images[0].imageUrl;
      console.log('Full image URL:', imageUrl);
      return imageUrl;
    }
    
    // Kiểm tra image field
    if (product.image) {
      const imageUrl = product.image;
      console.log('Image field URL:', imageUrl);
      return imageUrl.startsWith('http') ? imageUrl : `/assets/${imageUrl}`;
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

  viewProduct(productId: number) {
    this.router.navigate(['/product', productId]);
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