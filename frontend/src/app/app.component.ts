import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <nav class="navbar">
      <div class="nav-left">
        <a routerLink="/" class="logo">Pap Shop</a>
      </div>
      <div class="nav-right" *ngIf="!isLoggedIn">
        <a routerLink="/login" class="nav-btn">Đăng nhập</a>
        <a routerLink="/register" class="nav-btn register-btn">Đăng ký</a>
      </div>
      <div class="nav-right" *ngIf="isLoggedIn">
        <span class="user-info">Xin chào, {{currentUser?.username}}</span>
        <button (click)="logout()" class="nav-btn logout-btn">Đăng xuất</button>
      </div>
    </nav>
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
  `]
})
export class AppComponent implements OnInit {
  title = 'Pap Shop';
  isLoggedIn = false;
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.currentUser = this.authService.getCurrentUser();
    }
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.currentUser = null;
    this.router.navigate(['/']);
  }
}