import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLangSubject = new BehaviorSubject<string>('ar');
  public currentLang$: Observable<string> = this.currentLangSubject.asObservable();
  
  constructor(private translate: TranslateService) {
    // Initialize with browser language or default to Arabic
    const savedLang = localStorage.getItem('language') || 'ar';
    this.setLanguage(savedLang);
  }

  /**
   * Set the current language
   * @param lang Language code ('ar' or 'en')
   */
  setLanguage(lang: string): void {
    // Save language preference
    localStorage.setItem('language', lang);
    
    // Update language in translate service
    this.translate.use(lang);
    
    // Update direction based on language
    this.updateDirection(lang);
    
    // Update behavior subject
    this.currentLangSubject.next(lang);
  }

  /**
   * Get the current language
   */
  getCurrentLanguage(): string {
    return this.currentLangSubject.value;
  }

  /**
   * Toggle between Arabic and English
   */
  toggleLanguage(): void {
    const currentLang = this.getCurrentLanguage();
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    this.setLanguage(newLang);
  }

  /**
   * Update document direction based on language
   * @param lang Language code
   */
  private updateDirection(lang: string): void {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    
    // Add/remove RTL class to body
    if (dir === 'rtl') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }
}
