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
import { UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // التحقق مما إذا كان المستخدم مسجل الدخول
    if (!this.authService.isLoggedIn()) {
      // إذا لم يكن مسجل الدخول، توجيهه إلى صفحة تسجيل الدخول
      // مع تخزين الصفحة التي كان يحاول الوصول إليها
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url }
      });
      return false;
    }
    
    // التحقق من الأدوار المطلوبة للوصول إلى هذه الصفحة
    const requiredRoles = route.data['roles'] as UserRole[];
    
    if (requiredRoles && requiredRoles.length > 0) {
      const currentUser = this.authService.getCurrentUser();
      
      // التحقق مما إذا كان المستخدم لديه أي من الأدوار المطلوبة
      if (currentUser && requiredRoles.includes(currentUser.role)) {
        return true;
      } else {
        // إذا لم يكن لديه الأدوار المطلوبة، توجيهه إلى الصفحة الرئيسية
        this.router.navigate(['/']);
        return false;
      }
    }
    
    // إذا لم تكن هناك أدوار مطلوبة، السماح بالوصول
    return true;
  }
}
