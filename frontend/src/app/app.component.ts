import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import { Product } from './models/product.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, FormsModule],
  template: `
    <nav class="navbar">
      <div class="nav-left">
        <a routerLink="/" class="logo">Pap Shop</a>
      </div>
      <div class="nav-center">
        <div class="search-container">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (keyup.enter)="onSearch()"
            (input)="onSearchInput()"
            (focus)="onSearchFocus()"
            (blur)="onSearchBlur()"
            placeholder="Tìm kiếm sản phẩm..."
            class="search-input"
          />
          <button (click)="onSearch()" class="search-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
        </div>
        <!-- Suggestions Dropdown -->
        <div class="suggestions-dropdown" *ngIf="showSuggestions && suggestions.length > 0">
          <div class="suggestion-item" *ngFor="let product of suggestions" (mousedown)="selectSuggestion(product)">
            <span class="suggestion-name">{{product.name}}</span>
            <span class="suggestion-price">{{product.price | currency:'VND':'symbol':'1.0-0'}}</span>
          </div>
        </div>
      </div>
      <div class="nav-right" *ngIf="!isLoggedIn">
        <a routerLink="/login" class="nav-btn">Đăng nhập</a>
        <a routerLink="/register" class="nav-btn register-btn">Đăng ký</a>
      </div>
      <div class="nav-right" *ngIf="isLoggedIn">
        <div class="user-dropdown" (click)="toggleUserMenu()">
          <div class="user-avatar">
            {{(currentUser?.username || 'U').charAt(0).toUpperCase()}}
          </div>
          <div class="dropdown-menu" *ngIf="showUserMenu">
            <a routerLink="/profile" class="dropdown-item" (click)="closeUserMenu()">
              <i class="fas fa-user"></i> Profile
            </a>
            <button class="dropdown-item" (click)="logout()">
              <i class="fas fa-sign-out-alt"></i> Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Search Results Overlay -->
    <div class="search-overlay" *ngIf="showSearchResults" (click)="closeSearchResults()">
      <div class="search-results" (click)="$event.stopPropagation()">
        <div class="search-header">
          <h3>Kết quả tìm kiếm: "{{searchQuery}}"</h3>
          <button class="close-btn" (click)="closeSearchResults()">×</button>
        </div>
        <div class="results-list" *ngIf="searchResults.length > 0">
          <div class="product-item" *ngFor="let product of searchResults">
            <div class="product-info">
              <h4>{{product.name}}</h4>
              <p class="price">{{product.price | currency:'VND':'symbol':'1.0-0'}}</p>
              <p class="description" *ngIf="product.description">{{product.description}}</p>
            </div>
          </div>
        </div>
        <div class="no-results" *ngIf="searchResults.length === 0">
          <p>Không tìm thấy sản phẩm nào</p>
        </div>
      </div>
    </div>

    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 30px;
      background: #2c3e50;
      color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .nav-center {
      flex: 1;
      display: flex;
      justify-content: center;
      margin: 0 20px;
    }
    .search-container {
      display: flex;
      align-items: center;
      background: white;
      border-radius: 25px;
      padding: 5px;
      width: 100%;
      max-width: 400px;
      position: relative;
    }
    .suggestions-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      z-index: 1000;
      max-height: 300px;
      overflow-y: auto;
    }
    .suggestion-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 15px;
      cursor: pointer;
      border-bottom: 1px solid #f0f0f0;
    }
    .suggestion-item:hover {
      background: #f8f9fa;
    }
    .suggestion-item:last-child {
      border-bottom: none;
    }
    .suggestion-name {
      color: #333;
      font-size: 14px;
    }
    .suggestion-price {
      color: #e74c3c;
      font-weight: bold;
      font-size: 12px;
    }
    .search-input {
      flex: 1;
      border: none;
      outline: none;
      padding: 8px 15px;
      border-radius: 20px;
      font-size: 14px;
    }
    .search-btn {
      background: #3498db;
      border: none;
      border-radius: 50%;
      width: 35px;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: white;
      transition: background 0.3s;
    }
    .search-btn:hover {
      background: #2980b9;
    }
    .search-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 1000;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding-top: 100px;
    }
    .search-results {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      max-height: 70vh;
      overflow-y: auto;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }
    .search-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #eee;
    }
    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
    }
    .results-list {
      padding: 10px;
    }
    .product-item {
      padding: 15px;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: background 0.3s;
    }
    .product-item:hover {
      background: #f8f9fa;
    }
    .product-info h4 {
      margin: 0 0 5px 0;
      color: #333;
    }
    .price {
      color: #e74c3c;
      font-weight: bold;
      margin: 0 0 5px 0;
    }
    .description {
      color: #666;
      font-size: 14px;
      margin: 0;
    }
    .no-results {
      text-align: center;
      padding: 40px;
      color: #666;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: white;
      text-decoration: none;
    }
    .nav-right {
      display: flex;
      gap: 15px;
    }
    .nav-btn {
      padding: 8px 16px;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: background 0.3s;
    }
    .nav-btn:hover {
      background: rgba(255,255,255,0.1);
    }
    .register-btn {
      background: #3498db;
    }
    .register-btn:hover {
      background: #2980b9;
    }
    .user-info {
      color: white;
      margin-right: 15px;
      font-weight: 500;
    }
    .logout-btn {
      background: #e74c3c;
    }
    .logout-btn:hover {
      background: #c0392b;
    }
    .container {
      min-height: calc(100vh - 70px);
      background: #ecf0f1;
    }
    .user-dropdown {
      position: relative;
      cursor: pointer;
    }
    .user-avatar {
      width: 40px;
      height: 40px;
      background: #3498db;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 16px;
      transition: background 0.3s;
    }
    .user-avatar:hover {
      background: #2980b9;
    }
    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      min-width: 150px;
      z-index: 1000;
      margin-top: 8px;
      overflow: hidden;
    }
    .dropdown-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      color: #333;
      text-decoration: none;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
      transition: background 0.3s;
    }
    .dropdown-item:hover {
      background: #f8f9fa;
    }
    .dropdown-item i {
      margin-right: 8px;
      width: 16px;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'Pap Shop';
  isLoggedIn = false;
  currentUser: any = null;
  searchQuery = '';
  searchResults: Product[] = [];
  showSearchResults = false;
  suggestions: Product[] = [];
  showSuggestions = false;
  showUserMenu = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private apiService: ApiService
  ) {
    // Lắng nghe sự kiện navigation để cập nhật trạng thái login
    this.router.events.subscribe(() => {
      this.checkLoginStatus();
    });
  }

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.currentUser = this.authService.getCurrentUserFromToken();
    }
  }

  logout() {
    this.authService.logout();
    this.checkLoginStatus();
    this.showUserMenu = false;
    this.router.navigate(['/']);
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.apiService.searchProducts(this.searchQuery.trim()).subscribe({
        next: (products) => {
          this.searchResults = products;
          this.showSearchResults = true;
        },
        error: (error) => {
          console.error('Search error:', error);
          this.searchResults = [];
          this.showSearchResults = true;
        }
      });
    }
  }

  closeSearchResults() {
    this.showSearchResults = false;
    this.searchQuery = '';
  }

  onSearchInput() {
    if (this.searchQuery.trim().length >= 2) {
      this.apiService.searchProducts(this.searchQuery.trim()).subscribe({
        next: (products) => {
          this.suggestions = products.slice(0, 5); // Chỉ hiện thị 5 gợi ý đầu tiên
          this.showSuggestions = true;
        },
        error: () => {
          this.suggestions = [];
          this.showSuggestions = false;
        }
      });
    } else {
      this.suggestions = [];
      this.showSuggestions = false;
    }
  }

  onSearchFocus() {
    if (this.suggestions.length > 0) {
      this.showSuggestions = true;
    }
  }

  onSearchBlur() {
    // Delay để cho phép click vào suggestion
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  selectSuggestion(product: Product) {
    this.searchQuery = product.name;
    this.showSuggestions = false;
    this.onSearch();
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu() {
    this.showUserMenu = false;
  }


}