import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/core/services/product.service';
import { Product } from 'src/app/core/models/product.model';
import { CartService } from 'src/app/core/services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  loading = true;
  error = false;

  // Filters
  selectedCategory: string = '';
  searchTerm: string = '';
  sortBy: string = 'name';
  sortOrder: string = 'asc';

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = [...products];
        this.extractCategories();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  extractCategories(): void {
    // Extract unique categories from products
    const categoriesSet = new Set<string>();
    this.products.forEach(product => {
      if (product.category) {
        categoriesSet.add(product.category);
      }
    });
    this.categories = Array.from(categoriesSet);
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  search(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  sort(sortBy: string): void {
    if (this.sortBy === sortBy) {
      // Toggle sort order if clicking the same column
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortBy;
      this.sortOrder = 'asc';
    }
    this.applyFilters();
  }

  applyFilters(): void {
    // Start with all products
    let filtered = [...this.products];

    // Apply category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (this.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        default:
          comparison = 0;
      }

      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.filteredProducts = filtered;
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
  }

  resetFilters(): void {
    this.selectedCategory = '';
    this.searchTerm = '';
    this.sortBy = 'name';
    this.sortOrder = 'asc';
    this.filteredProducts = [...this.products];
  }
}
