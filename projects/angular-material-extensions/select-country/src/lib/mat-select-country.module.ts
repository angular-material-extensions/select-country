import { ModuleWithProviders, NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { COUNTRIES_DB } from './i18n';

import { MatSelectCountryLangToken } from './tokens';

import { JoinStringsPipe } from './join.pipe';

import { MatSelectCountryComponent } from './mat-select-country.component';

export type MatSelectCountrySupportedLanguages = 'br' | 'de' | 'en' | 'es' | 'fr' | 'hr' | 'it' | 'nl' | 'pt';

/**
 * @author Anthony Nahas
 * @since 06.11.19
 */
// @dynamic
@NgModule({
  declarations: [
    MatSelectCountryComponent,
    JoinStringsPipe
  ],
  imports: [
    CommonModule,

    // Forms
    FormsModule,
    ReactiveFormsModule,

    // Material
    MatButtonModule,
    MatMenuModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  exports: [MatSelectCountryComponent],
})
export class MatSelectCountryModule {
  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    this.registerCountries();
  }

  static forRoot(i18n: MatSelectCountrySupportedLanguages): ModuleWithProviders<MatSelectCountryModule> {
    return {
      ngModule: MatSelectCountryModule,
      providers:
        [
          {
            provide: MatSelectCountryLangToken,
            useValue: i18n
          }
        ]
    };
  }

  registerCountries() {
    for (const country of COUNTRIES_DB) {
      const countryAlpha2Code = country.alpha2Code.toLowerCase();
      try {
        this.iconRegistry
          .addSvgIcon(countryAlpha2Code, this.sanitizer
            .bypassSecurityTrustResourceUrl(`assets/svg-country-flags/svg/${countryAlpha2Code}.svg`));
      } catch (err) {
        console.error('Error: icon not found for ' + countryAlpha2Code, err);
      }
    }
  }
}
