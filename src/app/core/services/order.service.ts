import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, ShippingAddress, PaymentMethod } from '../models/order.model';
import { environment } from 'src/environments/environment';
import { CartService } from './cart.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  /**
   * Create a new order
   * @param shippingAddress Shipping address
   * @param paymentMethod Payment method
   */
  createOrder(shippingAddress: ShippingAddress, paymentMethod: PaymentMethod): Observable<Order> {
    const cart = this.cartService.getCart();

    const orderData = {
      items: cart.items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        sizeId: item.size ? parseInt(item.size) : null,
        colorId: item.color ? parseInt(item.color) : null
      })),
      paymentMethod,
      shippingAddress
    };

    const options = { headers: this.getHeaders() };
    return this.http.post<Order>(this.apiUrl, orderData, options);
  }

  /**
   * Get all orders for current user
   */
  getUserOrders(): Observable<Order[]> {
    const options = { headers: this.getHeaders() };
    return this.http.get<Order[]>(this.apiUrl, options);
  }

  /**
   * Get order by ID
   * @param id Order ID
   */
  getOrderById(id: number): Observable<Order> {
    const options = { headers: this.getHeaders() };
    return this.http.get<Order>(`${this.apiUrl}/${id}`, options);
  }

  /**
   * Get all orders (admin only)
   */
  getAllOrders(): Observable<Order[]> {
    const options = { headers: this.getHeaders() };
    return this.http.get<Order[]>(this.apiUrl, options);
  }

  /**
   * Update order status (admin only)
   * @param id Order ID
   * @param status New status
   */
  updateOrderStatus(id: number, status: string): Observable<Order> {
    const options = { headers: this.getHeaders() };
    return this.http.put<Order>(`${this.apiUrl}/${id}/status`, { status }, options);
  }
}
