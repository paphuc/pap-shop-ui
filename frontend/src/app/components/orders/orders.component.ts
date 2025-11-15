import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ApiService } from '../../services/api.service';
import { Order, OrderStatus } from '../../models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="orders-page">
      <!-- Header -->
      <div class="page-header">
        <div class="container">
          <h1>Đơn hàng của tôi</h1>
        </div>
      </div>

      <div class="container">
        <!-- Empty State -->
        <div *ngIf="orders.length === 0" class="empty-state">
          <div class="empty-icon">📦</div>
          <h3>Chưa có đơn hàng nào</h3>
          <p>Hãy mua sắm ngay để tạo đơn hàng đầu tiên!</p>
          <a routerLink="/" class="shop-now-btn">
            Mua sắm ngay
          </a>
        </div>

        <!-- Orders List -->
        <div *ngIf="orders.length > 0" class="orders-list">
          <div *ngFor="let order of orders" class="order-card">
            <!-- Order Header -->
            <div class="order-header">
              <div class="order-info">
                <h3>Đơn hàng #{{order.id}}</h3>
                <p class="order-date">{{order.createdAt | date:'dd/MM/yyyy HH:mm'}}</p>
              </div>
              <div class="order-status">
                <span [ngClass]="getStatusClass(order.status)" class="status-badge">
                  {{getStatusText(order.status)}}
                </span>
              </div>
            </div>

            <!-- Products Preview -->
            <div class="products-preview">
              <div *ngFor="let item of order.orderItems.slice(0, 3)" class="product-preview">
                <img [src]="item.product.images?.[0]?.imageUrl || 'assets/no-image.svg'" 
                     [alt]="item.product.name" class="product-thumb">
                <div class="product-info">
                  <p class="product-name">{{item.product.name}}</p>
                  <p class="product-qty">SL: {{item.quantity}}</p>
                </div>
                <div class="product-price">
                  ₫{{formatPrice(item.quantity * item.price)}}
                </div>
              </div>
              <div *ngIf="order.orderItems.length > 3" class="more-items">
                +{{order.orderItems.length - 3}} sản phẩm khác
              </div>
            </div>

            <!-- Order Footer -->
            <div class="order-footer">
              <div class="total-section">
                <span class="total-label">Tổng tiền:</span>
                <span class="total-price">₫{{formatPrice(order.totalPrice)}}</span>
              </div>
              <div class="order-actions">
                <a [routerLink]="['/orders', order.id]" class="btn-detail">
                  Xem chi tiết
                </a>
                <button *ngIf="order.status === 'PENDING'" 
                        (click)="cancelOrder(order.id)"
                        class="btn-cancel">
                  Hủy đơn
                </button>
                <button *ngIf="order.status === 'DELIVERED'" 
                        (click)="reorderItems(order)"
                        class="btn-reorder">
                  Mua lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .orders-page {
      background: #f5f5f5;
      min-height: 100vh;
    }
    
    .page-header {
      background: white;
      padding: 20px 0;
      border-bottom: 1px solid #e5e5e5;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
    }
    
    .page-header h1 {
      margin: 0;
      font-size: 24px;
      color: #333;
      font-weight: 500;
    }
    
    .empty-state {
      text-align: center;
      padding: 80px 20px;
      background: white;
      border-radius: 8px;
      margin: 20px 0;
    }
    
    .empty-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }
    
    .empty-state h3 {
      margin: 0 0 12px 0;
      font-size: 20px;
      color: #333;
    }
    
    .empty-state p {
      margin: 0 0 24px 0;
      color: #666;
      font-size: 16px;
    }
    
    .shop-now-btn {
      display: inline-block;
      background: #ee4d2d;
      color: white;
      padding: 12px 32px;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      transition: background 0.2s;
    }
    
    .shop-now-btn:hover {
      background: #d73211;
    }
    
    .orders-list {
      margin: 20px 0;
    }
    
    .order-card {
      background: white;
      border-radius: 8px;
      margin-bottom: 16px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #f5f5f5;
      background: #fafafa;
    }
    
    .order-info h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
      color: #333;
      font-weight: 500;
    }
    
    .order-date {
      margin: 0;
      font-size: 14px;
      color: #666;
    }
    
    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
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
    
    .products-preview {
      padding: 16px 20px;
    }
    
    .product-preview {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      border-bottom: 1px solid #f5f5f5;
    }
    
    .product-preview:last-child {
      border-bottom: none;
    }
    
    .product-thumb {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
      border: 1px solid #f0f0f0;
    }
    
    .product-info {
      flex: 1;
    }
    
    .product-name {
      margin: 0 0 4px 0;
      font-size: 14px;
      color: #333;
      line-height: 1.4;
    }
    
    .product-qty {
      margin: 0;
      font-size: 12px;
      color: #999;
    }
    
    .product-price {
      font-size: 14px;
      color: #ee4d2d;
      font-weight: 500;
    }
    
    .more-items {
      text-align: center;
      padding: 12px;
      color: #666;
      font-size: 14px;
      background: #f9f9f9;
      border-radius: 4px;
      margin-top: 8px;
    }
    
    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-top: 1px solid #f5f5f5;
      background: #fafafa;
    }
    
    .total-section {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .total-label {
      font-size: 14px;
      color: #666;
    }
    
    .total-price {
      font-size: 18px;
      color: #ee4d2d;
      font-weight: 600;
    }
    
    .order-actions {
      display: flex;
      gap: 12px;
    }
    
    .btn-detail, .btn-cancel, .btn-reorder {
      padding: 8px 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }
    
    .btn-detail {
      background: white;
      color: #666;
    }
    
    .btn-detail:hover {
      background: #f5f5f5;
      border-color: #ccc;
    }
    
    .btn-cancel {
      background: white;
      color: #ff4757;
      border-color: #ff4757;
    }
    
    .btn-cancel:hover {
      background: #ff4757;
      color: white;
    }
    
    .btn-reorder {
      background: #ee4d2d;
      color: white;
      border-color: #ee4d2d;
    }
    
    .btn-reorder:hover {
      background: #d73211;
      border-color: #d73211;
    }
    
    @media (max-width: 768px) {
      .order-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
      
      .order-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
      
      .order-actions {
        width: 100%;
        justify-content: space-between;
      }
    }
  `]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getUserOrders().subscribe({
      next: (orders) => this.orders = orders,
      error: (error) => console.error('Error loading orders:', error)
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

  cancelOrder(orderId: number) {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.updateOrderStatus(orderId, OrderStatus.CANCELED).subscribe({
        next: () => this.loadOrders(),
        error: (error) => console.error('Error canceling order:', error)
      });
    }
  }

  reorderItems(order: Order) {
    if (!order.orderItems || order.orderItems.length === 0) {
      alert('Không có sản phẩm để mua lại!');
      return;
    }

    if (confirm(`Bạn có muốn thêm ${order.orderItems.length} sản phẩm từ đơn hàng #${order.id} vào giỏ hàng?`)) {
      // Thêm từng sản phẩm vào giỏ hàng
      let completedRequests = 0;
      const totalRequests = order.orderItems.length;
      let hasError = false;

      order.orderItems.forEach(item => {
        this.apiService.addToCart(item.product.id, item.quantity).subscribe({
          next: () => {
            completedRequests++;
            if (completedRequests === totalRequests && !hasError) {
              alert('Đã thêm tất cả sản phẩm vào giỏ hàng!');
            }
          },
          error: (error) => {
            hasError = true;
            console.error('Error adding item to cart:', error);
            alert(`Lỗi khi thêm sản phẩm "${item.product.name}" vào giỏ hàng!`);
          }
        });
      });
    }
  }
}