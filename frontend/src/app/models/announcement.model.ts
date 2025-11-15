export interface Announcement {
  id: number;
  title: string;
  message: string;
  productId?: number;
  productName?: string;
  isActive: boolean;
  createdAt: string;
}