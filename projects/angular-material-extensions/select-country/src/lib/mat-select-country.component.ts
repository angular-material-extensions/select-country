import {Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {COUNTRIES_DB} from './db';
import {Observable} from 'rxjs';
import {debounceTime, map, startWith} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatFormFieldAppearance} from '@angular/material/form-field';

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
  styleUrls: ['mat-select-country.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatSelectCountryComponent),
      multi: true
    }
  ]
})
export class MatSelectCountryComponent implements OnInit, OnChanges, ControlValueAccessor {

  // tslint:disable-next-line:variable-name
  @Input() private _value: Country;
  @Input() appearance: MatFormFieldAppearance;
  @Input() country: string;
  @Input() label: string;
  @Input() placeHolder = 'Select country';
  @Input() disabled: boolean;
  @Input() nullable: boolean;
  @Input() readonly: boolean;
  @Input() class: string;

  @Output() onCountrySelected: EventEmitter<Country> = new EventEmitter<Country>();


  countryFormControl = new FormControl();
  countries: Country[] = COUNTRIES_DB;
  filteredOptions: Observable<Country[]>;

  propagateChange = (_: any) => {
  };


  get value(): Country {
    return this._value;
  }

  set value(value: Country) {
    this._value = value;
    this.propagateChange(this._value);
  }

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
        this.value = this.countries.find(country =>
          country.name.toUpperCase() === newValue
          || country.alpha2Code === newValue
          || country.alpha3Code === newValue
          || country.numericCode === newValue
        );
      } else {
        this.value = undefined;
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

  onBlur() {
    if (this.value || !this.nullable) {
      this.countryFormControl.setValue(
        this.value ? this.value.name : ''
      );
    } else if (this.value) {
      this.value = null;
      this.onCountrySelected.emit(null);
    }
  }

  onOptionsSelected($event: MatAutocompleteSelectedEvent) {
    this.value = this.countries.find(country => country.name === $event.option.value);
    this.onCountrySelected.emit(this.value);
  }

  writeValue(obj: any): void {
    if (obj) {
      this.value = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    // throw new Error('Method not implemented.');
  }

  setDisabledState?(isDisabled: boolean): void {
    // throw new Error('Method not implemented.');
  }
}
