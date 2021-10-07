import { Component } from '@angular/core';

import { LanguageService, LanguageItem } from './language.service';

@Component({
  selector: 'ptcg-language-select',
  templateUrl: './language-select.component.html',
  styleUrls: ['./language-select.component.scss']
})
export class LanguageSelectComponent {

  public languages: LanguageItem[];
  public name: string;

  constructor(private languageService: LanguageService) {
    this.languages = languageService.getLanguages();

    const value = languageService.getLanguage();
    const language = this.languages.find(l => l.value === value);
    this.name = language.name;
  }

  public onLanguageChange(language: LanguageItem): void {
    this.languageService.changeLanguage(language.value);
    this.name = language.name;
  }

}
