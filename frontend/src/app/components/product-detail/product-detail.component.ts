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

  goBack(): void {
    this.router.navigate(['/']);
  }
}