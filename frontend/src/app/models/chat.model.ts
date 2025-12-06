import { Product } from './product.model';

export interface ChatRequest {
  message: string;
  topK?: number;
}

export interface ChatResponse {
  answer: string;
  relatedProducts: Product[];
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  text: string;
  products?: Product[];
  timestamp: Date;
}
