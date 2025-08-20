import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="register-container">
      <div class="register-form">
        <h2>Đăng ký</h2>
        <form (ngSubmit)="onRegister()" #registerForm="ngForm">
          <div class="form-group">
            <label for="username">Tên đăng nhập:</label>
            <input type="text" id="username" name="username" [(ngModel)]="registerData.username" required>
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" [(ngModel)]="registerData.email" required>
          </div>
          <div class="form-group">
            <label for="password">Mật khẩu:</label>
            <input type="password" id="password" name="password" [(ngModel)]="registerData.password" required>
          </div>
          <div class="form-group">
            <label for="confirmPassword">Xác nhận mật khẩu:</label>
            <input type="password" id="confirmPassword" name="confirmPassword" [(ngModel)]="confirmPassword" required>
          </div>
          <button type="submit" [disabled]="!registerForm.form.valid || registerData.password !== confirmPassword">
            Đăng ký
          </button>
        </form>
        <p class="login-link">
          Đã có tài khoản? <a routerLink="/login">Đăng nhập</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 20px;
    }
    .register-form {
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
    .login-link {
      text-align: center;
      margin-top: 15px;
    }
  `]
})
export class RegisterComponent {
  registerData = {
    username: '',
    email: '',
    password: ''
  };
  confirmPassword = '';

  constructor(private apiService: ApiService, private router: Router) {}

  onRegister() {
    if (this.registerData.password !== this.confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }

    const registerPayload = {
      name: this.registerData.username,
      email: this.registerData.email,
      password: this.registerData.password
    };

    this.apiService.register(registerPayload).subscribe({
      next: (response) => {
        alert('Đăng ký thành công!');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Register error:', error);
        alert('Đăng ký thất bại: ' + (error.error || error.message || 'Lỗi không xác định'));
      }
    });
  }
}