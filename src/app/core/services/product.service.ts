import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductCreateDto, ProductUpdateDto } from '../models/product-dto.model';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

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
    const options = { headers: this.getHeaders() };
    return this.http.post<Product>(this.apiUrl, product, options);
  }

  /**
   * Create a new product using DTO (admin only)
   * @param productDto Product DTO data
   */
  createProductWithDto(productDto: ProductCreateDto): Observable<Product> {
    // إضافة headers صحيحة
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<Product>(this.apiUrl, productDto, { headers });
  }

  /**
   * Create a simple product for testing (admin only)
   * @param productDto Simple Product DTO data
   */
  createSimpleProduct(productDto: any): Observable<Product> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<Product>(`${this.apiUrl}/simple`, productDto, { headers });
  }

  /**
   * Update a product (admin only)
   * @param id Product ID (string or number)
   * @param product Product data
   */
  updateProduct(id: string | number, product: Partial<Product>): Observable<Product> {
    const options = { headers: this.getHeaders() };
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product, options);
  }

  /**
   * Update a product using DTO (admin only)
   * @param id Product ID
   * @param productDto Product DTO data
   */
  updateProductWithDto(id: number, productDto: ProductUpdateDto): Observable<Product> {
    const options = { headers: this.getHeaders() };
    return this.http.put<Product>(`${this.apiUrl}/${id}`, productDto, options);
  }

  /**
   * Delete a product (admin only)
   * @param id Product ID (string or number)
   */
  deleteProduct(id: string | number): Observable<void> {
    const options = { headers: this.getHeaders() };
    return this.http.delete<void>(`${this.apiUrl}/${id}`, options);
  }
}
