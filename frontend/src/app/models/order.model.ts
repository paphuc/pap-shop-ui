import { Product, User } from './product.model';

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  user: User;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  shippingAddress: string;
  notes?: string;
  orderItems: OrderItem[];
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED'
}

export interface CreateOrderRequest {
  shippingAddress: string;
  notes?: string;
}