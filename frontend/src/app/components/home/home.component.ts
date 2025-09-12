import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <h1>Pap Shop bao ship 0Đ - Đăng ký ngay!</h1>
      <div class="products-grid">
        <div *ngFor="let product of products" class="product-card" (click)="viewProduct(product.id!)">
          <div class="product-image">
            <img [src]="getImageUrl(product)" [alt]="product.name" (error)="onImageError($event)" />
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-price">{{ formatPrice(product.price) }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 30px;
    }
    .product-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      overflow: hidden;
      transition: transform 0.3s, box-shadow 0.3s;
      cursor: pointer;
    }
    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
    }
    .product-image {
      width: 100%;
      height: 200px;
      overflow: hidden;
      background: #f8f9fa;
    }
    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .product-info {
      padding: 15px;
    }
    .product-name {
      margin: 0 0 10px 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
      line-height: 1.4;
    }
    .product-price {
      margin: 0;
      font-size: 18px;
      font-weight: bold;
      color: #e74c3c;
    }
  `]
})
export class HomeComponent implements OnInit {
  products: Product[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

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
    if (product.images && product.images.length > 0 && product.images[0].imageUrl) {
      return product.images[0].imageUrl;
    }
    return product.image || '/assets/no-image.svg';
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
}