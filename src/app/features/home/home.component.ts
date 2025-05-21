import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/core/services/product.service';
import { Product } from 'src/app/core/models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  newArrivals: Product[] = [];
  specialOffers: Product[] = [];

  loading = false;
  error = false;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        // Filter featured products
        this.featuredProducts = products.filter(product => product.featured).slice(0, 3);

        // Filter new arrivals
        this.newArrivals = products.filter(product => product.newArrival).slice(0, 4);

        // Filter products with discount for special offers
        this.specialOffers = products.filter(product => product.discount && product.discount > 0).slice(0, 2);

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products', error);
        this.error = true;
        this.loading = false;
      }
    });
  }
}
