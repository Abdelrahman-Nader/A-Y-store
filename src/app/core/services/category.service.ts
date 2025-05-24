import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category, Size, Color } from '../models/product-dto.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Get all categories
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  /**
   * Get all sizes
   */
  getSizes(): Observable<Size[]> {
    return this.http.get<Size[]>(`${this.apiUrl}/sizes`);
  }

  /**
   * Get all colors
   */
  getColors(): Observable<Color[]> {
    return this.http.get<Color[]>(`${this.apiUrl}/colors`);
  }

  /**
   * Get category by name (for backward compatibility)
   */
  getCategoryByName(name: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/categories/by-name/${name}`);
  }
}
