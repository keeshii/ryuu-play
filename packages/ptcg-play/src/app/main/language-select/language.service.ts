import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '../../../environments/environment';

export interface LanguageItem {
  value: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private language: string | undefined;
  private languages: LanguageItem[];

  constructor(
    private translate: TranslateService
  ) {
    this.language = window.localStorage.getItem('language');

    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang(environment.defaultLanguage);
    this.languages = this.buildLanguages();
  }

  public chooseLanguage(): void {
    let language = this.language;

    if (!language) {
      const browserLang = this.translate.getBrowserLang();

      // decode borser language, strip format 'en-US' to 'en'
      if (browserLang !== undefined && browserLang.match(/\w\w/i) !== null) {
        language = browserLang.match(/\w\w/i)[0].toLowerCase();
      }
    }

    this.changeLanguage(language);
  }

  public changeLanguage(language: string) {
    if (!this.languages.some(l => l.value === language)) {
      language = undefined;
    }

    this.setLanguage(language);
    this.translate.use(language);
  }

  public getLanguage(): string {
    return this.language || environment.defaultLanguage;
  }

  public getLanguages(): LanguageItem[] {
    return this.languages;
  }

  public setLanguage(language?: string) {
    this.language = language;
    if (language === undefined) {
      window.localStorage.removeItem('language');
      return;
    }
    window.localStorage.setItem('language', language);
  }

  private buildLanguages(): LanguageItem[] {
    const languages: LanguageItem[] = [];
    const keys = Object.keys(environment.languages);

    for (const value of keys) {
      const name: string = (environment.languages as any)[value];
      languages.push({ value, name });
    }

    languages.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    return languages;
  }

}
