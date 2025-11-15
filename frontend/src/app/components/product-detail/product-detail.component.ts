import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { ReviewsComponent } from '../reviews/reviews.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, ReviewsComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error = '';
  selectedQuantity = 1;
  addingToCart = false;
  buyingNow = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(+id);
    } else {
      this.error = 'Không tìm thấy ID sản phẩm';
      this.loading = false;
    }
  }

  loadProduct(id: number): void {
    this.apiService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  private handleError(error: any): void {
    if (error.status === 0) {
      this.error = 'Không thể kết nối đến server';
    } else if (error.status === 404) {
      this.error = 'Không tìm thấy sản phẩm';
    } else if (error.status === 401) {
      this.error = 'Cần đăng nhập để xem sản phẩm';
    } else {
      this.error = `Lỗi tải sản phẩm (${error.status}): ${error.message || 'Không xác định'}`;
    }
    this.loading = false;
  }

  getImageUrl(product: Product): string {
    // Kiểm tra images array trước
    if (product.images && product.images.length > 0 && product.images[0].imageUrl) {
      return product.images[0].imageUrl;
    }
    
    // Kiểm tra image field
    if (product.image) {
      return product.image.startsWith('http') ? product.image : `/assets/${product.image}`;
    }
    
    return '/assets/no-image.svg';
  }

  onImageError(event: any) {
    event.target.src = '/assets/no-image.svg';
  }

  increaseQuantity() {
    if (this.product && this.selectedQuantity < this.product.stock) {
      this.selectedQuantity++;
    }
  }

  decreaseQuantity() {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity--;
    }
  }

  addToCart() {
    if (!this.product || !this.product.id) return;
    
    this.addingToCart = true;
    this.cartService.addToCart(this.product.id, this.selectedQuantity).subscribe({
      next: () => {
        alert('Đã thêm vào giỏ hàng!');
        this.addingToCart = false;
      },
      error: (error) => {
        let errorMessage = 'Lỗi khi thêm vào giỏ hàng';
        
        if (error.status === 400) {
          const msg = error.error?.message || error.message;
          if (msg?.includes('không đủ hàng')) {
            errorMessage = msg; // Đã là tiếng Việt: "Sản phẩm {name} không đủ hàng"
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
        }
        
        alert(errorMessage);
        this.addingToCart = false;
      }
    });
  }

  buyNow() {
    if (!this.product || !this.product.id) return;
    
    // Kiểm tra đăng nhập
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vui lòng đăng nhập để mua hàng!');
      this.router.navigate(['/login']);
      return;
    }

    // Chuyển đến trang checkout với thông tin sản phẩm
    this.router.navigate(['/checkout'], {
      state: {
        buyNow: true,
        product: this.product,
        quantity: this.selectedQuantity
      }
    });
  }

  getStockClass(stock: number): string {
    if (stock === 0) return 'stock-out';
    if (stock <= 5) return 'stock-low';
    if (stock <= 20) return 'stock-medium';
    return 'stock-high';
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}