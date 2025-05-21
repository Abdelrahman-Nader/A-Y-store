import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, ShippingAddress, PaymentMethod } from '../models/order.model';
import { environment } from 'src/environments/environment';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(
    private http: HttpClient,
    private cartService: CartService
  ) { }

  /**
   * Create a new order
   * @param shippingAddress Shipping address
   * @param paymentMethod Payment method
   */
  createOrder(shippingAddress: ShippingAddress, paymentMethod: PaymentMethod): Observable<Order> {
    const cart = this.cartService.getCart();
    
    const orderData = {
      items: cart.items,
      totalPrice: cart.totalPrice,
      shippingAddress,
      paymentMethod,
      // In a real app, userId would come from the auth service
      userId: 1
    };

    return this.http.post<Order>(this.apiUrl, orderData);
  }

  /**
   * Get all orders for current user
   */
  getUserOrders(): Observable<Order[]> {
    // In a real app, userId would come from the auth service
    const userId = 1;
    return this.http.get<Order[]>(`${this.apiUrl}?userId=${userId}`);
  }

  /**
   * Get order by ID
   * @param id Order ID
   */
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get all orders (admin only)
   */
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  /**
   * Update order status (admin only)
   * @param id Order ID
   * @param status New status
   */
  updateOrderStatus(id: number, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}`, { status });
  }
}
