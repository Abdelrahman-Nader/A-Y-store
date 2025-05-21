import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartListComponent } from './cart-list/cart-list.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    CartListComponent,
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    CartRoutingModule,
    SharedModule
  ]
})
export class CartModule { }
