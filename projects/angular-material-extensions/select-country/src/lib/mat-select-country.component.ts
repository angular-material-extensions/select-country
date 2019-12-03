import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {COUNTRIES_DB} from './db';
import {Observable} from 'rxjs';
import {debounceTime, map, startWith} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent, MatFormFieldAppearance} from '@angular/material';

/**
 * Country interface ISO 3166
 */
export interface Country {
  name: string;
  alpha2Code: string;
  alpha3Code: string;
  numericCode: string;
}

/**
 * @author Anthony Nahas
 * @since 11.19
 * @version 1.0
 */
@Component({
  selector: 'mat-select-country',
  templateUrl: 'mat-select-country.component.html',
  styleUrls: ['mat-select-country.component.scss']
})
export class MatSelectCountryComponent implements OnInit {

  @Input() placeHolder = 'Select country';
  @Input() label: string;
  @Input() appearance: MatFormFieldAppearance;
  @Input() disabled: boolean;
  @Input() readonly: boolean;

  @Output() onCountrySelected: EventEmitter<Country> = new EventEmitter<Country>();

  countryFormControl = new FormControl();
  selectedCountry: Country;
  countries: Country[] = COUNTRIES_DB;
  filteredOptions: Observable<Country[]>;

  ngOnInit() {
    this.filteredOptions = this.countryFormControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): Country[] {
    const filterValue = value.toLowerCase();

    return this.countries.filter((option: Country) =>
      option.name.toLowerCase().includes(filterValue)
      || option.alpha2Code.toLowerCase().includes(filterValue)
      || option.alpha3Code.toLowerCase().includes(filterValue)
    );
  }


  onOptionsSelected($event: MatAutocompleteSelectedEvent) {
    this.selectedCountry = this.countries.find(country => country.name === $event.option.value);
    this.onCountrySelected.emit(this.selectedCountry);
  }
}
