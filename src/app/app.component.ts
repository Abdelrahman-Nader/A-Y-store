import { Component, OnInit } from '@angular/core';
import { Language, LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'cloth-store-app';
  currentLanguage: Language | null = null;

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    // الاشتراك في تغييرات اللغة
    this.languageService.currentLanguage$.subscribe(
      language => this.currentLanguage = language
    );
  }
}
