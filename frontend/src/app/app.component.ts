import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import { CartService } from './services/cart.service';
import { AuthTimeoutService } from './services/auth-timeout.service';
import { Product } from './models/product.model';
import { AnnouncementToastComponent } from './components/announcement/announcement-toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, FormsModule, AnnouncementToastComponent],
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
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
        <a routerLink="/announcements" class="nav-btn">Thông báo</a>
        <a routerLink="/cart" class="cart-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="m1 1 4 4 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span class="cart-badge" *ngIf="cartCount > 0">{{cartCount}}</span>
        </a>
        <div class="user-dropdown" (click)="toggleUserMenu()">
          <div class="user-avatar">
            {{(currentUser?.username || 'U').charAt(0).toUpperCase()}}
          </div>
          <div class="dropdown-menu" *ngIf="showUserMenu">
            <a routerLink="/profile" class="dropdown-item" (click)="closeUserMenu()">
              <i class="fas fa-user"></i> Hồ sơ
            </a>
            <a routerLink="/orders" class="dropdown-item" (click)="closeUserMenu()">
              <i class="fas fa-shopping-bag"></i> Đơn hàng của tôi
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

    <app-announcement-toast></app-announcement-toast>
    
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 30px;
      background: #ffffff;
      color: #000000;
      border-bottom: 1px solid #e5e5e5;
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
      background: #f3f4f6;
      border-radius: 999px;
      padding: 8px 16px;
      width: 100%;
      max-width: 400px;
      position: relative;
      border: none;
    }
    .suggestions-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: #ffffff;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      z-index: 1000;
      max-height: 300px;
      overflow-y: auto;
      margin-top: 4px;
    }
    .suggestion-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      cursor: pointer;
      border-bottom: 1px solid #f3f4f6;
      transition: background-color 0.2s;
    }
    .suggestion-item:hover {
      background: #f9fafb;
    }
    .suggestion-item:last-child {
      border-bottom: none;
    }
    .suggestion-name {
      color: #000000;
      font-size: 14px;
      font-weight: 400;
    }
    .suggestion-price {
      color: #6b7280;
      font-weight: 500;
      font-size: 12px;
    }
    .search-input {
      flex: 1;
      border: none;
      outline: none;
      padding: 8px 0;
      background: transparent;
      font-size: 14px;
      color: #000000;
    }
    .search-input::placeholder {
      color: #6b7280;
    }
    .search-btn {
      background: none;
      border: none;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #2563EB;
      transition: color 0.2s;
    }
    .search-btn:hover {
      color: #1d4ed8;
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
      font-weight: 600;
      color: #000000;
      text-decoration: none;
      letter-spacing: -0.02em;
    }
    .nav-right {
      display: flex;
      gap: 15px;
    }
    .nav-btn {
      padding: 8px 16px;
      color: #000000;
      text-decoration: none;
      border-radius: 4px;
      transition: all 0.2s;
      font-size: 14px;
      font-weight: 500;
    }
    .nav-btn:hover {
      background: #f3f4f6;
    }
    .register-btn {
      background: #000000;
      color: #ffffff;
      border: 1px solid #000000;
    }
    .register-btn:hover {
      background: #ffffff;
      color: #000000;
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
      background: #ffffff;
    }
    .user-dropdown {
      position: relative;
      cursor: pointer;
    }
    .user-avatar {
      width: 36px;
      height: 36px;
      background: #000000;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-weight: 500;
      font-size: 14px;
      transition: all 0.2s;
    }
    .user-avatar:hover {
      background: #374151;
    }
    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: #ffffff;
      border: 1px solid #e5e5e5;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      min-width: 160px;
      z-index: 1000;
      margin-top: 8px;
      overflow: hidden;
    }
    .dropdown-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      color: #000000;
      text-decoration: none;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
      transition: background-color 0.2s;
      font-size: 14px;
      font-weight: 400;
    }
    .dropdown-item:hover {
      background: #f9fafb;
    }
    .dropdown-item i {
      margin-right: 8px;
      width: 16px;
    }
    .cart-icon {
      color: #000000;
      padding: 8px;
      border-radius: 4px;
      transition: all 0.2s;
      margin-right: 15px;
      position: relative;
      text-decoration: none;
    }
    .cart-icon:hover {
      background: #f3f4f6;
    }
    .cart-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #2563EB;
      color: #ffffff;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 500;
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
  cartCount = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private apiService: ApiService,
    private cartService: CartService,
    private authTimeoutService: AuthTimeoutService
  ) {
    this.router.events.subscribe(() => {
      this.checkLoginStatus();
    });
  }

  ngOnInit() {
    this.checkLoginStatus();
    this.cartService.getCartCount().subscribe(count => {
      this.cartCount = count;
    });
  }

  checkLoginStatus() {
    const wasLoggedIn = this.isLoggedIn;
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.currentUser = this.authService.getCurrentUserFromToken();
      if (!wasLoggedIn) {
        this.cartService.refreshCartCount();
        this.authTimeoutService.startTimeout();
      }
    } else {
      this.authTimeoutService.clearTimeout();
    }
  }

  logout() {
    this.authTimeoutService.clearTimeout();
    this.authService.logout();
    this.cartService.refreshCartCount();
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
        error: () => {
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
          this.suggestions = products.slice(0, 5);
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