import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User, UserRole } from '../models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load user from localStorage on initialization
    this.loadUser();
  }

  /**
   * Get current user value
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return !!user && user.role === UserRole.ADMIN;
  }

  /**
   * Login user
   * @param email User email
   * @param password User password
   */
  login(email: string, password: string): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      map(response => {
        // تحويل البيانات إلى كائن User
        const user: User = {
          id: response.id,
          name: response.name,
          email: response.email,
          role: response.role as UserRole,
          token: response.token
        };

        // تخزين المستخدم في localStorage
        this.saveUser(user);

        // تحديث موضوع المستخدم الحالي
        this.currentUserSubject.next(user);

        return user;
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Register new user
   * @param name User name
   * @param email User email
   * @param password User password
   */
  register(name: string, email: string, password: string): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/register`, { name, email, password }).pipe(
      map(response => {
        // تحويل البيانات إلى كائن User
        const user: User = {
          id: response.id,
          name: response.name,
          email: response.email,
          role: response.role as UserRole,
          token: response.token
        };

        // تخزين المستخدم في localStorage
        this.saveUser(user);

        // تحديث موضوع المستخدم الحالي
        this.currentUserSubject.next(user);

        return user;
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    // Remove user from localStorage
    localStorage.removeItem('currentUser');

    // Update current user subject
    this.currentUserSubject.next(null);
  }

  /**
   * Get auth headers
   */
  getAuthHeaders(): HttpHeaders {
    const user = this.getCurrentUser();
    if (user && user.token) {
      return new HttpHeaders({
        'Authorization': `Bearer ${user.token}`
      });
    }
    return new HttpHeaders();
  }

  /**
   * Save user to localStorage
   * @param user User to save
   */
  private saveUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  /**
   * Load user from localStorage
   */
  private loadUser(): void {
    const savedUser = localStorage.getItem('currentUser');

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as User;
        this.currentUserSubject.next(parsedUser);
      } catch (error) {
        console.error('Error parsing user from localStorage', error);
      }
    }
  }
}
