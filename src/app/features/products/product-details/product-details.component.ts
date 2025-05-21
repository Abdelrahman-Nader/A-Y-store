import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/core/services/product.service';
import { CartService } from 'src/app/core/services/cart.service';
import { Product } from 'src/app/core/models/product.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error = false;
  quantity = 1;
  selectedSize: string | null = null;
  selectedColor: string | null = null;
  relatedProducts: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    public cartService: CartService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      } else {
        this.router.navigate(['/products']);
      }
    });
  }

  loadProduct(id: string | number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;

        // Set default size and color if available
        if (product.sizes && product.sizes.length > 0) {
          this.selectedSize = product.sizes[0];
        }

        if (product.colors && product.colors.length > 0) {
          this.selectedColor = product.colors[0];
        }

        // Load related products
        this.loadRelatedProducts(product.category);
      },
      error: (error) => {
        console.error('Error loading product', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadRelatedProducts(category: string): void {
    this.productService.getProductsByCategory(category).subscribe({
      next: (products) => {
        // Filter out current product and limit to 4 related products
        this.relatedProducts = products
          .filter(p => this.product && p.id !== this.product.id)
          .slice(0, 4);
      },
      error: (error) => {
        console.error('Error loading related products', error);
      }
    });
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(
        this.product,
        this.quantity,
        this.selectedSize || undefined,
        this.selectedColor || undefined
      );
    }
  }

  incrementQuantity(): void {
    this.quantity++;
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  getDiscountedPrice(): number {
    if (this.product && this.product.discount && this.product.discount > 0) {
      return this.product.price * (1 - this.product.discount / 100);
    }
    return this.product ? this.product.price : 0;
  }
}
