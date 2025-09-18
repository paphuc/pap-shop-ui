import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <h1>Pap Shop bao ship 0Đ - Đăng ký ngay!</h1>
      <div class="products-grid">
        <div *ngFor="let product of products" class="product-card" (click)="viewProduct(product.id!)">
          <div class="product-image">
            <img [src]="product.image || '/assets/no-image.svg'" [alt]="product.name" />
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-price">{{ product.price | currency:'VND':'symbol':'1.0-0' }}</p>
            <button class="add-to-cart-btn" (click)="addToCart(product, $event)">Thêm vào giỏ</button>
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
      margin: 0 0 10px 0;
      font-size: 18px;
      font-weight: bold;
      color: #e74c3c;
    }
    .add-to-cart-btn {
      width: 100%;
      padding: 8px 16px;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.3s;
    }
    .add-to-cart-btn:hover {
      background: #2980b9;
    }
  `]
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