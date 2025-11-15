import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AnnouncementService } from '../../services/announcement.service';
import { Announcement } from '../../models/announcement.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-announcement-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" *ngIf="showToast && currentAnnouncement">
      <div class="toast">
        <div class="toast-header">
          <strong>{{ currentAnnouncement.title }}</strong>
          <button class="close-btn" (click)="closeToast()">×</button>
        </div>
        <div class="toast-body">
          <p>{{ currentAnnouncement.message }}</p>
          <button 
            *ngIf="currentAnnouncement.productId" 
            class="view-product-btn"
            (click)="viewProduct()">
            Xem sản phẩm: {{ currentAnnouncement.productName }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .toast {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      min-width: 300px;
      max-width: 400px;
      overflow: hidden;
    }

    .toast-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
    }

    .toast-body {
      padding: 16px;
    }

    .toast-body p {
      margin: 0 0 12px 0;
      color: #333;
    }

    .view-product-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      width: 100%;
    }

    .view-product-btn:hover {
      background: #5568d3;
    }
  `]
})
export class AnnouncementToastComponent implements OnInit, OnDestroy {
  currentAnnouncement: Announcement | null = null;
  showToast = false;
  private subscription: Subscription | null = null;

  constructor(
    private announcementService: AnnouncementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.announcementService.connect();

    this.subscription = this.announcementService.announcement$.subscribe(
      (announcement) => {
        if (announcement) {
          this.currentAnnouncement = announcement;
          this.showToast = true;

          setTimeout(() => {
            this.showToast = false;
          }, 5000);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.announcementService.disconnect();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  closeToast(): void {
    this.showToast = false;
  }

  viewProduct(): void {
    if (this.currentAnnouncement?.productId) {
      this.router.navigate(['/products', this.currentAnnouncement.productId]);
      this.closeToast();
    }
  }
}