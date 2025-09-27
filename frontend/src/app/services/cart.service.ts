import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartCount = new BehaviorSubject<number>(0);

  constructor(private apiService: ApiService) {
    this.loadCartCount();
  }

  getCartCount(): Observable<number> {
    return this.cartCount.asObservable();
  }

  addToCart(productId: number, quantity: number = 1): Observable<any> {
    return new Observable(observer => {
      this.apiService.addToCart(productId, quantity).subscribe({
        next: (response) => {
          this.loadCartCount();
          observer.next(response);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  loadCartCount() {
    this.apiService.getCartCount().subscribe({
      next: (count) => this.cartCount.next(count),
      error: () => this.cartCount.next(0)
    });
  }

  refreshCartCount() {
    this.loadCartCount();
  }
}