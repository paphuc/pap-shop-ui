import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error = '';
  selectedQuantity = 1;
  addingToCart = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Product ID from route:', id);
    if (id) {
      this.loadProduct(+id);
    } else {
      this.error = 'Không tìm thấy ID sản phẩm';
      this.loading = false;
    }
  }

  loadProduct(id: number): void {
    console.log('Loading product with ID:', id);
    
    // Thử không có auth trước
    this.apiService.getProduct(id).subscribe({
      next: (product) => {
        console.log('Product loaded (no auth):', product);
        this.product = product;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product (no auth):', error);
        
        // Nếu lỗi, thử với auth
        if (error.status === 401 || error.status === 403) {
          console.log('Trying with auth...');
          this.apiService.getProductWithAuth(id).subscribe({
            next: (product) => {
              console.log('Product loaded (with auth):', product);
              this.product = product;
              this.loading = false;
            },
            error: (authError) => {
              console.error('Error loading product (with auth):', authError);
              this.handleError(authError);
            }
          });
        } else {
          this.handleError(error);
        }
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

  increaseQuantity() {
    this.selectedQuantity++;
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
      error: () => {
        alert('Lỗi khi thêm vào giỏ hàng!');
        this.addingToCart = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}