import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart.model';
import { CreateOrderRequest } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="checkout-container">
      <!-- Header -->
      <div class="checkout-header">
        <div class="container">
          <div class="breadcrumb">
            <a routerLink="/cart">Giỏ hàng</a>
            <span class="separator">></span>
            <span class="current">Thanh toán</span>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="checkout-content">
          <!-- Left Column -->
          <div class="checkout-left">
            <!-- Delivery Address -->
            <div class="section-card">
              <div class="section-header">
                <i class="icon-location">📍</i>
                <h3>Địa Chỉ Nhận Hàng</h3>
              </div>
              <div class="address-form">
                <div class="form-group">
                  <input type="text" placeholder="Họ và tên" class="form-input" [(ngModel)]="customerInfo.name">
                  <input type="text" placeholder="Số điện thoại" class="form-input" [(ngModel)]="customerInfo.phone">
                </div>
                <textarea 
                  [(ngModel)]="orderRequest.shippingAddress"
                  placeholder="Địa chỉ cụ thể (số nhà, tên đường, phường/xã)"
                  class="form-textarea"
                  rows="3">
                </textarea>
                <textarea 
                  [(ngModel)]="orderRequest.notes"
                  placeholder="Ghi chú cho đơn hàng (tùy chọn)"
                  class="form-textarea"
                  rows="2">
                </textarea>
              </div>
            </div>

            <!-- Products -->
            <div class="section-card">
              <div class="section-header">
                <h3>Sản Phẩm Đã Chọn</h3>
              </div>
              <!-- Mua ngay -->
              <div class="products-list" *ngIf="isBuyNow && buyNowItem">
                <div class="product-header">
                  <span class="col-product">Sản phẩm</span>
                  <span class="col-price">Đơn giá</span>
                  <span class="col-quantity">Số lượng</span>
                  <span class="col-total">Thành tiền</span>
                </div>
                <div class="product-item">
                  <div class="product-info">
                    <img [src]="buyNowItem.product.images?.[0]?.imageUrl || 'assets/no-image.svg'" 
                         [alt]="buyNowItem.product.name" class="product-image">
                    <div class="product-details">
                      <h4 class="product-name">{{buyNowItem.product.name}}</h4>
                      <p class="product-sku">SKU: {{buyNowItem.product.sku}}</p>
                    </div>
                  </div>
                  <div class="product-price">₫{{formatPrice(buyNowItem.product.price)}}</div>
                  <div class="product-quantity">{{buyNowItem.quantity}}</div>
                  <div class="product-total">₫{{formatPrice(buyNowItem.product.price * buyNowItem.quantity)}}</div>
                </div>
              </div>
              
              <!-- Từ giỏ hàng -->
              <div class="products-list" *ngIf="!isBuyNow && cart">
                <div class="product-header">
                  <span class="col-product">Sản phẩm</span>
                  <span class="col-price">Đơn giá</span>
                  <span class="col-quantity">Số lượng</span>
                  <span class="col-total">Thành tiền</span>
                </div>
                <div *ngFor="let item of cart.cartItems" class="product-item">
                  <div class="product-info">
                    <img [src]="item.product.images?.[0]?.imageUrl || 'assets/no-image.svg'" 
                         [alt]="item.product.name" class="product-image">
                    <div class="product-details">
                      <h4 class="product-name">{{item.product.name}}</h4>
                      <p class="product-sku">SKU: {{item.product.sku}}</p>
                    </div>
                  </div>
                  <div class="product-price">₫{{formatPrice(item.product.price)}}</div>
                  <div class="product-quantity">{{item.quantity}}</div>
                  <div class="product-total">₫{{formatPrice(item.product.price * item.quantity)}}</div>
                </div>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="section-card">
              <div class="section-header">
                <i class="icon-payment">💳</i>
                <h3>Phương Thức Thanh Toán</h3>
              </div>
              <div class="payment-methods">
                <label class="payment-option active">
                  <input type="radio" name="payment" value="cod" checked disabled>
                  <span class="payment-icon">💵</span>
                  <span class="payment-text">Thanh toán khi nhận hàng (COD)</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Right Column - Order Summary -->
          <div class="checkout-right">
            <div class="order-summary">
              <h3 class="summary-title">Đơn Hàng</h3>
              
              <div class="summary-row">
                <span>Tạm tính</span>
                <span>₫{{formatPrice(getSubtotal())}}</span>
              </div>
              
              <div class="summary-row">
                <span>Phí vận chuyển</span>
                <span class="free-shipping">Miễn phí</span>
              </div>
              
              <div class="voucher-section">
                <div class="voucher-input">
                  <input type="text" placeholder="Mã giảm giá" class="voucher-field">
                  <button class="voucher-btn">Áp dụng</button>
                </div>
              </div>
              
              <div class="summary-divider"></div>
              
              <div class="summary-total">
                <span>Tổng cộng</span>
                <span class="total-price">₫{{formatPrice(getTotal())}}</span>
              </div>
              
              <button 
                class="place-order-btn"
                [disabled]="!isFormValid() || isLoading"
                (click)="onSubmit()">
                <span *ngIf="isLoading">Đang xử lý...</span>
                <span *ngIf="!isLoading">Đặt Hàng</span>
              </button>
              

            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-container {
      background: #f5f5f5;
      min-height: 100vh;
    }
    
    .checkout-header {
      background: white;
      border-bottom: 1px solid #e5e5e5;
      padding: 16px 0;
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
    }
    
    .breadcrumb a {
      color: #05a;
      text-decoration: none;
    }
    
    .separator {
      color: #999;
    }
    
    .current {
      color: #ee4d2d;
      font-weight: 500;
    }
    
    .checkout-content {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 20px;
      padding: 20px 0;
    }
    
    .checkout-left {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .section-card {
      background: white;
      border-radius: 4px;
      box-shadow: 0 1px 1px rgba(0,0,0,.09);
      overflow: hidden;
    }
    
    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;
      background: #fafafa;
    }
    
    .section-header h3 {
      margin: 0;
      font-size: 18px;
      color: #333;
      text-transform: uppercase;
    }
    
    .icon-location, .icon-payment {
      font-size: 20px;
    }
    
    .address-form {
      padding: 20px;
    }
    
    .form-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 12px;
    }
    
    .form-input, .form-textarea {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      width: 100%;
      box-sizing: border-box;
    }
    
    .form-input:focus, .form-textarea:focus {
      outline: none;
      border-color: #ee4d2d;
    }
    
    .form-textarea {
      resize: vertical;
      margin-bottom: 12px;
    }
    
    .products-list {
      padding: 0;
    }
    
    .product-header {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 16px;
      padding: 16px 20px;
      background: #fafafa;
      font-weight: 500;
      color: #666;
      font-size: 14px;
    }
    
    .product-item {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 16px;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;
      align-items: center;
    }
    
    .product-info {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    
    .product-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
      border: 1px solid #f0f0f0;
    }
    
    .product-name {
      margin: 0 0 4px 0;
      font-size: 14px;
      color: #333;
      line-height: 1.4;
    }
    
    .product-sku {
      margin: 0;
      font-size: 12px;
      color: #999;
    }
    
    .product-price, .product-quantity, .product-total {
      text-align: center;
      font-size: 14px;
    }
    
    .product-total {
      color: #ee4d2d;
      font-weight: 500;
    }
    
    .payment-methods {
      padding: 20px;
    }
    
    .payment-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      margin-bottom: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .payment-option:hover:not(.disabled) {
      border-color: #ee4d2d;
      background: #fff5f5;
    }
    
    .payment-option.active {
      border-color: #ee4d2d;
      background: #fff5f5;
    }
    
    .payment-option.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .payment-option.disabled .payment-text {
      color: #999;
    }
    
    .payment-option input[type="radio"] {
      margin: 0;
    }
    
    .payment-icon {
      font-size: 20px;
    }
    
    .payment-text {
      font-size: 14px;
      color: #333;
    }
    
    .order-summary {
      background: white;
      border-radius: 4px;
      box-shadow: 0 1px 1px rgba(0,0,0,.09);
      padding: 20px;
      position: sticky;
      top: 20px;
    }
    
    .summary-title {
      margin: 0 0 20px 0;
      font-size: 18px;
      color: #333;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 14px;
    }
    
    .free-shipping {
      color: #00bfa5;
      font-weight: 500;
    }
    
    .voucher-section {
      margin: 20px 0;
    }
    
    .voucher-input {
      display: flex;
      gap: 8px;
    }
    
    .voucher-field {
      flex: 1;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .voucher-btn {
      padding: 10px 16px;
      background: #ee4d2d;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      white-space: nowrap;
    }
    
    .voucher-btn:hover {
      background: #d73211;
    }
    
    .summary-divider {
      height: 1px;
      background: #e5e5e5;
      margin: 20px 0;
    }
    
    .summary-total {
      display: flex;
      justify-content: space-between;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    
    .total-price {
      color: #ee4d2d;
    }
    
    .place-order-btn {
      width: 100%;
      padding: 16px;
      background: #ee4d2d;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
      margin-bottom: 16px;
    }
    
    .place-order-btn:hover:not(:disabled) {
      background: #d73211;
    }
    
    .place-order-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    
    @media (max-width: 768px) {
      .checkout-content {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .form-group {
        grid-template-columns: 1fr;
      }
      
      .product-header, .product-item {
        grid-template-columns: 2fr 80px 60px 100px;
        gap: 8px;
      }
      
      .product-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
      
      .product-image {
        width: 50px;
        height: 50px;
      }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  cart: Cart | null = null;
  buyNowItem: any = null;
  isBuyNow = false;
  orderRequest: CreateOrderRequest = {
    shippingAddress: '',
    notes: ''
  };
  customerInfo = {
    name: '',
    phone: ''
  };
  isLoading = false;

  constructor(
    private apiService: ApiService,
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['buyNow']) {
      // Mua ngay
      this.isBuyNow = true;
      this.buyNowItem = {
        product: navigation.extras.state['product'],
        quantity: navigation.extras.state['quantity']
      };
    } else if (navigation?.extras.state?.['selectedItems']) {
      // Từ cart với sản phẩm đã chọn
      this.cart = {
        cartItems: navigation.extras.state['selectedItems']
      } as Cart;
    }
  }

  ngOnInit() {
    if (!this.isBuyNow && !this.cart) {
      this.loadCart();
    }
  }

  loadCart() {
    this.apiService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        if (!cart.cartItems || cart.cartItems.length === 0) {
          this.router.navigate(['/cart']);
        }
      },
      error: (error) => console.error('Error loading cart:', error)
    });
  }

  getTotal(): number {
    if (this.isBuyNow && this.buyNowItem) {
      return this.buyNowItem.product.price * this.buyNowItem.quantity;
    }
    if (!this.cart?.cartItems) return 0;
    return this.cart.cartItems.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0);
  }

  getSubtotal(): number {
    return this.getTotal();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price);
  }

  isFormValid(): boolean {
    return !!(this.customerInfo.name.trim() && 
              this.customerInfo.phone.trim() && 
              this.orderRequest.shippingAddress.trim());
  }

  onSubmit() {
    if (!this.isFormValid()) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }
    
    this.isLoading = true;
    
    if (this.isBuyNow) {
      // Mua ngay: thêm vào giỏ hàng trước rồi tạo đơn
      this.cartService.addToCart(this.buyNowItem.product.id, this.buyNowItem.quantity).subscribe({
        next: () => {
          this.createOrder();
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
          
          // Xử lý thông báo lỗi cụ thể
          let errorMessage = 'Lỗi khi thêm vào giỏ hàng';
          
          if (error.status === 400) {
            const msg = error.error?.message || error.message;
            if (msg?.includes('không đủ hàng')) {
              errorMessage = msg; // Đã là tiếng Việt
            } else if (msg?.includes('Product ID is required')) {
              errorMessage = 'ID sản phẩm là bắt buộc';
            } else if (msg?.includes('Quantity is required')) {
              errorMessage = 'Số lượng là bắt buộc';
            } else if (msg?.includes('Quantity must be at least 1')) {
              errorMessage = 'Số lượng phải ít nhất là 1';
            } else {
              errorMessage = msg || 'Dữ liệu không hợp lệ';
            }
          } else if (error.status === 404) {
            const msg = error.error?.message || error.message;
            if (msg?.includes('User not found')) {
              errorMessage = 'Không tìm thấy người dùng';
            } else if (msg?.includes('Product not found')) {
              errorMessage = 'Không tìm thấy sản phẩm';
            }
          } else {
            errorMessage = error.error?.message || error.message || 'Lỗi không xác định';
          }
          
          alert(errorMessage);
          this.isLoading = false;
        }
      });
    } else {
      // Từ giỏ hàng: tạo đơn trực tiếp
      this.createOrder();
    }
  }
  
  private createOrder() {
    const fullAddress = `${this.customerInfo.name} - ${this.customerInfo.phone}\n${this.orderRequest.shippingAddress}`;
    const orderData = {
      ...this.orderRequest,
      shippingAddress: fullAddress
    };
    
    this.orderService.createOrder(orderData).subscribe({
      next: (order) => {
        this.cartService.refreshCartCount();
        alert('Đặt hàng thành công!');
        this.router.navigate(['/orders', order.id]);
      },
      error: (error) => {
        console.error('Error creating order:', error);
        
        // Xử lý các loại lỗi khác nhau
        let errorMessage = 'Đặt hàng thất bại. Vui lòng thử lại.';
        
        if (error.status === 500) {
          const msg = error.error?.message || error.message;
          if (msg?.includes('User not found')) {
            errorMessage = 'Không tìm thấy người dùng';
          } else if (msg?.includes('Cart not found')) {
            errorMessage = 'Không tìm thấy giỏ hàng';
          } else if (msg?.includes('Cart is empty')) {
            errorMessage = 'Giỏ hàng trống';
          } else {
            errorMessage = msg || 'Lỗi server';
          }
        } else if (error.status === 400) {
          const msg = error.error?.message || error.message;
          if (msg?.includes('không đủ hàng')) {
            errorMessage = msg; // Đã là tiếng Việt
          } else {
            errorMessage = msg || 'Dữ liệu không hợp lệ';
          }
        } else {
          errorMessage = error.error?.message || error.message || 'Đặt hàng thất bại';
        }
        
        // Hiển thị thông báo lỗi cụ thể
        alert(errorMessage);
        this.isLoading = false;
      }
    });
  }
}