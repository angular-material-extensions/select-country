import {
  Component,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { debounceTime, startWith, takeUntil } from 'rxjs/operators';
import { MatSelectCountryLangToken } from './tokens';

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
 * @version 2.1.0
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
export class MatSelectCountryComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {

  @Input() appearance: MatFormFieldAppearance;
  @Input() country: Country;
  @Input() countries: Country[];
  @Input() label: string;
  @Input() placeHolder = 'Select country';
  @Input() disabled: boolean;
  @Input() nullable: boolean;
  @Input() readonly: boolean;
  @Input() class: string;
  @Input() itemsLoadSize: number;
  @Input() loading: boolean;

  @ViewChild('countryAutocomplete') statesAutocompleteRef: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @Output() onCountrySelected: EventEmitter<Country> = new EventEmitter<Country>();

  countryFormControl = new FormControl();
  filteredOptions: Country[];
  db: Country[];
  loadingDB: boolean;
  debounceTime = 300;
  filterString = '';
  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;

  private _value: Country;


  constructor(@Inject(forwardRef(() => MatSelectCountryLangToken)) public i18n: string) {
  }

  get value(): Country {
    return this._value;
  }

  set value(value: Country) {
    this._value = value;
    this.propagateChange(this._value);
  }

  propagateChange = (_: any) => {
  };

  ngOnInit() {
    if (!this.countries) {
      console.log('lang', this.i18n);
      this.countryFormControl.disable();
      this.loadingDB = true;
      this._importLang(this.i18n)
        .then((res) => {
          console.log('result', res);
          console.log('countries', this.countries);
          if (!this.disabled) {
            this.countryFormControl.enable();
          }
        }).catch((err) => console.error('Error: ' + err))
        .finally(() => this.loadingDB = false);
    }

    this.subscription = this.modelChanged
      .pipe(
        startWith(''),
        debounceTime(this.debounceTime)
      )
      .subscribe((value) => {
        this.filterString = value;
        this._filter(value);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes);
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
    if (changes.disabled) {
      changes.disabled.currentValue ? this.countryFormControl.disable() : this.countryFormControl.enable();
    }
  }

  onBlur() {
    if (this.countryFormControl.value || !this.nullable) {
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

  autocompleteScroll() {
    if (this.itemsLoadSize) {
      setTimeout(() => {
        if (
          this.statesAutocompleteRef &&
          this.autocompleteTrigger &&
          this.statesAutocompleteRef.panel
        ) {
          fromEvent(this.statesAutocompleteRef.panel.nativeElement, 'scroll')
            .pipe(
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(() => {
              const scrollTop = this.statesAutocompleteRef.panel.nativeElement
                .scrollTop;
              const scrollHeight = this.statesAutocompleteRef.panel.nativeElement
                .scrollHeight;
              const elementHeight = this.statesAutocompleteRef.panel.nativeElement
                .clientHeight;
              const atBottom = scrollHeight === scrollTop + elementHeight;
              if (atBottom) {
                // fetch more data if not filtered
                if (this.filterString === '') {
                  const fromIndex = this.filteredOptions.length;
                  const toIndex: number = +this.filteredOptions.length + +this.itemsLoadSize;
                  this.filteredOptions = [...this.filteredOptions, ...this.countries.slice(fromIndex, toIndex)];
                }
              }
            });
        }
      });
    }

  }

  inputChanged(value: string): void {
    this.modelChanged.next(value);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private _importLang(i18n: string): Promise<any> {
    switch (i18n) {
      case 'de':
        console.log('test');
        return import('./i18n/de').then(result => result.COUNTRIES_DB_DE).then(y => {
          this.countries = y;
          return y;
        });
      case 'it':
        return import('./i18n/it').then(result => result.COUNTRIES_DB_IT).then(y => {
          this.countries = y;
          return y;
        });
      case 'es':
        return import('./i18n/es').then(result => result.COUNTRIES_DB_ES).then(y => {
          this.countries = y;
          return y;
        });
      case 'fr':
        return import('./i18n/fr').then(result => result.COUNTRIES_DB_FR).then(y => {
          this.countries = y;
          return y;
        });
      default:
        console.log('running with default');
        return import('./i18n/en').then(result => result.COUNTRIES_DB).then(y => {
          this.countries = y;
          return y;
        });
    }
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();

    // if not filtered, fetch reduced array
    if (this.itemsLoadSize && filterValue === '') {
      this.filteredOptions = this.countries.slice(0, this.itemsLoadSize);
    } else {
      this.filteredOptions = this.countries.filter((option: Country) =>
        option.name.toLowerCase().includes(filterValue)
        || option.alpha2Code.toLowerCase().includes(filterValue)
        || option.alpha3Code.toLowerCase().includes(filterValue)
      );
    }
  }
}
