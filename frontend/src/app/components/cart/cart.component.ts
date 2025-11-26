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
    <div class="min-h-screen bg-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex items-center justify-between mb-12 pb-6 border-b border-gray-200">
          <h1 class="text-4xl font-light text-black tracking-tight">Giỏ hàng</h1>
          <button 
            class="luxury-btn bg-white text-black px-6 py-3 text-sm font-medium"
            (click)="goBack()">
            ← Tiếp tục mua sắm
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="flex items-center justify-center py-16">
          <div class="animate-spin w-6 h-6 border-2 border-gray-300 border-t-black rounded-full"></div>
          <span class="ml-3 text-gray-600 text-sm">Đang tải...</span>
        </div>

        <!-- Error State -->
        <div *ngIf="error" class="luxury-card p-6 mb-8">
          <p class="text-sm text-gray-900">{{ error }}</p>
        </div>

        <!-- Cart Content -->
        <div *ngIf="!loading && !error">
          <div *ngIf="cart && cart.cartItems.length > 0; else emptyCart" class="lg:grid lg:grid-cols-12 lg:gap-8">
            <!-- Cart Items -->
            <div class="lg:col-span-8">
              <div class="bg-white">
                <!-- Select All Header -->
                <div class="px-6 py-4 border-b border-gray-200">
                  <label class="flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      [checked]="selectAll" 
                      (change)="toggleSelectAll()"
                      class="w-4 h-4 text-black border border-gray-300 rounded-sm">
                    <span class="ml-3 text-sm font-medium text-gray-900">
                      Chọn tất cả ({{cart.cartItems.length}} sản phẩm)
                    </span>
                  </label>
                </div>
                
                <!-- Cart Items List -->
                <div class="divide-y divide-gray-200">
                  <div *ngFor="let item of cart.cartItems" class="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div class="flex items-center space-x-4">
                      <!-- Checkbox -->
                      <label class="cursor-pointer">
                        <input 
                          type="checkbox" 
                          [checked]="isItemSelected(item.id)"
                          (change)="toggleSelectItem(item.id)"
                          class="w-4 h-4 text-black border border-gray-300 rounded-sm">
                      </label>
                      
                      <!-- Product Image -->
                      <div class="flex-shrink-0 w-20 h-20 bg-gray-50 overflow-hidden">
                        <img 
                          [src]="getProductImage(item.product)" 
                          [alt]="item.product.name"
                          class="w-full h-full object-cover">
                      </div>
                      
                      <!-- Product Info -->
                      <div class="flex-1 min-w-0">
                        <h3 class="text-base font-medium text-black truncate">{{ item.product.name }}</h3>
                        <p class="text-sm text-gray-600 mt-1">{{ formatPrice(item.product.price) }}</p>
                      </div>
                      
                      <!-- Quantity Controls -->
                      <div class="flex items-center space-x-2">
                        <button 
                          (click)="updateQuantity(item, item.quantity - 1)" 
                          [disabled]="item.quantity <= 1"
                          class="luxury-btn w-8 h-8 bg-white text-black text-sm disabled:opacity-50">
                          -
                        </button>
                        <span class="w-8 text-center text-sm text-black">{{ item.quantity }}</span>
                        <button 
                          (click)="updateQuantity(item, item.quantity + 1)"
                          class="luxury-btn w-8 h-8 bg-white text-black text-sm">
                          +
                        </button>
                      </div>
                      
                      <!-- Item Total -->
                      <div class="text-right">
                        <p class="text-base font-medium text-black">{{ formatPrice(item.product.price * item.quantity) }}</p>
                      </div>
                      
                      <!-- Remove Button -->
                      <button 
                        (click)="removeItem(item)"
                        class="w-8 h-8 text-gray-400 hover:text-black transition-colors duration-200">
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Order Summary -->
            <div class="lg:col-span-4 mt-8 lg:mt-0">
              <div class="luxury-card luxury-shadow bg-white p-6 sticky top-8">
                <h2 class="text-lg font-medium text-black mb-6 border-b border-gray-200 pb-3">Tóm tắt đơn hàng</h2>
                
                <div class="space-y-3 mb-6">
                  <div class="flex justify-between text-sm text-gray-600">
                    <span>Đã chọn:</span>
                    <span>{{getSelectedCount()}} sản phẩm</span>
                  </div>
                  <div class="border-t border-gray-200 pt-3">
                    <div class="flex justify-between items-center">
                      <span class="text-base font-medium text-black">Tổng cộng:</span>
                      <span class="text-xl font-semibold text-black">{{ formatPrice(getSelectedTotal()) }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="space-y-3">
                  <button 
                    class="luxury-btn-accent w-full py-3 px-6 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    [disabled]="getSelectedCount() === 0"
                    (click)="goToCheckout()">
                    Thanh toán ({{getSelectedCount()}})
                  </button>
                  <button 
                    class="luxury-btn w-full bg-white text-black py-2 px-6 text-sm font-medium"
                    (click)="clearCart()">
                    Xóa tất cả
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty Cart -->
          <ng-template #emptyCart>
            <div class="text-center py-20">
              <div class="mx-auto w-16 h-16 bg-gray-100 flex items-center justify-center mb-6">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z"></path>
                </svg>
              </div>
              <h2 class="text-2xl font-light text-black mb-2">Giỏ hàng trống</h2>
              <p class="text-gray-600 mb-8 max-w-md mx-auto">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
              <button 
                class="luxury-btn-accent px-8 py-3 text-sm font-medium"
                (click)="goBack()">
                Mua sắm ngay
              </button>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: []
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