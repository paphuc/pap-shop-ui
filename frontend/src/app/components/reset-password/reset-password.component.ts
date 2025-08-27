import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="reset-container">
      <div class="reset-form">
        <h2>Đặt lại mật khẩu</h2>
        
        <div class="info-text">
          <p>Mã xác thực đã được gửi đến email: <strong>{{email}}</strong></p>
          <p>Vui lòng kiểm tra hộp thư và nhập mã 5 ký tự.</p>
        </div>
        
        <form (ngSubmit)="onSubmit()" #resetForm="ngForm">
          <div class="form-group">
            <label for="code">Mã xác thực (5 ký tự):</label>
            <input 
              type="text" 
              id="code" 
              name="code" 
              [(ngModel)]="code" 
              required 
              maxlength="5"
              minlength="5"
              pattern="[A-Z0-9]{5}"
              placeholder="VD: A3B9K"
              class="code-input"
              (input)="onCodeInput($event)"
              #codeInput>
          </div>
          
          <div class="form-group">
            <label for="password">Mật khẩu mới:</label>
            <div class="password-input">
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                id="password" 
                name="password" 
                [(ngModel)]="password" 
                required 
                minlength="6"
                placeholder="Ít nhất 6 ký tự">
              <button type="button" class="toggle-password" (click)="togglePassword()">
                {{showPassword ? '🙈' : '👁️'}}
              </button>
            </div>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Xác nhận mật khẩu:</label>
            <div class="password-input">
              <input 
                [type]="showConfirmPassword ? 'text' : 'password'" 
                id="confirmPassword" 
                name="confirmPassword" 
                [(ngModel)]="confirmPassword" 
                required 
                placeholder="Nhập lại mật khẩu mới">
              <button type="button" class="toggle-password" (click)="toggleConfirmPassword()">
                {{showConfirmPassword ? '🙈' : '👁️'}}
              </button>
            </div>
          </div>
          
          <div *ngIf="password && confirmPassword && password !== confirmPassword" class="error">
            Mật khẩu không khớp
          </div>
          
          <button 
            type="submit" 
            [disabled]="!resetForm.form.valid || password !== confirmPassword || isLoading">
            {{isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}}
          </button>
        </form>
        
        <div *ngIf="message" [class]="messageClass">{{message}}</div>
        
        <div class="resend-section">
          <p>Không nhận được mã? 
            <button type="button" class="resend-btn" (click)="resendCode()" [disabled]="resendLoading">
              {{resendLoading ? 'Đang gửi...' : 'Gửi lại mã'}}
            </button>
          </p>
        </div>
        
        <div class="navigation-links">
          <p class="back-link">
            <a routerLink="/forgot-password">← Quay lại nhập email</a>
          </p>
          <p class="back-link">
            <a routerLink="/login">Quay lại đăng nhập</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reset-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 20px;
    }
    .reset-form {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 450px;
    }
    .info-text {
      background: #e3f2fd;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
      border-left: 4px solid #2196f3;
    }
    .info-text p {
      margin: 5px 0;
      color: #1565c0;
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
    .code-input {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      letter-spacing: 3px;
      text-transform: uppercase;
    }
    .password-input {
      position: relative;
    }
    .toggle-password {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      width: auto;
      padding: 5px;
    }
    @media (max-width: 768px) {
      .reset-form {
        margin: 10px;
        padding: 20px;
      }
      .code-input {
        font-size: 16px;
        letter-spacing: 2px;
      }
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
    .resend-section {
      text-align: center;
      margin: 20px 0;
    }
    .resend-btn {
      background: none;
      border: none;
      color: #3498db;
      text-decoration: underline;
      cursor: pointer;
      font-size: 14px;
      width: auto;
      padding: 0;
    }
    .resend-btn:hover {
      color: #2980b9;
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
  `]
})
export class ResetPasswordComponent implements OnInit {
  email = '';
  code = '';
  password = '';
  confirmPassword = '';
  message = '';
  messageClass = '';
  isLoading = false;
  resendLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private apiService: ApiService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.email = this.route.snapshot.queryParams['email'] || '';
    if (!this.email) {
      this.router.navigate(['/forgot-password']);
    }
  }

  onCodeInput(event: any) {
    // Chỉ cho phép chữ cái và số, chuyển thành chữ hoa
    let value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    this.code = value.substring(0, 5);
    event.target.value = this.code;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.message = 'Mật khẩu không khớp';
      this.messageClass = 'error';
      return;
    }

    if (this.code.length !== 5) {
      this.message = 'Mã code phải có đúng 5 ký tự';
      this.messageClass = 'error';
      return;
    }

    if (this.password.length < 6) {
      this.message = 'Mật khẩu phải có ít nhất 6 ký tự';
      this.messageClass = 'error';
      return;
    }

    this.isLoading = true;
    this.message = '';
    
    this.apiService.resetPasswordWithCode(this.code, this.password, this.confirmPassword).subscribe({
      next: (response) => {
        this.message = 'Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập...';
        this.messageClass = 'success';
        this.isLoading = false;
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.message = error.error || 'Mã xác thực không đúng hoặc đã hết hạn';
        this.messageClass = 'error';
        this.isLoading = false;
      }
    });
  }

  resendCode() {
    this.resendLoading = true;
    
    this.apiService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.message = 'Mã xác thực mới đã được gửi đến email của bạn';
        this.messageClass = 'success';
        this.resendLoading = false;
      },
      error: (error) => {
        this.message = 'Không thể gửi lại mã. Vui lòng thử lại sau';
        this.messageClass = 'error';
        this.resendLoading = false;
      }
    });
  }
}