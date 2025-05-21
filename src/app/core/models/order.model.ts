import { CartItem } from './cart.model';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  CASH_ON_DELIVERY = 'cash_on_delivery',
  INSTA_PAY = 'insta_pay',
  VODAFONE_CASH = 'vodafone_cash'
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  totalPrice: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
