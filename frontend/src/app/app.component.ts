import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <nav class="navbar">
      <div class="nav-left">
        <a routerLink="/" class="logo">Pap Shop</a>
      </div>
      <div class="nav-right">
        <a routerLink="/profile" class="nav-btn">Profile</a>
        <a routerLink="/login" class="nav-btn">Đăng nhập</a>
        <a routerLink="/register" class="nav-btn register-btn">Đăng ký</a>
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
    .container {
      min-height: calc(100vh - 70px);
      background: #ecf0f1;
    }
  `]
})
export class AppComponent {
  title = 'Pap Shop';
}