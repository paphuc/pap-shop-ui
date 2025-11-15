import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Cart, CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cart-container">
      <div class="cart-header">
        <h1>Giỏ hàng của bạn</h1>
        <button class="back-btn" (click)="goBack()">← Tiếp tục mua sắm</button>
      </div>

      <div *ngIf="loading" class="loading">Đang tải...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <div *ngIf="!loading && !error">
        <div *ngIf="cart && cart.cartItems.length > 0; else emptyCart" class="cart-content">
          <div class="cart-items">
            <!-- Header với checkbox chọn tất cả -->
            <div class="cart-header-row">
              <label class="select-all">
                <input type="checkbox" 
                       [checked]="selectAll" 
                       (change)="toggleSelectAll()">
                <span>Chọn tất cả ({{cart.cartItems.length}} sản phẩm)</span>
              </label>
            </div>
            
            <div *ngFor="let item of cart.cartItems" class="cart-item">
              <label class="item-checkbox">
                <input type="checkbox" 
                       [checked]="isItemSelected(item.id)"
                       (change)="toggleSelectItem(item.id)">
              </label>
              <div class="item-image">
                <img [src]="getProductImage(item.product)" [alt]="item.product.name">
              </div>
              <div class="item-info">
                <h3>{{ item.product.name }}</h3>
                <p class="item-price">{{ formatPrice(item.product.price) }}</p>
              </div>
              <div class="item-quantity">
                <button (click)="updateQuantity(item, item.quantity - 1)" [disabled]="item.quantity <= 1">-</button>
                <span>{{ item.quantity }}</span>
                <button (click)="updateQuantity(item, item.quantity + 1)">+</button>
              </div>
              <div class="item-total">
                {{ formatPrice(item.product.price * item.quantity) }}
              </div>
              <button class="remove-btn" (click)="removeItem(item)">×</button>
            </div>
          </div>
          
          <div class="cart-summary">
            <div class="summary-info">
              <p>Đã chọn: {{getSelectedCount()}} sản phẩm</p>
            </div>
            <div class="summary-row">
              <span>Tổng thanh toán:</span>
              <span class="total-price">{{ formatPrice(getSelectedTotal()) }}</span>
            </div>
            <div class="cart-actions">
              <button class="clear-btn" (click)="clearCart()">Xóa tất cả</button>
              <button class="checkout-btn" 
                      [disabled]="getSelectedCount() === 0"
                      (click)="goToCheckout()">
                Mua hàng ({{getSelectedCount()}})
              </button>
            </div>
          </div>
        </div>

        <ng-template #emptyCart>
          <div class="empty-cart">
            <h2>Giỏ hàng trống</h2>
            <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
            <button class="shop-btn" (click)="goBack()">Mua sắm ngay</button>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    .back-btn {
      background: #6c757d;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
    }
    .cart-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 30px;
    }
    .cart-header-row {
      padding: 15px 20px;
      border-bottom: 1px solid #eee;
      background: #f8f9fa;
    }
    .select-all {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      font-weight: 500;
    }
    .cart-item {
      display: grid;
      grid-template-columns: 40px 80px 1fr 120px 100px 40px;
      gap: 15px;
      align-items: center;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      margin-bottom: 15px;
    }
    .item-checkbox {
      display: flex;
      justify-content: center;
      cursor: pointer;
    }
    .item-checkbox input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
    .item-image img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 5px;
    }
    .item-quantity {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .item-quantity button {
      width: 30px;
      height: 30px;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
    }
    .cart-summary {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      height: fit-content;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      font-size: 18px;
      font-weight: bold;
    }
    .cart-actions {
      display: flex;
      gap: 10px;
      flex-direction: column;
    }
    .checkout-btn {
      background: #28a745;
      color: white;
      border: none;
      padding: 15px;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
    }
    .checkout-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    .summary-info {
      margin-bottom: 10px;
      color: #666;
      font-size: 14px;
    }
    .summary-info p {
      margin: 0;
    }
    .clear-btn {
      background: #dc3545;
      color: white;
      border: none;
      padding: 10px;
      border-radius: 5px;
      cursor: pointer;
    }
    .remove-btn {
      background: #dc3545;
      color: white;
      border: none;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
    }
    .empty-cart {
      text-align: center;
      padding: 60px 20px;
    }
    .shop-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      margin-top: 20px;
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
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  loading = true;
  error = '';
  selectedItems: Set<number> = new Set();
  selectAll = false;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.loading = true;
    this.apiService.getCart().subscribe({
      next: (data) => {
        this.cart = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        if (error.status === 404) {
          this.error = 'Không tìm thấy người dùng';
        } else {
          this.error = 'Không thể tải giỏ hàng';
        }
        this.loading = false;
      }
    });
  }

  updateQuantity(item: CartItem, newQuantity: number) {
    if (newQuantity < 1) return;
    
    this.apiService.updateCartItem(item.id, newQuantity).subscribe({
      next: (data) => {
        this.cart = data;
      },
      error: (error) => {
        console.error('Error updating quantity:', error);
        let errorMessage = 'Lỗi cập nhật số lượng';
        
        if (error.status === 400) {
          const msg = error.error?.message || error.message;
          if (msg?.includes('không đủ hàng')) {
            errorMessage = msg; // Đã là tiếng Việt
          } else if (msg?.includes('Cart item does not belong to user')) {
            errorMessage = 'Sản phẩm không thuộc về người dùng này';
          } else if (msg?.includes('Quantity must be at least 1')) {
            errorMessage = 'Số lượng phải ít nhất là 1';
          }
        } else if (error.status === 404) {
          const msg = error.error?.message || error.message;
          if (msg?.includes('Cart item not found')) {
            errorMessage = 'Không tìm thấy sản phẩm trong giỏ hàng';
          } else if (msg?.includes('User not found')) {
            errorMessage = 'Không tìm thấy người dùng';
          }
        }
        
        alert(errorMessage);
      }
    });
  }

  removeItem(item: CartItem) {
    this.apiService.removeCartItem(item.id).subscribe({
      next: (data) => {
        this.cart = data;
      },
      error: (error) => {
        console.error('Error removing item:', error);
        let errorMessage = 'Lỗi xóa sản phẩm';
        
        if (error.status === 400) {
          const msg = error.error?.message || error.message;
          if (msg?.includes('Cart item does not belong to user')) {
            errorMessage = 'Sản phẩm không thuộc về người dùng này';
          }
        } else if (error.status === 404) {
          const msg = error.error?.message || error.message;
          if (msg?.includes('Cart item not found')) {
            errorMessage = 'Không tìm thấy sản phẩm trong giỏ hàng';
          } else if (msg?.includes('User not found')) {
            errorMessage = 'Không tìm thấy người dùng';
          }
        }
        
        alert(errorMessage);
      }
    });
  }

  clearCart() {
    if (confirm('Bạn có chắc muốn xóa tất cả sản phẩm?')) {
      this.apiService.clearCart().subscribe({
        next: () => {
          this.loadCart();
        },
        error: (error) => {
          console.error('Error clearing cart:', error);
          let errorMessage = 'Lỗi xóa giỏ hàng';
          
          if (error.status === 404) {
            errorMessage = 'Không tìm thấy người dùng';
          }
          
          alert(errorMessage);
        }
      });
    }
  }

  getTotalPrice(): number {
    if (!this.cart) return 0;
    return this.cart.cartItems.reduce((total, item) => 
      total + (item.product.price * item.quantity), 0
    );
  }

  getProductImage(product: any): string {
    if (product.images && product.images.length > 0 && product.images[0].imageUrl) {
      return product.images[0].imageUrl;
    }
    return product.image || '/assets/no-image.svg';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }

  goBack() {
    this.router.navigate(['/']);
  }

  toggleSelectAll() {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.cart?.cartItems.forEach(item => this.selectedItems.add(item.id));
    } else {
      this.selectedItems.clear();
    }
  }

  toggleSelectItem(itemId: number) {
    if (this.selectedItems.has(itemId)) {
      this.selectedItems.delete(itemId);
    } else {
      this.selectedItems.add(itemId);
    }
    this.updateSelectAllState();
  }

  updateSelectAllState() {
    if (!this.cart) return;
    this.selectAll = this.cart.cartItems.length > 0 && 
                    this.cart.cartItems.every(item => this.selectedItems.has(item.id));
  }

  isItemSelected(itemId: number): boolean {
    return this.selectedItems.has(itemId);
  }

  getSelectedTotal(): number {
    if (!this.cart) return 0;
    return this.cart.cartItems
      .filter(item => this.selectedItems.has(item.id))
      .reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  getSelectedCount(): number {
    return this.selectedItems.size;
  }

  goToCheckout() {
    if (this.selectedItems.size === 0) {
      alert('Vui lòng chọn sản phẩm để đặt hàng!');
      return;
    }
    
    // Truyền thông tin các sản phẩm đã chọn
    const selectedCartItems = this.cart?.cartItems.filter(item => 
      this.selectedItems.has(item.id)
    ) || [];
    
    this.router.navigate(['/checkout'], {
      state: {
        selectedItems: selectedCartItems
      }
    });
  }
}