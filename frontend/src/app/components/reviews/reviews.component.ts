import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Review, CreateReviewRequest } from '../../models/review.model';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reviews-container">
      <div class="reviews-header">
        <h3>Đánh giá sản phẩm</h3>
        <button *ngIf="isLoggedIn && !showAddForm" 
                class="add-review-btn" 
                (click)="showAddForm = true">
          Viết đánh giá
        </button>
      </div>

      <!-- Add Review Form -->
      <div *ngIf="showAddForm" class="add-review-form">
        <h4>Thêm đánh giá</h4>
        <div class="rating-input">
          <span>Đánh giá: </span>
          <div class="stars">
            <span *ngFor="let star of [1,2,3,4,5]" 
                  class="star" 
                  [class.active]="star <= newReview.rating"
                  (click)="setRating(star)">★</span>
          </div>
        </div>
        <textarea [(ngModel)]="newReview.comment" 
                  placeholder="Nhận xét của bạn..."
                  rows="4"></textarea>
        <div class="form-actions">
          <button (click)="submitReview()" [disabled]="!newReview.rating">Gửi</button>
          <button (click)="cancelAdd()">Hủy</button>
        </div>
      </div>

      <!-- Reviews List -->
      <div class="reviews-list">
        <div *ngIf="reviews.length === 0" class="no-reviews">
          Chưa có đánh giá nào
        </div>
        <div *ngFor="let review of reviews" class="review-item">
          <div class="review-header">
            <div class="user-info">
              <span class="username">{{review.userFullName || review.username}}</span>
              <div class="rating">
                <span *ngFor="let star of [1,2,3,4,5]" 
                      class="star" 
                      [class.active]="star <= review.rating">★</span>
              </div>
            </div>
            <div class="review-actions" *ngIf="canEditReview(review) && editingReview?.id !== review.id">
              <button (click)="editReview(review)">Sửa</button>
              <button (click)="deleteReview(review.id)">Xóa</button>
            </div>
          </div>
          
          <!-- Edit Form -->
          <div *ngIf="editingReview?.id === review.id" class="edit-form">
            <div class="rating-input">
              <div class="stars">
                <span *ngFor="let star of [1,2,3,4,5]" 
                      class="star" 
                      [class.active]="star <= editingReview.rating"
                      (click)="editingReview.rating = star">★</span>
              </div>
            </div>
            <textarea [(ngModel)]="editingReview.comment" rows="3"></textarea>
            <div class="form-actions">
              <button (click)="updateReview()" [disabled]="!editingReview.rating">Cập nhật</button>
              <button (click)="cancelEdit()">Hủy</button>
            </div>
          </div>
          
          <!-- Review Content -->
          <div *ngIf="editingReview?.id !== review.id" class="review-content">
            <p>{{review.comment}}</p>
            <span class="review-date">{{formatDate(review.createdAt)}}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reviews-container {
      margin-top: 30px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    .reviews-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .add-review-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    .add-review-form, .edit-form {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .rating-input {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }
    .stars {
      display: flex;
      gap: 2px;
    }
    .star {
      font-size: 20px;
      color: #ddd;
      cursor: pointer;
    }
    .star.active {
      color: #ffc107;
    }
    textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 10px;
    }
    .form-actions {
      display: flex;
      gap: 10px;
    }
    .form-actions button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .form-actions button:first-child {
      background: #28a745;
      color: white;
    }
    .form-actions button:last-child {
      background: #6c757d;
      color: white;
    }
    .review-item {
      border-bottom: 1px solid #eee;
      padding: 15px 0;
    }
    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .username {
      font-weight: bold;
    }
    .review-actions {
      display: flex;
      gap: 5px;
    }
    .review-actions button {
      padding: 4px 8px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }
    .review-actions button:first-child {
      background: #ffc107;
    }
    .review-actions button:last-child {
      background: #dc3545;
      color: white;
    }
    .review-date {
      color: #666;
      font-size: 12px;
    }
    .no-reviews {
      text-align: center;
      color: #666;
      padding: 20px;
    }
  `]
})
export class ReviewsComponent implements OnInit {
  @Input() productId!: number;
  
  reviews: Review[] = [];
  newReview: CreateReviewRequest = { rating: 0, comment: '' };
  editingReview: any = null;
  showAddForm = false;
  isLoggedIn = false;
  currentUsername: string | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.authService.getCurrentUserFromToken();
      this.currentUsername = user?.username || null;
    }
    this.loadReviews();
  }

  loadReviews() {
    this.apiService.getProductReviews(this.productId).subscribe({
      next: (reviews) => this.reviews = reviews,
      error: (error) => console.error('Error loading reviews:', error)
    });
  }

  setRating(rating: number) {
    this.newReview.rating = rating;
  }

  submitReview() {
    if (!this.newReview.rating) return;
    
    this.apiService.addReview(this.productId, this.newReview).subscribe({
      next: () => {
        this.loadReviews();
        this.cancelAdd();
      },
      error: (error) => {
        if (error.error?.includes('already reviewed')) {
          alert('Bạn đã đánh giá sản phẩm này rồi!');
        } else {
          alert('Lỗi khi thêm đánh giá!');
        }
      }
    });
  }

  editReview(review: Review) {
    this.editingReview = { ...review };
  }

  updateReview() {
    this.apiService.updateReview(this.editingReview.id, {
      rating: this.editingReview.rating,
      comment: this.editingReview.comment
    }).subscribe({
      next: () => {
        this.loadReviews();
        this.cancelEdit();
      },
      error: (error) => alert('Lỗi khi cập nhật đánh giá!')
    });
  }

  deleteReview(reviewId: number) {
    if (confirm('Bạn có chắc muốn xóa đánh giá này?')) {
      this.apiService.deleteReview(reviewId).subscribe({
        next: () => this.loadReviews(),
        error: (error) => alert('Lỗi khi xóa đánh giá!')
      });
    }
  }

  canEditReview(review: Review): boolean {
    return this.isLoggedIn && this.currentUsername === review.username;
  }

  cancelAdd() {
    this.showAddForm = false;
    this.newReview = { rating: 0, comment: '' };
  }

  cancelEdit() {
    this.editingReview = null;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('vi-VN');
  }
}