import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/core/services/cart.service';
import { Cart } from 'src/app/core/models/cart.model';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss']
})
export class CartListComponent implements OnInit {
  cart: Cart = {
    items: [],
    totalItems: 0,
    totalPrice: 0
  };

  constructor(
    public cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  updateQuantity(index: number, quantity: number): void {
    this.cartService.updateQuantity(index, quantity);
  }

  removeItem(index: number): void {
    this.cartService.removeItem(index);
  }

  clearCart(): void {
    if (confirm('هل أنت متأكد من رغبتك في إفراغ سلة التسوق؟')) {
      this.cartService.clearCart();
    }
  }

  proceedToCheckout(): void {
    this.router.navigate(['/cart/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}
