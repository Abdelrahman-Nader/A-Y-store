import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get token from localStorage
    const token = this.getToken();
    
    // If token exists, add it to the request headers
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    return next.handle(request);
  }

  private getToken(): string | null {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        return parsedUser.token;
      } catch (error) {
        console.error('Error parsing user from localStorage', error);
        return null;
      }
    }
    return null;
  }
}
