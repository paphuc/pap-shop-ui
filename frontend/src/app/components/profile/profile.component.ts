import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    address: '',
    roleId: 0
  };
  isEditing = false;
  loading = true;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.authService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = {
          id: data.id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          roleId: data.roleId || 0
        };
        this.loading = false;
        this.error = '';
      },
      error: (err) => {
        this.error = 'Không thể tải thông tin người dùng';
        this.loading = false;
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveProfile() {
    const updateData = {
      name: this.user.name,
      email: this.user.email,
      phone: this.user.phone,
      address: this.user.address
    };

    this.authService.updateProfile(updateData).subscribe({
      next: (response) => {
        this.isEditing = false;
        this.error = '';
        alert('Cập nhật thông tin thành công!');
        this.loadUserProfile();
      },
      error: (err) => {
        this.error = 'Không thể cập nhật thông tin';
      }
    });
  }
}