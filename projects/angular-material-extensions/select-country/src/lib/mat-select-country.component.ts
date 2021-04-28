import {
  ChangeDetectorRef,
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
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { BehaviorSubject, combineLatest, fromEvent, Subject } from 'rxjs';
import { debounceTime, startWith, takeUntil } from 'rxjs/operators';
import { MatSelectCountryLangToken } from './tokens';
import { MatInput } from '@angular/material/input';

/**
 * Country interface ISO 3166
 */
export interface Country {
  name: string;
  alpha2Code: string;
  alpha3Code: string;
  numericCode: string;
  callingCode: string;
}

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
type CountryOptionalMandatoryAlpha2Code = Optional<Country, 'alpha3Code' | 'name' | 'callingCode' | 'numericCode'>;

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
      multi: true,
    },
  ],
})
export class MatSelectCountryComponent
  implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
  @Input() appearance: MatFormFieldAppearance;
  @Input() countries: Country[] = [];
  @Input() label: string;
  @Input() placeHolder = 'Select country';
  @Input() required: boolean;
  @Input() disabled: boolean;
  @Input() nullable: boolean;
  @Input() readonly: boolean;
  @Input() tabIndex: number | string;
  @Input() class: string;
  @Input() itemsLoadSize: number;
  @Input() loading: boolean;
  @Input() showCallingCode = false;
  @Input() excludedCountries: CountryOptionalMandatoryAlpha2Code[] = [];
  @Input() browserAutocomplete: string;

  @ViewChild('countryAutocomplete') statesAutocompleteRef: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild(MatInput) inputElement: MatInput;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onCountrySelected: EventEmitter<Country> = new EventEmitter<Country>();

  filteredOptions: Country[];
  db: Country[];
  loadingDB: boolean;
  debounceTime = 300;
  filterString = '';

  private modelChanged: Subject<string> = new Subject<string>();
  private countries$ = new BehaviorSubject<Country[]>([]);
  private excludedCountries$ = new BehaviorSubject<Country[]>([]);
  private value$ = new BehaviorSubject<Country>(null);
  private unsubscribe$ = new Subject<void>();

  // tslint:disable-next-line: variable-name
  private _value: Country;

  constructor(
    @Inject(forwardRef(() => MatSelectCountryLangToken)) public i18n: string,
    private cdRef: ChangeDetectorRef
  ) {}

  get value(): Country {
    return this._value;
  }

  @Input()
  set value(value: Country) {
    // setting a value on a reactive form (formControlName) doesn't trigger ngOnChanges but it does call this setter
    this.value$.next(value);
  }

  propagateChange = (_: any) => {};

  ngOnInit() {
    combineLatest([
      this.countries$,
      this.value$,
      this.excludedCountries$
    ])
      .pipe(
        // fixing the glitch on combineLatest https://blog.strongbrew.io/combine-latest-glitch/
        debounceTime(0),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(( [countries, value, excludedCountries] ) => {
        this._populateCountries(countries, excludedCountries);
        if (value) {
          this._setValue( value );
        }
      });

    if (!this.countries.length) {
      this._loadCountriesFromDb();
    }

    this.modelChanged
      .pipe(
        startWith(''),
        debounceTime(this.debounceTime),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((value) => {
        this.filterString = value;
        this._filter(value);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.countries?.currentValue) {
      this.countries$.next(changes.countries.currentValue);
    }

    if (changes.excludedCountries?.currentValue) {
      this.excludedCountries$.next(changes.excludedCountries.currentValue);
    }
  }

  onBlur() {
    if (!this.inputElement.value && this.nullable && this.statesAutocompleteRef.panel) {
      this._setValue(null);
      this.onCountrySelected.emit(null);
    }
  }

  onOptionsSelected($event: MatAutocompleteSelectedEvent) {
    const value = this.countries.find(
      (country) => country.name === $event.option.value
    );
    this._setValue(value);
    this.onCountrySelected.emit(value);
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
    this.disabled = isDisabled;
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
            .pipe(takeUntil(this.autocompleteTrigger.panelClosingActions))
            .subscribe(() => {
              const scrollTop = this.statesAutocompleteRef.panel.nativeElement
                .scrollTop;
              const scrollHeight = this.statesAutocompleteRef.panel
                .nativeElement.scrollHeight;
              const elementHeight = this.statesAutocompleteRef.panel
                .nativeElement.clientHeight;
              const atBottom = scrollHeight === scrollTop + elementHeight;
              if (atBottom) {
                // fetch more data if not filtered
                if (this.filterString === '') {
                  const fromIndex = this.filteredOptions.length;
                  const toIndex: number =
                    +this.filteredOptions.length + +this.itemsLoadSize;
                  this.filteredOptions = [
                    ...this.filteredOptions,
                    ...this.countries.slice(fromIndex, toIndex),
                  ];
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
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private _loadCountriesFromDb(): void {
    this.loadingDB = true;
    this._importLang(this.i18n)
      .then((res) => {
        this.countries$.next(res);
      })
      .catch((err) => console.error('Error: ' + err))
      .finally(() => this.loadingDB = false);
  }

  private _populateCountries(countries: Country[], excludedCountries: CountryOptionalMandatoryAlpha2Code[]): void {
    const excludeCountries = excludedCountries.map(c => c.alpha2Code);
    this.countries = countries.filter(c => !excludeCountries.includes(c.alpha2Code));
  }

  private _setValue(value: Country | null): void {
    if (value && (!value.name || value.name === 'Unknown')) {
      // lookup name based on alpha2 values could be extended to lookup on other values too
      const matchingCountry = this.countries.find(
        (c) => c.alpha2Code === value.alpha2Code
      );
      if (!!matchingCountry) {
        value = matchingCountry;
      }
    }

    this._value = value?.name ? value : null;
    this.propagateChange(this._value);
  }

  private _importLang(i18n: string): Promise<any> {
    switch (i18n) {
      case 'br':
        return import('./i18n/br').then(result => result.COUNTRIES_DB_BR).then(y => y);
      case 'de':
        return import('./i18n/de').then(result => result.COUNTRIES_DB_DE).then(y => y);
      case 'es':
        return import('./i18n/es').then(result => result.COUNTRIES_DB_ES).then(y => y);
      case 'fr':
        return import('./i18n/fr').then(result => result.COUNTRIES_DB_FR).then(y => y);
      case 'hr':
        return import('./i18n/hr').then(result => result.COUNTRIES_DB_HR).then(y => y);
      case 'it':
        return import('./i18n/it').then(result => result.COUNTRIES_DB_IT).then(y => y);
      case 'nl':
        return import('./i18n/nl').then(result => result.COUNTRIES_DB_NL).then(y => y);
      case 'pt':
        return import('./i18n/pt').then(result => result.COUNTRIES_DB_PT).then(y => y);
      default:
        return import('./i18n/en').then(result => result.COUNTRIES_DB).then(y => y);
    }
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();

    // if not filtered, fetch reduced array
    if (this.itemsLoadSize && filterValue === '') {
      this.filteredOptions = this.countries.slice(0, this.itemsLoadSize);
    } else {
      this.filteredOptions = this.countries.filter(
        (option: Country) =>
          option.name.toLowerCase().includes(filterValue) ||
          option.alpha2Code.toLowerCase().includes(filterValue) ||
          option.alpha3Code.toLowerCase().includes(filterValue)
      );
    }

    // options in the UI are not updated when this component is used within a host component that uses OnPush
    this.cdRef.markForCheck();
  }
}
