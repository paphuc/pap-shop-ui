import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <h1>Chào mừng đến với Pap Shop</h1>
      <div class="products-grid">
        <div *ngFor="let product of products" class="product-card">
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <p class="price">{{ product.price | currency:'VND' }}</p>
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
        // Hiển thị dữ liệu mẫu nếu không kết nối được backend
        this.products = [
          { id: 1, name: 'Sản phẩm mẫu 1', description: 'Mô tả sản phẩm 1', price: 100000, categoryId: 1 },
          { id: 2, name: 'Sản phẩm mẫu 2', description: 'Mô tả sản phẩm 2', price: 200000, categoryId: 1 }
        ];
      }
    });
  }
}