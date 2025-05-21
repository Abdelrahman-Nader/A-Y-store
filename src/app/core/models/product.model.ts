export interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  quantity: number;
  sizes?: string[];
  colors?: string[];
  featured?: boolean;
  newArrival?: boolean;
  discount?: number;
  rating?: number;
}
