import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="forgot-container">
      <div class="forgot-form">
        <h2>Quên mật khẩu</h2>
        <p class="description">Nhập email của bạn để nhận mã code đặt lại mật khẩu</p>
        
        <form (ngSubmit)="onSubmit()" #forgotForm="ngForm">
          <div class="form-group">
            <label for="email">Email:</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              [(ngModel)]="email" 
              required 
              placeholder="Nhập email của bạn">
          </div>
          
          <button type="submit" [disabled]="!forgotForm.form.valid || isLoading">
            {{isLoading ? 'Đang gửi...' : 'Gửi link reset'}}
          </button>
        </form>
        
        <div *ngIf="message" [class]="messageClass">{{message}}</div>
        
        <div class="navigation-links">
          <p class="back-link">
            <a routerLink="/login">← Quay lại đăng nhập</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .forgot-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 20px;
    }
    .forgot-form {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    .description {
      color: #666;
      margin-bottom: 20px;
      text-align: center;
    }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    input {
      width: 100%;
      padding: 12px;
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
      font-size: 16px;
    }
    button:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }
    .success {
      margin-top: 15px;
      padding: 10px;
      border-radius: 4px;
      background: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
    }
    .error {
      margin-top: 15px;
      padding: 10px;
      border-radius: 4px;
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }
    .back-link {
      text-align: center;
      margin-top: 20px;
    }
    .navigation-links {
      margin-top: 20px;
    }
    .back-link {
      text-align: center;
      margin: 10px 0;
    }
    .back-link a {
      color: #3498db;
      text-decoration: none;
      font-size: 14px;
    }
    .back-link a:hover {
      text-decoration: underline;
    }
    @media (max-width: 768px) {
      .forgot-form {
        margin: 10px;
        padding: 20px;
      }
    }
  `]
})
export class ForgotPasswordComponent {
  email = '';
  message = '';
  messageClass = '';
  isLoading = false;

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this.message = '';
    
    this.apiService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.message = 'Mã code đã được gửi đến email của bạn';
        this.messageClass = 'success';
        this.isLoading = false;
        
        // Chuyển đến trang nhập code sau 2 giây
        setTimeout(() => {
          this.router.navigate(['/reset-password'], { queryParams: { email: this.email } });
        }, 2000);
      },
      error: (error) => {
        this.message = error.error || 'Email không tồn tại trong hệ thống';
        this.messageClass = 'error';
        this.isLoading = false;
      }
    });
  }
}