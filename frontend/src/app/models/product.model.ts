export interface Product {
  id?: number;
  name: string;
  price: number;
  description?: string;
  categoryId: number;
  quantity?: number;
}

export interface Category {
  id?: number;
  name: string;
  description?: string;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}