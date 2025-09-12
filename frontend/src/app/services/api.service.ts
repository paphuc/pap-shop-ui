import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Category, User } from '../models/product.model';

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
    console.log('Getting product with ID:', id);
    console.log('API URL:', `${this.baseUrl}/products/${id}`);
    
    // Thử không có auth header trước
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  getProductWithAuth(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  searchProducts(name: string): Observable<Product[]> {
    const url = `${this.baseUrl}/products/search?name=${encodeURIComponent(name)}`;
    console.log('Search API URL:', url);
    // Thử không có auth header trước
    return this.http.get<Product[]>(url);
  }

  searchProductsWithAuth(name: string): Observable<Product[]> {
    const url = `${this.baseUrl}/products/search?name=${encodeURIComponent(name)}`;
    return this.http.get<Product[]>(url, {
      headers: this.getAuthHeaders()
    });
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
    const loginData = {
      emailOrPhoneOrUsername: emailOrPhone,
      password: password
    };
    console.log('Login request:', loginData);
    console.log('Login URL:', `${this.baseUrl}/user/login`);
    
    return this.http.post(`${this.baseUrl}/user/login`, loginData, { 
      responseType: 'text',
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
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

  testConnection(port: number): Observable<Product[]> {
    const testUrl = `http://localhost:${port}/api/products`;
    return this.http.get<Product[]>(testUrl);
  }

  testServer(): Observable<any> {
    return this.http.get(`${this.baseUrl}/health`, { responseType: 'text' });
  }
}