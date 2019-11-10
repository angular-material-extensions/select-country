import {NgModule} from '@angular/core';
import {MatSelectCountryComponent} from './mat-select-country.component';
import {MatAutocompleteModule, MatButtonModule, MatIconModule, MatIconRegistry, MatInputModule, MatMenuModule} from '@angular/material';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {COUNTRIES_DB} from './db';


/**
 * @author Anthony Nahas
 * @since 06.11.19
 */
@NgModule({
  declarations: [MatSelectCountryComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatMenuModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule
    // FlexLayoutModule
  ],
  exports: [MatSelectCountryComponent]
})
export class MatSelectCountryModule {

  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    this.registerCountries();
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
