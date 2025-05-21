import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from 'src/app/core/services/cart.service';
import { OrderService } from 'src/app/core/services/order.service';
import { Cart } from 'src/app/core/models/cart.model';
import { PaymentMethod } from 'src/app/core/models/order.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cart: Cart = {
    items: [],
    totalItems: 0,
    totalPrice: 0
  };

  shippingForm: FormGroup;
  paymentMethod: PaymentMethod = PaymentMethod.CASH_ON_DELIVERY;
  paymentMethods = PaymentMethod;

  loading = false;
  orderPlaced = false;
  error = false;

  // Step tracking
  currentStep = 1;
  totalSteps = 3;

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.shippingForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      country: ['مصر', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^01[0-2,5]{1}[0-9]{8}$')]]
    });
  }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;

      // Redirect to cart if empty
      if (cart.items.length === 0 && !this.orderPlaced) {
        this.router.navigate(['/cart']);
      }
    });
  }

  get f() { return this.shippingForm.controls; }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      // Validate shipping form before proceeding to payment
      if (this.currentStep === 1 && this.shippingForm.invalid) {
        Object.keys(this.shippingForm.controls).forEach(key => {
          const control = this.shippingForm.get(key);
          if (control) {
            control.markAsTouched();
          }
        });
        return;
      }

      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  selectPaymentMethod(method: PaymentMethod): void {
    this.paymentMethod = method;
  }

  placeOrder(): void {
    if (this.shippingForm.invalid) {
      return;
    }

    this.loading = true;

    this.orderService.createOrder(
      this.shippingForm.value,
      this.paymentMethod
    ).subscribe({
      next: (order) => {
        this.loading = false;
        this.orderPlaced = true;
        this.currentStep = 3;

        // Clear cart after successful order
        this.cartService.clearCart();
      },
      error: (error) => {
        console.error('Error placing order', error);
        this.loading = false;
        this.error = true;
      }
    });
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  getTaxAmount(): number {
    return this.cart.totalPrice * 0.14;
  }

  getTotalAmount(): number {
    return this.cart.totalPrice + this.getTaxAmount();
  }
}
