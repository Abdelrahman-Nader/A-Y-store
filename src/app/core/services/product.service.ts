import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  /**
   * Get all products
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  /**
   * Get featured products
   */
  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?featured=true`);
  }

  /**
   * Get new arrivals
   */
  getNewArrivals(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?newArrival=true`);
  }

  /**
   * Get products with discount
   */
  getDiscountedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?discount_gt=0`);
  }

  /**
   * Get product by ID
   * @param id Product ID (string or number)
   */
  getProductById(id: string | number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get products by category
   * @param category Category name
   */
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?category=${category}`);
  }

  /**
   * Search products
   * @param query Search query
   */
  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?q=${query}`);
  }

  /**
   * Create a new product (admin only)
   * @param product Product data
   */
  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  /**
   * Update a product (admin only)
   * @param id Product ID (string or number)
   * @param product Product data
   */
  updateProduct(id: string | number, product: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}`, product);
  }

  /**
   * Delete a product (admin only)
   * @param id Product ID (string or number)
   */
  deleteProduct(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
