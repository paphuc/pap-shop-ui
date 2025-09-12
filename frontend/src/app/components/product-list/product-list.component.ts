import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Product, Category } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2>Quản lý sản phẩm</h2>
      
      <div class="form-group">
        <h3>Thêm sản phẩm mới</h3>
        <input [(ngModel)]="newProduct.name" placeholder="Tên sản phẩm" class="form-control">
        <input [(ngModel)]="newProduct.price" type="number" placeholder="Giá" class="form-control">
        <input [(ngModel)]="newProduct.description" placeholder="Mô tả" class="form-control">
        <select [(ngModel)]="newProduct.categoryId" class="form-control">
          <option value="">Chọn danh mục</option>
          <option *ngFor="let category of categories" [value]="category.id">{{category.name}}</option>
        </select>
        <button (click)="addProduct()" class="btn btn-primary">Thêm sản phẩm</button>
      </div>

      <div class="product-list">
        <h3>Danh sách sản phẩm</h3>
        <div *ngFor="let product of products" class="card">
          <h4>{{product.name}}</h4>
          <p>Giá: {{product.price | currency:'VND'}}</p>
          <p>Mô tả: {{product.description}}</p>
          <button (click)="deleteProduct(product.id!)" class="btn btn-danger">Xóa</button>
        </div>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  newProduct: Partial<Product> = { name: '', price: 0, categoryId: 0 };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.apiService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  loadCategories() {
    this.apiService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  addProduct() {
    if (this.newProduct.name && this.newProduct.price && this.newProduct.categoryId) {
      this.apiService.addProduct(this.newProduct as Product).subscribe(() => {
        this.loadProducts();
        this.newProduct = { name: '', price: 0, categoryId: 0 };
      });
    }
  }

  deleteProduct(id: number) {
    this.apiService.deleteProduct(id).subscribe(() => {
      this.loadProducts();
    });
  }
}