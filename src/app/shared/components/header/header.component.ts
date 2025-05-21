import { Component, OnInit } from '@angular/core';
import { Language, LanguageService } from 'src/app/core/services/language.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CartService } from 'src/app/core/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentLanguage: Language | null = null;
  isLoggedIn = false;
  isAdmin = false;
  cartItemCount = 0;

  constructor(
    private languageService: LanguageService,
    private authService: AuthService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    // الاشتراك في تغييرات اللغة
    this.languageService.currentLanguage$.subscribe(
      language => this.currentLanguage = language
    );

    // الاشتراك في تغييرات حالة تسجيل الدخول
    this.authService.currentUser$.subscribe(
      user => {
        this.isLoggedIn = !!user;
        this.isAdmin = this.authService.isAdmin();
      }
    );

    // الاشتراك في تغييرات سلة التسوق
    this.cartService.cart$.subscribe(
      cart => {
        this.cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
      }
    );
  }

  logout(): void {
    this.authService.logout();
  }
}
