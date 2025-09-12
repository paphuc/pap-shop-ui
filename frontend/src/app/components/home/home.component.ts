import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <h1>Chào mừng đến với Pap Shop</h1>
      <div class="products-grid">
        <div *ngFor="let product of products" class="product-card" [routerLink]="['/products', product.id]">
          <img [src]="getImageUrl(product)" [alt]="product.name" (error)="onImageError($event)">
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <p class="price">{{ formatPrice(product.price) }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 20px;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .product-card {
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.3s ease;
      text-decoration: none;
      color: inherit;
    }
    .product-card:hover {
      transform: translateY(-5px);
    }
    .product-card img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 4px;
      margin-bottom: 10px;
    }
    .price {
      font-weight: bold;
      color: #e74c3c;
    }
  `]
})
export class HomeComponent implements OnInit {
  products: Product[] = [];

  constructor(private apiService: ApiService) {}

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
    return product.images && product.images.length > 0 && product.images[0].imageUrl 
      ? product.images[0].imageUrl 
      : '/assets/images/no-image.svg';
  }

  onImageError(event: any) {
    event.target.src = '/assets/images/no-image.svg';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }
}