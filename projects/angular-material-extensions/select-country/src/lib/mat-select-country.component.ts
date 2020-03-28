import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {COUNTRIES_DB} from './db';
import {Observable} from 'rxjs';
import {debounceTime, map, startWith} from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldAppearance } from '@angular/material/form-field';

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
export class MatSelectCountryComponent implements OnInit, OnChanges {

  @Input() appearance: MatFormFieldAppearance;
  @Input() country: string;
  @Input() label: string;
  @Input() placeHolder = 'Select country';
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.country) {
      if (changes.country.currentValue) {
        const newValue = changes.country.currentValue.toUpperCase();
        this.selectedCountry = this.countries.find(country =>
          country.name.toUpperCase() === newValue
          || country.alpha2Code === newValue
          || country.alpha3Code === newValue
          || country.numericCode === newValue
        );
        this.countryFormControl.setValue(
          this.selectedCountry ? this.selectedCountry.name : ''
        );
      } else {
        this.selectedCountry = undefined;
        this.countryFormControl.setValue('');
      }
    }
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
