import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-panel" *ngIf="authService.isAdmin()">
      <h2>Admin Panel</h2>
      
      <div class="section">
        <h3>Tạo Role</h3>
        <input [(ngModel)]="newRole.name" placeholder="Tên role">
        <button (click)="createRole()">Tạo Role</button>
      </div>

      <div class="section">
        <h3>Tạo Category</h3>
        <input [(ngModel)]="newCategory.name" placeholder="Tên category">
        <button (click)="createCategory()">Tạo Category</button>
      </div>

      <div *ngIf="message" class="alert">{{message}}</div>
    </div>
    
    <div *ngIf="!authService.isAdmin()" class="no-access">
      <p>Bạn không có quyền truy cập trang này</p>
    </div>
  `,
  styles: [`
    .admin-panel { padding: 20px; }
    .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
    input { padding: 8px; margin-right: 10px; }
    button { padding: 8px 15px; background: #007bff; color: white; border: none; }
    .alert { margin: 10px 0; padding: 10px; background: #f8f9fa; }
    .no-access { text-align: center; padding: 50px; }
  `]
})
export class AdminPanelComponent {
  newRole = { name: '' };
  newCategory = { name: '' };
  message = '';

  constructor(public authService: AuthService) {}

  createRole() {
    this.authService.createRole(this.newRole).subscribe({
      next: () => {
        this.message = 'Tạo role thành công!';
        this.newRole.name = '';
      },
      error: (error) => {
        this.message = 'Lỗi: ' + (error.error || error.message);
      }
    });
  }

  createCategory() {
    this.authService.createCategory(this.newCategory).subscribe({
      next: () => {
        this.message = 'Tạo category thành công!';
        this.newCategory.name = '';
      },
      error: (error) => {
        this.message = 'Lỗi: ' + (error.error || error.message);
      }
    });
  }
}