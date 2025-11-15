import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <h1>Hồ sơ cá nhân</h1>
      </div>

      <div *ngIf="loading" class="loading">Đang tải...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <div *ngIf="!loading && !error" class="profile-content">
        <div class="profile-info">
          <h2>Thông tin cá nhân</h2>
          <div *ngIf="!editMode" class="info-display">
            <div class="info-item">
              <label>Tên:</label>
              <span>{{ userInfo.name }}</span>
            </div>
            <div class="info-item">
              <label>Email:</label>
              <span>{{ userInfo.email }}</span>
            </div>
            <div class="info-item">
              <label>Số điện thoại:</label>
              <span>{{ userInfo.phone || 'Chưa cập nhật' }}</span>
            </div>
            <div class="info-item">
              <label>Địa chỉ:</label>
              <span>{{ userInfo.address || 'Chưa cập nhật' }}</span>
            </div>
            <button class="edit-btn" (click)="enableEdit()">Chỉnh sửa</button>
          </div>

          <div *ngIf="editMode" class="info-edit">
            <div class="form-group">
              <label>Tên:</label>
              <input type="text" [(ngModel)]="editInfo.name" required>
            </div>
            <div class="form-group">
              <label>Email:</label>
              <input type="email" [(ngModel)]="editInfo.email" required>
            </div>
            <div class="form-group">
              <label>Số điện thoại:</label>
              <input type="tel" [(ngModel)]="editInfo.phone">
            </div>
            <div class="form-group">
              <label>Địa chỉ:</label>
              <textarea [(ngModel)]="editInfo.address" rows="3"></textarea>
            </div>
            <div class="form-actions">
              <button class="save-btn" (click)="saveProfile()" [disabled]="saving">
                {{ saving ? 'Đang lưu...' : 'Lưu' }}
              </button>
              <button class="cancel-btn" (click)="cancelEdit()">Hủy</button>
            </div>
          </div>
        </div>

        <div class="password-section">
          <h2>Đổi mật khẩu</h2>
          <div class="form-group">
            <label>Mật khẩu hiện tại:</label>
            <input type="password" [(ngModel)]="passwordForm.oldPassword">
          </div>
          <div class="form-group">
            <label>Mật khẩu mới:</label>
            <input type="password" [(ngModel)]="passwordForm.newPassword">
          </div>
          <div class="form-group">
            <label>Xác nhận mật khẩu mới:</label>
            <input type="password" [(ngModel)]="passwordForm.confirmNewPassword">
          </div>
          <button class="change-password-btn" (click)="changePassword()" [disabled]="changingPassword">
            {{ changingPassword ? 'Đang đổi...' : 'Đổi mật khẩu' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .profile-header {
      margin-bottom: 30px;
    }
    .profile-content {
      display: grid;
      gap: 30px;
    }
    .profile-info, .password-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .info-item {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 10px;
      margin-bottom: 15px;
      align-items: center;
    }
    .info-item label {
      font-weight: bold;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    .form-group input, .form-group textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .form-actions {
      display: flex;
      gap: 10px;
    }
    .edit-btn, .save-btn, .change-password-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
    }
    .cancel-btn {
      background: #6c757d;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
    }
    .loading, .error {
      text-align: center;
      padding: 40px;
    }
    .error {
      color: #dc3545;
    }
  `]
})
export class ProfileComponent implements OnInit {
  userInfo: any = {};
  editInfo: any = {};
  editMode = false;
  loading = true;
  error = '';
  saving = false;
  changingPassword = false;
  
  passwordForm = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.apiService.get('/user/profile').subscribe({
      next: (data) => {
        this.userInfo = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Không thể tải thông tin profile';
        this.loading = false;
      }
    });
  }

  enableEdit() {
    this.editMode = true;
    this.editInfo = { ...this.userInfo };
  }

  cancelEdit() {
    this.editMode = false;
    this.editInfo = {};
  }

  saveProfile() {
    this.saving = true;
    this.apiService.put('/user/update', this.editInfo).subscribe({
      next: (data) => {
        this.userInfo = data;
        this.editMode = false;
        this.saving = false;
        alert('Cập nhật thành công!');
      },
      error: (error) => {
        this.saving = false;
        alert('Lỗi khi cập nhật profile!');
      }
    });
  }

  changePassword() {
    if (this.passwordForm.newPassword !== this.passwordForm.confirmNewPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    this.changingPassword = true;
    this.apiService.put('/user/update/password', this.passwordForm).subscribe({
      next: (response) => {
        this.changingPassword = false;
        this.passwordForm = { oldPassword: '', newPassword: '', confirmNewPassword: '' };
        alert('Đổi mật khẩu thành công!');
      },
      error: (error) => {
        this.changingPassword = false;
        console.log('Change password error:', error);
        
        if (error.status === 200 || error.error?.text?.includes('thành công')) {
          this.passwordForm = { oldPassword: '', newPassword: '', confirmNewPassword: '' };
          alert('Đổi mật khẩu thành công!');
        } else {
          let errorMessage = 'Lỗi khi đổi mật khẩu';
          
          if (error.status === 404) {
            errorMessage = 'Không tìm thấy người dùng';
          } else if (error.status === 401) {
            errorMessage = 'Mật khẩu cũ không chính xác';
          } else if (error.status === 400) {
            const msg = error.error?.message || error.message;
            if (msg?.includes('New passwords do not match')) {
              errorMessage = 'Mật khẩu mới không khớp';
            } else if (msg?.includes('New password must be at least 6 characters')) {
              errorMessage = 'Mật khẩu mới phải có ít nhất 6 ký tự';
            } else {
              errorMessage = msg || 'Dữ liệu không hợp lệ';
            }
          } else {
            errorMessage = error.error?.message || error.message || 'Lỗi không xác định';
          }
          
          alert(errorMessage);
        }
      }
    });
  }
}