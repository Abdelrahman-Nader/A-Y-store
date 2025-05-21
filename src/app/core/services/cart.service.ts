import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>({
    items: [],
    totalItems: 0,
    totalPrice: 0
  });
  public cart$: Observable<Cart> = this.cartSubject.asObservable();

  constructor() {
    // Load cart from localStorage on initialization
    this.loadCart();
  }

  /**
   * Get current cart value
   */
  getCart(): Cart {
    return this.cartSubject.value;
  }

  /**
   * Add product to cart
   * @param product Product to add
   * @param quantity Quantity to add
   * @param size Selected size (optional)
   * @param color Selected color (optional)
   */
  addToCart(product: Product, quantity: number = 1, size?: string, color?: string): void {
    const currentCart = this.getCart();
    
    // Check if product already exists in cart
    const existingItemIndex = currentCart.items.findIndex(item => 
      item.product.id === product.id && 
      item.size === size && 
      item.color === color
    );

    let updatedItems: CartItem[];

    if (existingItemIndex !== -1) {
      // Update quantity if product already exists
      updatedItems = [...currentCart.items];
      updatedItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item if product doesn't exist
      updatedItems = [...currentCart.items, { product, quantity, size, color }];
    }

    // Calculate new totals
    const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    // Update cart
    const updatedCart: Cart = {
      items: updatedItems,
      totalItems,
      totalPrice
    };

    this.cartSubject.next(updatedCart);
    this.saveCart(updatedCart);
  }

  /**
   * Update cart item quantity
   * @param index Item index
   * @param quantity New quantity
   */
  updateQuantity(index: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(index);
      return;
    }

    const currentCart = this.getCart();
    const updatedItems = [...currentCart.items];
    
    updatedItems[index].quantity = quantity;

    // Calculate new totals
    const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    // Update cart
    const updatedCart: Cart = {
      items: updatedItems,
      totalItems,
      totalPrice
    };

    this.cartSubject.next(updatedCart);
    this.saveCart(updatedCart);
  }

  /**
   * Remove item from cart
   * @param index Item index
   */
  removeItem(index: number): void {
    const currentCart = this.getCart();
    const updatedItems = currentCart.items.filter((_, i) => i !== index);

    // Calculate new totals
    const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    // Update cart
    const updatedCart: Cart = {
      items: updatedItems,
      totalItems,
      totalPrice
    };

    this.cartSubject.next(updatedCart);
    this.saveCart(updatedCart);
  }

  /**
   * Clear cart
   */
  clearCart(): void {
    const emptyCart: Cart = {
      items: [],
      totalItems: 0,
      totalPrice: 0
    };

    this.cartSubject.next(emptyCart);
    this.saveCart(emptyCart);
  }

  /**
   * Save cart to localStorage
   * @param cart Cart to save
   */
  private saveCart(cart: Cart): void {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  /**
   * Load cart from localStorage
   */
  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart) as Cart;
        this.cartSubject.next(parsedCart);
      } catch (error) {
        console.error('Error parsing cart from localStorage', error);
      }
    }
  }
}
