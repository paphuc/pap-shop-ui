import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Category } from '../../models/product.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2>Quản lý danh mục</h2>
      
      <div class="form-group">
        <h3>Thêm danh mục mới</h3>
        <input [(ngModel)]="newCategory.name" placeholder="Tên danh mục" class="form-control">
        <input [(ngModel)]="newCategory.description" placeholder="Mô tả" class="form-control">
        <button (click)="addCategory()" class="btn btn-primary">Thêm danh mục</button>
      </div>

      <div class="category-list">
        <h3>Danh sách danh mục</h3>
        <div *ngFor="let category of categories" class="card">
          <h4>{{category.name}}</h4>
          <p>{{category.description}}</p>
        </div>
      </div>
    </div>
  `
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  newCategory: Category = { name: '', description: '' };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.apiService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  addCategory() {
    if (this.newCategory.name) {
      this.apiService.addCategory(this.newCategory).subscribe(() => {
        this.loadCategories();
        this.newCategory = { name: '', description: '' };
      });
    }
  }
}