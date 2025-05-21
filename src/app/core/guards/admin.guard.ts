import { Injectable } from '@angular/core';
import { 
  ActivatedRouteSnapshot, 
  CanActivate, 
  Router, 
  RouterStateSnapshot, 
  UrlTree 
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // التحقق مما إذا كان المستخدم مسجل الدخول وهو مسؤول
    if (this.authService.isLoggedIn() && this.authService.isAdmin()) {
      return true;
    }
    
    // إذا لم يكن مسجل الدخول، توجيهه إلى صفحة تسجيل الدخول
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url }
      });
      return false;
    }
    
    // إذا كان مسجل الدخول ولكنه ليس مسؤولاً، توجيهه إلى الصفحة الرئيسية
    this.router.navigate(['/']);
    return false;
  }
}
