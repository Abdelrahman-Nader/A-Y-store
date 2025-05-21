import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

export interface Language {
  code: string;
  name: string;
  direction: 'ltr' | 'rtl';
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANGUAGE_KEY = 'selectedLanguage';
  
  // تعريف اللغات المدعومة
  private languages: Language[] = [
    { code: 'en', name: 'English', direction: 'ltr' },
    { code: 'ar', name: 'العربية', direction: 'rtl' }
  ];
  
  // اللغة الافتراضية
  private defaultLanguage: Language = this.languages[0];
  
  // BehaviorSubject للغة الحالية
  private currentLanguageSubject: BehaviorSubject<Language>;
  public currentLanguage$: Observable<Language>;

  constructor(
    private translateService: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {
    // استرجاع اللغة المحفوظة أو استخدام اللغة الافتراضية
    const savedLanguageCode = localStorage.getItem(this.LANGUAGE_KEY);
    const initialLanguage = savedLanguageCode 
      ? this.getLanguageByCode(savedLanguageCode) || this.defaultLanguage
      : this.defaultLanguage;
    
    this.currentLanguageSubject = new BehaviorSubject<Language>(initialLanguage);
    this.currentLanguage$ = this.currentLanguageSubject.asObservable();
    
    // تهيئة خدمة الترجمة
    this.initTranslateService();
  }

  /**
   * تهيئة خدمة الترجمة
   */
  private initTranslateService(): void {
    // تعيين اللغات المدعومة
    this.translateService.addLangs(this.languages.map(lang => lang.code));
    
    // تعيين اللغة الافتراضية
    this.translateService.setDefaultLang(this.defaultLanguage.code);
    
    // تطبيق اللغة الحالية
    this.setLanguage(this.currentLanguageSubject.value);
  }

  /**
   * الحصول على جميع اللغات المدعومة
   */
  getLanguages(): Language[] {
    return [...this.languages];
  }

  /**
   * الحصول على اللغة الحالية
   */
  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  /**
   * البحث عن لغة بواسطة الرمز
   * @param code رمز اللغة
   */
  getLanguageByCode(code: string): Language | undefined {
    return this.languages.find(lang => lang.code === code);
  }

  /**
   * تغيير اللغة
   * @param language اللغة المراد التغيير إليها
   */
  setLanguage(language: Language): void {
    // تغيير اللغة في خدمة الترجمة
    this.translateService.use(language.code);
    
    // تحديث اتجاه الصفحة (RTL/LTR)
    this.document.documentElement.dir = language.direction;
    this.document.documentElement.lang = language.code;
    
    // إضافة أو إزالة فئة RTL من عنصر الجسم
    if (language.direction === 'rtl') {
      this.document.body.classList.add('rtl');
    } else {
      this.document.body.classList.remove('rtl');
    }
    
    // حفظ اللغة في التخزين المحلي
    localStorage.setItem(this.LANGUAGE_KEY, language.code);
    
    // تحديث BehaviorSubject
    this.currentLanguageSubject.next(language);
  }

  /**
   * تبديل اللغة
   */
  toggleLanguage(): void {
    const currentLang = this.getCurrentLanguage();
    const otherLang = this.languages.find(lang => lang.code !== currentLang.code);
    
    if (otherLang) {
      this.setLanguage(otherLang);
    }
  }
}
