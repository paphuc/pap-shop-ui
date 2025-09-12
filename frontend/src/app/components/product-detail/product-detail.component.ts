import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
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

  goBack(): void {
    this.router.navigate(['/']);
  }
}