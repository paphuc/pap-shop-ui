import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): any {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        username: payload.sub,
        email: payload.email,
        roles: payload.scope
      };
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.scope?.includes('ADMIN') || false;
    } catch {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Admin endpoints
  createRole(role: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/role`, role, { 
      headers: this.getAuthHeaders() 
    });
  }

  createCategory(category: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/category`, category, { 
      headers: this.getAuthHeaders() 
    });
  }

  updateRole(role: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/role/update`, role, { 
      headers: this.getAuthHeaders() 
    });
  }
}