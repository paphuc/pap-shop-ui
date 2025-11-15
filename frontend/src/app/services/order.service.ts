import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Order, CreateOrderRequest, OrderStatus } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private apiService: ApiService) { }

  createOrder(request: CreateOrderRequest): Observable<Order> {
    return this.apiService.post<Order>('/orders', request);
  }

  getUserOrders(): Observable<Order[]> {
    return this.apiService.get<Order[]>('/orders');
  }

  getOrderById(orderId: number): Observable<Order> {
    return this.apiService.get<Order>(`/orders/${orderId}`);
  }

  updateOrderStatus(orderId: number, status: OrderStatus): Observable<Order> {
    return this.apiService.put<Order>(`/orders/${orderId}/status?status=${status}`, {});
  }
}