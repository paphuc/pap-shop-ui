export interface ProductImage {
  id: number;
  imageUrl?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  categoryId?: number;
  quantity?: number;
  stock: number;
  sku: string;
  category: { name: string; id: number };
  images?: ProductImage[];
  image?: string;
  specifications?: { [key: string]: string };
  rating?: number;
  reviews?: number;
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