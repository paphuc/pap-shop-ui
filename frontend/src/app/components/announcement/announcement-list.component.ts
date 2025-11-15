import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnnouncementService } from '../../services/announcement.service';
import { Announcement } from '../../models/announcement.model';

@Component({
  selector: 'app-announcement-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="announcement-list">
      <h2>Thông Báo</h2>
      
      <div *ngIf="loading" class="loading">
        <p>Đang tải...</p>
      </div>

      <div *ngIf="!loading && announcements.length === 0" class="empty">
        <p>Không có thông báo nào</p>
      </div>

      <div class="announcement-card" *ngFor="let announcement of announcements">
        <div class="card-header">
          <h3>{{ announcement.title }}</h3>
          <span class="date">{{ formatDate(announcement.createdAt) }}</span>
        </div>
        <div class="card-body">
          <p>{{ announcement.message }}</p>
          <a 
            *ngIf="announcement.productId" 
            [routerLink]="['/products', announcement.productId]"
            class="product-link">
            → Xem sản phẩm: {{ announcement.productName }}
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .announcement-list {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .announcement-list h2 {
      color: #333;
      margin-bottom: 20px;
    }

    .loading, .empty {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .announcement-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 16px;
      overflow: hidden;
    }

    .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-header h3 {
      margin: 0;
      font-size: 18px;
    }

    .date {
      font-size: 14px;
      opacity: 0.9;
    }

    .card-body {
      padding: 16px;
    }

    .card-body p {
      margin: 0 0 12px 0;
      color: #333;
      line-height: 1.5;
    }

    .product-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .product-link:hover {
      text-decoration: underline;
    }
  `]
})
export class AnnouncementListComponent implements OnInit {
  announcements: Announcement[] = [];
  loading = true;

  constructor(private announcementService: AnnouncementService) {}

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  loadAnnouncements(): void {
    this.announcementService.getActiveAnnouncements().subscribe({
      next: (data) => {
        this.announcements = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading announcements:', error);
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }
}