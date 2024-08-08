import { Component, Input, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { Language } from '../../models/app-configuration.model';
import { LanguageWrapperService } from '../../services/language-wrapper.service';
import { ApplicationConfigurationService } from '../../services/app-configuration.service';
import { CustomerService } from '../../services/customer.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'eino-language-switcher',
  standalone: true,
  imports: [TranslateModule, ButtonModule, MenuModule],
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
})
export class LanguageSwitcherComponent implements OnInit {
  currentlySelectedLanguage?: Language;
  currentlySelectedLanguageId?: string;
  languages: Language[] = new Array<Language>();
  menuItems: { label: string; icon?: string; command?: () => void }[] = [];

  @Input({ required: true }) mode!: 'link' | 'switch';
  constructor(
    private languageWrapperService: LanguageWrapperService,
    private customerService: CustomerService
  ) {
    this.languageWrapperService.languageSwitched
      .pipe(takeUntilDestroyed())
      .subscribe((languageKey) => {
        this.currentlySelectedLanguageId =
          this.languageWrapperService.getCurrentlySelectedLanguageId();
        this.currentlySelectedLanguage = this.getLanguageUsingKey(languageKey);
      });
  }

  ngOnInit(): void {
    this.languages =
      ApplicationConfigurationService?.settings?.languageConfig?.activated_languages;

    this.languages.forEach((language) => {
      this.menuItems.push({
        label: this.languageWrapperService.getInstantTranslation(
          language.language_key
        ),
        command: () => {
          this.saveLanguage(language);
          this.customerService.setLanguage().subscribe({
            error: console.log,
          });
        },
      });
    });

    this.setDefaultLanguage();
  }

  /**
   * Set the default language or currently set language inside the application
   */
  setDefaultLanguage(): void {
    this.currentlySelectedLanguageId =
      this.languageWrapperService.getCurrentlySelectedLanguageId();
    this.currentlySelectedLanguage = this.getLanguageUsingKey(
      this.currentlySelectedLanguageId
    );
    if (this.currentlySelectedLanguage)
      this.saveLanguage(this.currentlySelectedLanguage);
  }

  /**
   * Get the language string using key from the language array
   */
  getLanguageUsingKey(key: string): Language | undefined {
    return this.languages.find((languageItem) => languageItem.key == key);
  }

  /**
   * Save the language inside the local storage and set the language inside the application
   */
  saveLanguage(language: Language): void {
    this.currentlySelectedLanguage = language;
    this.languageWrapperService.setToSpecificLanguage(language.key);
    this.languageWrapperService.languageSwitched.next(language.key);
    localStorage.setItem('currentLanguage', language.key);
  }
}
