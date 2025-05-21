import { Component, OnInit } from '@angular/core';
import { Language, LanguageService } from 'src/app/core/services/language.service';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent implements OnInit {
  languages: Language[] = [];
  currentLanguage: Language | null = null;

  constructor(private languageService: LanguageService) { }

  ngOnInit(): void {
    // الحصول على اللغات المدعومة
    this.languages = this.languageService.getLanguages();
    
    // الاشتراك في تغييرات اللغة الحالية
    this.languageService.currentLanguage$.subscribe(
      language => this.currentLanguage = language
    );
  }

  /**
   * تغيير اللغة
   * @param language اللغة المراد التغيير إليها
   */
  changeLanguage(language: Language): void {
    this.languageService.setLanguage(language);
  }

  /**
   * تبديل اللغة
   */
  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }
}
