import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User, UserRole } from '../models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;
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
    // In a real app, this would be a POST request to a login endpoint
    // For now, we'll simulate it with a GET request to find the user
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`).pipe(
      map(users => {
        const user = users[0];
        
        if (!user) {
          throw new Error('User not found');
        }
        
        // In a real app, password would be verified on the server
        // This is just a simulation
        if (password !== 'password') {
          throw new Error('Invalid password');
        }
        
        // Add token (in a real app, this would come from the server)
        const authenticatedUser = {
          ...user,
          token: 'fake-jwt-token'
        };
        
        // Store user in localStorage
        this.saveUser(authenticatedUser);
        
        // Update current user subject
        this.currentUserSubject.next(authenticatedUser);
        
        return authenticatedUser;
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
    // In a real app, this would be a POST request to a register endpoint
    // For now, we'll simulate it with a POST request to create a new user
    const newUser = {
      name,
      email,
      role: UserRole.CUSTOMER
    };
    
    return this.http.post<User>(this.apiUrl, newUser);
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
