import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}
