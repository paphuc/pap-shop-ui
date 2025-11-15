import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthTimeoutService {
  private timeoutId: any;
  private readonly TIMEOUT_DURATION = 24 * 60 * 60 * 1000; // 24 giờ

  constructor(private router: Router) {}

  startTimeout() {
    this.clearTimeout();
    this.timeoutId = setTimeout(() => {
      this.logout();
    }, this.TIMEOUT_DURATION);
  }

  clearTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  private logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
    alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
  }
}