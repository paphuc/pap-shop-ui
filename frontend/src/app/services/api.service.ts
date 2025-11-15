import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Category, User } from '../models/product.model';
import { Review, CreateReviewRequest, UpdateReviewRequest } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Product APIs
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  searchProducts(name: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products/search?name=${encodeURIComponent(name)}`);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/products`, product, {
      headers: this.getAuthHeaders()
    });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/products/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      return new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Category APIs
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/category`);
  }

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/category`, category);
  }

  // User APIs
  login(emailOrPhone: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/login`, {
      emailOrPhoneOrUsername: emailOrPhone,
      password: password
    }, { 
      responseType: 'text',
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/register`, user, { responseType: 'text' });
  }

  // Forgot Password APIs
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/forgot-password`, { email }, { responseType: 'text' });
  }

  resetPasswordWithCode(token: string, newPassword: string, confirmPassword: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/reset-password`, {
      token,
      newPassword,
      confirmPassword
    }, { responseType: 'text' });
  }


  testServer(): Observable<any> {
    return this.http.get(`${this.baseUrl}/health`, { responseType: 'text' });
  }

  // Cart APIs
  getCart(): Observable<any> {
    return this.http.get(`${this.baseUrl}/cart`, {
      headers: this.getAuthHeaders()
    });
  }

  addToCart(productId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/cart/add`, 
      { productId, quantity }, 
      { headers: this.getAuthHeaders() }
    );
  }

  updateCartItem(cartItemId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/cart/items/${cartItemId}`, 
      { quantity }, 
      { headers: this.getAuthHeaders() }
    );
  }

  removeCartItem(cartItemId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cart/items/${cartItemId}`, {
      headers: this.getAuthHeaders()
    });
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cart/clear`, {
      headers: this.getAuthHeaders()
    });
  }

  getCartCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/cart/count`, {
      headers: this.getAuthHeaders()
    });
  }

  // Generic HTTP methods
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, {
      headers: this.getAuthHeaders()
    });
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // Review APIs
  getProductReviews(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/reviews/products/${productId}`);
  }

  addReview(productId: number, review: CreateReviewRequest): Observable<Review> {
    return this.http.post<Review>(`${this.baseUrl}/reviews/products/${productId}`, review, {
      headers: this.getAuthHeaders()
    });
  }

  updateReview(reviewId: number, review: UpdateReviewRequest): Observable<Review> {
    return this.http.put<Review>(`${this.baseUrl}/reviews/${reviewId}`, review, {
      headers: this.getAuthHeaders()
    });
  }

  deleteReview(reviewId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/reviews/${reviewId}`, {
      headers: this.getAuthHeaders()
    });
  }
}