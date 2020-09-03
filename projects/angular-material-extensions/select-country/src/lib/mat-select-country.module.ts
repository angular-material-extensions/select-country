import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {MatSelectCountryComponent} from './mat-select-country.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {COUNTRIES_DB} from './db';
import {MatSelectCountryDBToken} from './tokens';

export type MatSelectCountrySupportLanguages = 'en' | 'de' | 'fr' | 'es' | 'it';


// export function loadDB(i18n?: string) {
//   return import('./i18n/de').then(result => {
//     return result.COUNTRIES_DB_DE;
//   });
// }

/**
 * @author Anthony Nahas
 * @since 06.11.19
 */
// @dynamic
@NgModule({
  declarations: [MatSelectCountryComponent],
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
    MatIconModule
  ],
  exports: [MatSelectCountryComponent]
})
export class MatSelectCountryModule {

  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    this.registerCountries();
  }

  static forRoot(i18n: MatSelectCountrySupportLanguages = 'de'): ModuleWithProviders<MatSelectCountryModule> {
    return {
      ngModule: MatSelectCountryModule,
      providers:
        [
          {
            provide: MatSelectCountryDBToken,
            // useValue: null
            // useFactory: () => import(`'./i18n/${i18n}'`).then(result => {
            useFactory: () => import('./i18n/de').then(x => {
              return x.COUNTRIES_DB_DE;
            })
          }
        ]
    };
  }

  registerCountries() {
    for (const country of COUNTRIES_DB) {
      const countryAlpha2Code = country.alpha2Code.toLowerCase();
      this.iconRegistry
        .addSvgIcon(countryAlpha2Code, this.sanitizer
          .bypassSecurityTrustResourceUrl(`assets/svg-country-flags/svg/${countryAlpha2Code}.svg`));
    }
  }

}
