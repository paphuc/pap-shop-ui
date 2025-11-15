import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-form">
        <h2>Đăng nhập</h2>
        <form (ngSubmit)="onLogin()" #loginForm="ngForm">
          <div class="form-group">
            <label for="emailOrPhone">Username, Email hoặc số điện thoại:</label>
            <input type="text" id="emailOrPhone" name="emailOrPhone" [(ngModel)]="loginData.emailOrPhone" required>
          </div>
          <div class="form-group">
            <label for="password">Mật khẩu:</label>
            <input type="password" id="password" name="password" [(ngModel)]="loginData.password" required>
          </div>
          <button type="submit" [disabled]="!loginForm.form.valid">Đăng nhập</button>
        </form>
        <p class="register-link">
          Chưa có tài khoản? <a routerLink="/register">Đăng ký</a>
        </p>
        <p class="forgot-link">
          <a routerLink="/forgot-password">Quên mật khẩu?</a>
        </p>
        <div *ngIf="message" class="alert">{{message}}</div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 20px;
    }
    .login-form {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    }
    button {
      width: 100%;
      padding: 12px;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }
    .register-link {
      text-align: center;
      margin-top: 15px;
    }
    .forgot-link {
      text-align: center;
      margin-top: 10px;
    }
    .forgot-link a {
      color: #e74c3c;
      text-decoration: none;
      font-size: 14px;
    }
    .alert {
      margin-top: 15px;
      padding: 10px;
      border-radius: 4px;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
    }
  `]
})
export class LoginComponent {
  loginData = { emailOrPhone: '', password: '' };
  message = '';

  constructor(private apiService: ApiService, private router: Router) {}

  onLogin() {
    this.message = 'Đang đăng nhập...';
    this.apiService.login(this.loginData.emailOrPhone, this.loginData.password).subscribe({
      next: (response) => {
        console.log('Login response:', response);
        this.message = 'Đăng nhập thành công!';
        localStorage.setItem('token', response);
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      },
      error: (error) => {
        console.error('Login error:', error);
        if (error.status === 0) {
          this.message = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
        } else if (error.status === 401) {
          // Xử lý các lỗi 401 theo API_EXCEPTIONS.md
          const errorMsg = error.error?.message || error.message;
          if (errorMsg?.includes('not found')) {
            this.message = 'Không tìm thấy tên đăng nhập/Email/Số điện thoại';
          } else if (errorMsg?.includes('locked')) {
            this.message = 'Tài khoản đã bị khóa';
          } else {
            this.message = 'Thông tin đăng nhập không hợp lệ';
          }
        } else if (error.status === 404) {
          this.message = 'API không tồn tại. Vui lòng kiểm tra server.';
        } else {
          // Hiển thị message từ backend hoặc fallback message
          let errorMessage = 'Đăng nhập thất bại';
          
          if (error.error) {
            if (typeof error.error === 'string') {
              errorMessage = error.error;
            } else if (error.error.message) {
              errorMessage = error.error.message;
            }
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          // Xử lý các message cụ thể từ backend
          if (errorMessage.includes('Username/Email/Phone number not found')) {
            this.message = 'Username/Email/Số điện thoại không tồn tại.';
          } else if (errorMessage.includes('Invalid credentials')) {
            this.message = 'Email/số điện thoại hoặc mật khẩu không đúng.';
          } else if (errorMessage.includes('Account has been locked')) {
            this.message = 'Tài khoản đã bị khóa. Vui lòng liên hệ admin.';
          } else {
            this.message = errorMessage;
          }
        }
      }
    });
  }
}