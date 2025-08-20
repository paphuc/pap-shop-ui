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
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
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
    return this.http.post(`${this.baseUrl}/user/login`, {
      emailOrPhoneOrUsername: emailOrPhone,
      password: password
    }, { responseType: 'text' });
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/register`, user, { responseType: 'text' });
  }
}