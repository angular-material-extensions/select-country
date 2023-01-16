import {
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { BehaviorSubject, combineLatest, fromEvent, Subject } from "rxjs";
import { debounceTime, startWith, takeUntil } from "rxjs/operators";
import { MatSelectCountryLangToken } from "./tokens";
import { MatInput } from "@angular/material/input";

/**
 * Country interface ISO 3166
 */
export interface Country {
  name?: string;
  alpha2Code: string;
  alpha3Code?: string;
  numericCode?: string;
  callingCode?: string;
}

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
type CountryOptionalMandatoryAlpha2Code = Optional<
  Country,
  "alpha3Code" | "name" | "callingCode" | "numericCode"
>;

/**
 * @author Anthony Nahas
 * @since 11.19
 * @version 2.1.0
 */
@Component({
  selector: "mat-select-country",
  templateUrl: "mat-select-country.component.html",
  styleUrls: ["mat-select-country.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatSelectCountryComponent),
      multi: true,
    },
  ],
})
export class MatSelectCountryComponent
  implements OnInit, OnChanges, ControlValueAccessor, DoCheck
{
  @Input() appearance: "fill" | "outline" = "outline";
  @Input() countries: Country[] = [];
  @Input() label: string;
  @Input() placeHolder = "Select country";
  @Input() required: boolean;
  @Input() disabled: boolean;
  @Input() nullable: boolean;
  @Input() readonly: boolean;
  @Input() tabIndex: number | string;
  @Input() class: string;
  @Input() itemsLoadSize: number = 20;
  @Input() loading: boolean;
  @Input() showCallingCode = false;
  @Input() excludedCountries: CountryOptionalMandatoryAlpha2Code[] = [];
  @Input() language: string;
  @Input() name: string = "country";
  @Input() error: string = "";
  @Input() cleareable: boolean = false;
  @Input() formControl?: FormControl | undefined = undefined;
  @Input() panelWidth: string | number = "";
  @Input("value") _value?: Country | undefined = undefined;

  @ViewChild("countryAutocomplete") statesAutocompleteRef: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild("inputElement") inputElement: MatInput;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onCountrySelected: EventEmitter<Country> =
    new EventEmitter<Country>();

  filteredOptions: Country[];
  db: Country[];
  loadingDB: boolean;
  debounceTime = 300;
  filterString = "";

  onChange: any = () => {};
  onTouched: any = () => {};
  debounceTimeout: any;

  constructor(
    @Inject(forwardRef(() => MatSelectCountryLangToken)) public i18n: string,
    private cdRef: ChangeDetectorRef
  ) {}

  get value(): Country | null {
    return this._value;
  }

  set value(val: Country | null) {
    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  ngDoCheck() {
    // console.log("Do check component select-country");
    // console.log({
    //   value: this.value,
    //   filteredOptions: this.filteredOptions,
    //   appearance: this.appearance,
    //   countries: this.countries,
    //   label: this.label,
    //   placeHolder: this.placeHolder,
    //   required: this.required,
    //   disabled: this.disabled,
    //   nullable: this.nullable,
    //   readonly: this.readonly,
    //   tabIndex: this.tabIndex,
    //   class: this.class,
    //   itemsLoadSize: this.itemsLoadSize,
    //   loading: this.loading,
    //   showCallingCode: this.showCallingCode,
    //   excludedCountries: this.excludedCountries,
    //   autocomplete: this.autocomplete,
    //   language: this.language,
    //   name: this.name,
    //   error: this.error,
    //   cleareable: this.cleareable,
    //   formControl: this.formControl,
    //   panelWidth: this.panelWidth,
    // });
  }

  async ngOnInit() {
    if (!this.countries.length) {
      await this._loadCountriesFromDb(this.value?.alpha2Code);
    }
    this._applyFilters(this._value?.name);

    // combineLatest([this.countries$, this.value$, this.excludedCountries$])
    //   .pipe(
    //     // fixing the glitch on combineLatest https://blog.strongbrew.io/combine-latest-glitch/
    //     debounceTime(0),
    //     takeUntil(this.unsubscribe$)
    //   )
    //   .subscribe(([countries, value, excludedCountries]) => {
    //     this._populateCountries(countries, excludedCountries);
    //     if (value) {
    //       this._setValue(value);
    //     }
    //   });
    //
    // if (!this.countries.length) {
    //   this._loadCountriesFromDb();
    // }
    // this.modelChanged
    //   .pipe(
    //     startWith(""),
    //     debounceTime(this.debounceTime),
    //     takeUntil(this.unsubscribe$)
    //   )
    //   .subscribe((value) => {
    //     this.filterString = value;
    //     this._filter(value);
    //   });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("changes select-country", changes);
    if (
      this.countries &&
      this.countries.length &&
      changes._value?.currentValue
    ) {
      const country = this.countries.find(
        (country) =>
          country.alpha2Code === changes._value?.currentValue.alpha2Code
      );
      this.value = country;
      if (
        this.value?.alpha2Code !== changes._value?.previousValue?.alpha2Code
      ) {
        this.onCountrySelected.emit(this.value);
      }
    }
    if (
      changes.appearance?.currentValue ??
      "outline" !== changes.appearance?.previousValue
    ) {
      this.appearance = changes.appearance?.currentValue ?? "outline";
    }
    if (changes.label?.currentValue !== changes.label?.previousValue) {
      this.label = changes.label?.currentValue;
    }
    if (
      changes.placeHolder?.currentValue ??
      "Select country" !== changes.placeHolder?.previousValue
    ) {
      this.placeHolder = changes.placeHolder?.currentValue ?? "Select country";
    }
    if (changes.class?.currentValue !== changes.class?.previousValue) {
      this.class = changes.class?.currentValue;
    }
    if (
      changes.name?.currentValue ??
      "country" !== changes.name?.previousValue
    ) {
      this.name = changes.name?.currentValue ?? "country";
    }
    if (changes.error?.currentValue !== changes.error?.previousValue) {
      this.error = changes.error?.currentValue;
    }
    // if (changes.countries?.currentValue) {
    //   this.countries$.next(changes.countries.currentValue);
    // }
    //
    // if (changes.excludedCountries?.currentValue) {
    //   this.excludedCountries$.next(changes.excludedCountries.currentValue);
    // }
    //
    // if (
    //   changes.language?.currentValue &&
    //   changes.language.currentValue !== changes.language.previousValue
    // ) {
    //   console.log("Change on language detected", changes.language);
    //   // let lastValue = this._value;
    //   // this.filterString = "";
    //   // this._value = null;
    //   // this.onCountrySelected.emit(null);
    //   this._loadCountriesFromDb(this._value?.alpha2Code);
    // }
  }

  inputChanged(value: string): void {
    console.log("input change detected: ", value);
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    this.debounceTimeout = setTimeout(
      () => this._applyFilters(value),
      this.debounceTime
    );
    this._applyFilters(value);
  }

  onBlur() {
    if (
      this.nullable &&
      !this.inputElement.value &&
      this.statesAutocompleteRef.panel
    ) {
      this._setValue(null);
      this.onCountrySelected.emit(null);
    }
  }

  onOptionsSelected($event: MatAutocompleteSelectedEvent) {
    const country = this.countries.find(
      (country) => country.name === $event.option.value
    );
    this.filterString = country.name;
    this._applyFilters(country.name);
    if (this.value?.alpha2Code !== country.alpha2Code) {
      this.value = country;
      this.onCountrySelected.emit(this.value);
    }
  }

  writeValue(value) {
    if (value) {
      this.value = value;
    }
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  autocompleteScroll() {
    if (this.itemsLoadSize) {
      setTimeout(() => {
        if (
          this.statesAutocompleteRef &&
          this.autocompleteTrigger &&
          this.statesAutocompleteRef.panel
        ) {
          fromEvent(this.statesAutocompleteRef.panel.nativeElement, "scroll")
            .pipe(takeUntil(this.autocompleteTrigger.panelClosingActions))
            .subscribe(() => {
              const scrollTop =
                this.statesAutocompleteRef.panel.nativeElement.scrollTop;
              const scrollHeight =
                this.statesAutocompleteRef.panel.nativeElement.scrollHeight;
              const elementHeight =
                this.statesAutocompleteRef.panel.nativeElement.clientHeight;
              const atBottom = scrollHeight === scrollTop + elementHeight;
              if (atBottom) {
                // fetch more data if not filtered
                if (this.filterString === "") {
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

  clear() {
    this.filterString = "";
    this.inputChanged("");
    this._setValue(null);
    this.onCountrySelected.emit(null);
  }

  async _loadCountriesFromDb(alpha2Code?: string): Promise<void> {
    this.loadingDB = true;
    try {
      const translatedCountries = await this._importLang();
      this.countries = translatedCountries;
      this.value = translatedCountries.find(
        (el) => el.alpha2Code == alpha2Code
      );
    } catch (err) {
      console.error("Error: " + err);
    }
    this.loadingDB = false;
  }

  private _populateCountries(
    countries: Country[],
    excludedCountries: CountryOptionalMandatoryAlpha2Code[]
  ): void {
    const excludeCountries = excludedCountries.map((c) => c.alpha2Code);
    this.countries = countries.filter(
      (c) => !excludeCountries.includes(c.alpha2Code)
    );
  }

  private _setValue(value: Country | null): void {
    if (value && (!value.name || value.name === "Unknown")) {
      // lookup name based on alpha2 values could be extended to lookup on other values too
      const matchingCountry = this.countries.find(
        (c) => c.alpha2Code === value.alpha2Code
      );
      if (!!matchingCountry) {
        value = matchingCountry;
      }
    }
    this._value = value?.name ? value : null;
    this.onChange(this._value);
    this.formControl?.setValue(this._value ? this._value.name : null);
  }

  private _importLang(): Promise<any> {
    const lang = this.language || this.i18n;
    switch (lang) {
      case "br":
        return import("./i18n/br")
          .then((result) => result.COUNTRIES_DB_BR)
          .then((y) => y);
      case "by":
        return import("./i18n/by")
          .then((result) => result.COUNTRIES_DB_BY)
          .then((y) => y);
      case "de":
        return import("./i18n/de")
          .then((result) => result.COUNTRIES_DB_DE)
          .then((y) => y);
      case "es":
        return import("./i18n/es")
          .then((result) => result.COUNTRIES_DB_ES)
          .then((y) => y);
      case "fr":
        return import("./i18n/fr")
          .then((result) => result.COUNTRIES_DB_FR)
          .then((y) => y);
      case "hr":
        return import("./i18n/hr")
          .then((result) => result.COUNTRIES_DB_HR)
          .then((y) => y);
      case "hu":
        return import("./i18n/hu")
          .then((result) => result.COUNTRIES_DB_HU)
          .then((y) => y);
      case "it":
        return import("./i18n/it")
          .then((result) => result.COUNTRIES_DB_IT)
          .then((y) => y);
      case "nl":
        return import("./i18n/nl")
          .then((result) => result.COUNTRIES_DB_NL)
          .then((y) => y);
      case "pt":
        return import("./i18n/pt")
          .then((result) => result.COUNTRIES_DB_PT)
          .then((y) => y);
      case "ru":
        return import("./i18n/ru")
          .then((result) => result.COUNTRIES_DB_RU)
          .then((y) => y);
      case "ua":
        return import("./i18n/ua")
          .then((result) => result.COUNTRIES_DB_UA)
          .then((y) => y);
      case "gl":
        return import("./i18n/gl")
          .then((result) => result.COUNTRIES_DB_GL)
          .then((y) => y);
      case "eu":
        return import("./i18n/eu")
          .then((result) => result.COUNTRIES_DB_EU)
          .then((y) => y);
      case "ca":
        return import("./i18n/ca")
          .then((result) => result.COUNTRIES_DB_CA)
          .then((y) => y);
      default:
        return import("./i18n/en")
          .then((result) => result.COUNTRIES_DB)
          .then((y) => y);
    }
  }

  private _applyFilters(value?: string) {
    const filterValue = (value ?? "").toLowerCase();

    // if not filtered, fetch reduced array
    if (this.itemsLoadSize && filterValue === "") {
      this.filteredOptions = this.countries;
    } else {
      this.filteredOptions = this.countries.filter(
        (option: Country) =>
          option.name.toLowerCase().includes(filterValue) ||
          option.alpha2Code.toLowerCase().includes(filterValue) ||
          option.alpha3Code.toLowerCase().includes(filterValue)
      );
    }
    if (this.itemsLoadSize) {
      this.filteredOptions = this.filteredOptions.slice(0, this.itemsLoadSize);
    }

    // options in the UI are not updated when this component is used within a host component that uses OnPush
    this.cdRef.markForCheck();
  }
}
