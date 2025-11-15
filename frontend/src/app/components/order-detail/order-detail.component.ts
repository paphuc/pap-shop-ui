import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus } from '../../models/order.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="order-detail-page">
      <!-- Header -->
      <div class="page-header">
        <div class="container">
          <div class="breadcrumb">
            <a routerLink="/orders">Đơn hàng của tôi</a>
            <span>></span>
            <span>Chi tiết đơn hàng</span>
          </div>
        </div>
      </div>

      <div class="container" *ngIf="order">
        <!-- Order Status Card -->
        <div class="status-card">
          <div class="status-header">
            <div class="order-info">
              <h2>MÃ ĐƠN HÀNG: {{order.id}}</h2>
              <p>Đặt lúc {{order.createdAt | date:'HH:mm dd-MM-yyyy'}}</p>
            </div>
            <div class="status-badge" [ngClass]="getStatusClass(order.status)">
              {{getStatusText(order.status)}}
            </div>
          </div>
          
          <!-- Progress Bar -->
          <div class="progress-bar">
            <div class="progress-step" [class.active]="order.status !== 'CANCELED'">
              <div class="step-circle">📋</div>
              <span>Đơn hàng đã đặt</span>
            </div>
            <div class="progress-step" [class.active]="['PROCESSING','SHIPPED','DELIVERED'].includes(order.status)">
              <div class="step-circle">📦</div>
              <span>Đã xác nhận</span>
            </div>
            <div class="progress-step" [class.active]="['SHIPPED','DELIVERED'].includes(order.status)">
              <div class="step-circle">🚚</div>
              <span>Đang giao</span>
            </div>
            <div class="progress-step" [class.active]="order.status === 'DELIVERED'">
              <div class="step-circle">✅</div>
              <span>Đã giao</span>
            </div>
          </div>
        </div>

        <!-- Products Card -->
        <div class="products-card">
          <div class="card-header">
            <h3>🛍️ Sản phẩm</h3>
          </div>
          <div class="products-list">
            <div *ngFor="let item of order.orderItems" class="product-row">
              <div class="product-main">
                <img [src]="item.product.images?.[0]?.imageUrl || 'assets/no-image.svg'" 
                     [alt]="item.product.name" class="product-img">
                <div class="product-details">
                  <h4>{{item.product.name}}</h4>
                  <p class="sku">SKU: {{item.product.sku}}</p>
                  <div class="price-qty">
                    <span class="unit-price">₫{{formatPrice(item.price)}}</span>
                    <span class="qty">SL: {{item.quantity}}</span>
                  </div>
                </div>
              </div>
              <div class="product-total">
                ₫{{formatPrice(item.quantity * item.price)}}
              </div>
            </div>
          </div>
          
          <!-- Order Total -->
          <div class="order-summary">
            <div class="summary-row">
              <span>Tạm tính</span>
              <span>₫{{formatPrice(order.totalPrice)}}</span>
            </div>
            <div class="summary-row">
              <span>Phí vận chuyển</span>
              <span class="free">Miễn phí</span>
            </div>
            <div class="summary-total">
              <span>Thành tiền</span>
              <span>₫{{formatPrice(order.totalPrice)}}</span>
            </div>
          </div>
        </div>

        <!-- Delivery Info -->
        <div class="delivery-card">
          <div class="card-header">
            <h3>🚚 Thông tin vận chuyển</h3>
          </div>
          <div class="delivery-info">
            <div class="info-row">
              <strong>Địa chỉ nhận hàng:</strong>
              <p>{{order.shippingAddress}}</p>
            </div>
            <div class="info-row" *ngIf="order.notes">
              <strong>Ghi chú:</strong>
              <p>{{order.notes}}</p>
            </div>
            <div class="info-row">
              <strong>Phương thức thanh toán:</strong>
              <p>💵 Thanh toán khi nhận hàng (COD)</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button class="btn-back" (click)="goBack()">
            ← Quay lại đơn hàng
          </button>
          <button *ngIf="order.status === 'PENDING'" 
                  class="btn-cancel" 
                  (click)="cancelOrder()">
            Hủy đơn hàng
          </button>
        </div>
      </div>

      <div *ngIf="!order" class="loading-state">
        <div class="loading-spinner">⏳</div>
        <p>Đang tải thông tin đơn hàng...</p>
      </div>
    </div>
  `,
  styles: [`
    .order-detail-page {
      background: #f5f5f5;
      min-height: 100vh;
    }
    
    .page-header {
      background: white;
      padding: 12px 0;
      border-bottom: 1px solid #e5e5e5;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
    }
    
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #666;
    }
    
    .breadcrumb a {
      color: #05a;
      text-decoration: none;
    }
    
    .breadcrumb a:hover {
      text-decoration: underline;
    }
    
    .status-card {
      background: white;
      margin: 16px 0;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 1px 1px rgba(0,0,0,.09);
    }
    
    .status-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #f5f5f5;
    }
    
    .order-info h2 {
      margin: 0 0 4px 0;
      font-size: 16px;
      color: #333;
      font-weight: 500;
    }
    
    .order-info p {
      margin: 0;
      font-size: 14px;
      color: #666;
    }
    
    .status-badge {
      padding: 6px 12px;
      border-radius: 2px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }
    
    .status-pending {
      background: #fff3cd;
      color: #856404;
    }
    
    .status-processing {
      background: #cce5ff;
      color: #004085;
    }
    
    .status-shipped {
      background: #e2e3ff;
      color: #383d41;
    }
    
    .status-delivered {
      background: #d4edda;
      color: #155724;
    }
    
    .status-canceled {
      background: #f8d7da;
      color: #721c24;
    }
    
    .progress-bar {
      display: flex;
      padding: 24px;
      position: relative;
    }
    
    .progress-bar::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 10%;
      right: 10%;
      height: 2px;
      background: #e5e5e5;
      transform: translateY(-50%);
    }
    
    .progress-step {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      z-index: 2;
    }
    
    .step-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      margin-bottom: 8px;
      transition: all 0.3s;
    }
    
    .progress-step.active .step-circle {
      background: #ee4d2d;
      color: white;
    }
    
    .progress-step span {
      font-size: 12px;
      color: #666;
      text-align: center;
    }
    
    .progress-step.active span {
      color: #ee4d2d;
      font-weight: 500;
    }
    
    .products-card, .delivery-card {
      background: white;
      margin: 16px 0;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 1px 1px rgba(0,0,0,.09);
    }
    
    .card-header {
      padding: 16px 24px;
      border-bottom: 1px solid #f5f5f5;
      background: #fafafa;
    }
    
    .card-header h3 {
      margin: 0;
      font-size: 16px;
      color: #333;
      font-weight: 500;
    }
    
    .product-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid #f5f5f5;
    }
    
    .product-row:last-child {
      border-bottom: none;
    }
    
    .product-main {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }
    
    .product-img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
      border: 1px solid #f0f0f0;
    }
    
    .product-details h4 {
      margin: 0 0 4px 0;
      font-size: 14px;
      color: #333;
      line-height: 1.4;
    }
    
    .sku {
      margin: 0 0 8px 0;
      font-size: 12px;
      color: #999;
    }
    
    .price-qty {
      display: flex;
      gap: 16px;
      font-size: 12px;
    }
    
    .unit-price {
      color: #666;
    }
    
    .qty {
      color: #999;
    }
    
    .product-total {
      font-size: 14px;
      color: #ee4d2d;
      font-weight: 500;
    }
    
    .order-summary {
      padding: 16px 24px;
      border-top: 1px solid #f5f5f5;
      background: #fafafa;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
    }
    
    .summary-row .free {
      color: #00bfa5;
    }
    
    .summary-total {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      font-weight: 600;
      color: #ee4d2d;
      padding-top: 8px;
      border-top: 1px solid #e5e5e5;
    }
    
    .delivery-info {
      padding: 20px 24px;
    }
    
    .info-row {
      margin-bottom: 16px;
    }
    
    .info-row:last-child {
      margin-bottom: 0;
    }
    
    .info-row strong {
      display: block;
      margin-bottom: 4px;
      font-size: 14px;
      color: #333;
    }
    
    .info-row p {
      margin: 0;
      font-size: 14px;
      color: #666;
      line-height: 1.5;
    }
    
    .action-buttons {
      display: flex;
      justify-content: space-between;
      margin: 24px 0;
      gap: 12px;
    }
    
    .btn-back, .btn-cancel {
      padding: 12px 24px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn-back {
      background: white;
      color: #666;
    }
    
    .btn-back:hover {
      background: #f5f5f5;
      border-color: #ccc;
    }
    
    .btn-cancel {
      background: #ff4757;
      color: white;
      border-color: #ff4757;
    }
    
    .btn-cancel:hover {
      background: #ff3742;
      border-color: #ff3742;
    }
    
    .loading-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    
    .loading-spinner {
      font-size: 24px;
      margin-bottom: 12px;
    }
    
    @media (max-width: 768px) {
      .status-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
      
      .progress-bar {
        flex-wrap: wrap;
        gap: 16px;
      }
      
      .product-main {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
      
      .action-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  orderId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.orderId = +params['id'];
      this.loadOrder();
    });
  }

  loadOrder() {
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (order) => this.order = order,
      error: (error) => console.error('Error loading order:', error)
    });
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PENDING:
        return 'status-pending';
      case OrderStatus.PROCESSING:
        return 'status-processing';
      case OrderStatus.SHIPPED:
        return 'status-shipped';
      case OrderStatus.DELIVERED:
        return 'status-delivered';
      case OrderStatus.CANCELED:
        return 'status-canceled';
      default:
        return 'status-pending';
    }
  }

  getStatusText(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PENDING:
        return 'Chờ xử lý';
      case OrderStatus.PROCESSING:
        return 'Đang xử lý';
      case OrderStatus.SHIPPED:
        return 'Đang giao hàng';
      case OrderStatus.DELIVERED:
        return 'Đã giao hàng';
      case OrderStatus.CANCELED:
        return 'Đã hủy';
      default:
        return status;
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price);
  }

  isStepActive(step: string): boolean {
    return this.order?.status === step;
  }

  isStepCompleted(step: string): boolean {
    if (!this.order) return false;
    const steps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const currentIndex = steps.indexOf(this.order.status);
    const stepIndex = steps.indexOf(step);
    return stepIndex < currentIndex;
  }

  goBack(): void {
    window.history.back();
  }

  cancelOrder() {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.updateOrderStatus(this.orderId, OrderStatus.CANCELED).subscribe({
        next: () => this.loadOrder(),
        error: (error) => console.error('Error canceling order:', error)
      });
    }
  }
}