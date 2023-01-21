import {
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  forwardRef,
  Host,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  SkipSelf,
  ViewChild,
} from "@angular/core";
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validators,
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
import { deprecate } from "util";
import * as e from "express";

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

type CustomOptional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
type CountryOptionalMandatoryAlpha2Code = CustomOptional<
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
  @Input() required: boolean = false;
  @Input() disabled: boolean;
  /** @deprecated Use clearable to allow user unselect country.*/
  @Input() nullable: boolean = true;
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
  @Input() formControlName?: string;
  @Input() panelWidth?: string | undefined;
  @Input("value") _value?: Country | undefined;
  @Input() extendWidth = false;
  @Input() hint?: string | undefined;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onCountrySelected: EventEmitter<Country> =
    new EventEmitter<Country>();

  _formControl = new FormControl(
    { value: "", disabled: false },
    this.required ? [Validators.required] : []
  );
  filteredOptions: Country[];
  db: Country[];
  loadingDB: boolean;
  debounceTime = 300;
  filterString = "";

  onChange: any = () => {};
  onTouched: any = () => {};
  debounceTimeout: any;

  private control: AbstractControl;

  constructor(
    @Inject(forwardRef(() => MatSelectCountryLangToken)) public i18n: string,
    @Optional()
    @Host()
    @SkipSelf()
    private controlContainer: ControlContainer,
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
    if (this.formControlName && this.controlContainer) {
      this.control = this.controlContainer.control.get(this.formControlName);
      this._formControl = new FormControl(
        { value: this.control.value?.name, disabled: this.disabled },
        this.required ? [Validators.required] : []
      );
      this.control.valueChanges.subscribe((el) => {
        console.log("Parent form control cahnged!");
        this._formControl.setValue(this.getValueLabel(el));
        this.inputChanged(this.getValueLabel(el));
      });
    } else if (this.formControlName && !this.controlContainer) {
      console.warn("Can't find parent FormGroup directive");
      this._formControl = new FormControl(
        { value: null, disabled: this.disabled },
        this.required ? [Validators.required] : []
      );
    } else {
      this._formControl = new FormControl(
        { value: this.value?.name, disabled: this.disabled },
        this.required ? [Validators.required] : []
      );
    }
    this._formControl.valueChanges.subscribe((el) => {
      console.log("Value Selected Noticed in _formControl: " + el);
      this.inputChanged(el);
    });

    if (!this.countries.length) {
      await this._loadCountriesFromDb();
      this.value = this.countries.find(
        (el) => el.alpha2Code == this.value?.alpha2Code
      );
      this._formControl.setValue(this.getValueLabel(this.value));
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
      this.countries = this.countries.map((country) =>
        country.alpha2Code === changes._value?.currentValue.alpha2Code
          ? changes._value?.currentValue
          : country
      );
      const country = this.countries.find(
        (country) =>
          country.alpha2Code === changes._value?.currentValue.alpha2Code
      );
      this.value = country;
      this._formControl.setValue(this.getValueLabel(this.value));
      // this._formControl.updateValueAndValidity();
      if (
        this.value?.alpha2Code !== changes._value?.previousValue?.alpha2Code
      ) {
        this.onCountrySelected.emit(this.value);
      }
    }
    if (changes.disabled?.currentValue !== changes.disabled?.previousValue) {
      this.disabled = changes.disabled?.currentValue;
      if (this.disabled) {
        this._formControl.disable();
        if (this.control) this.control.disable();
      } else {
        this._formControl.enable();
        if (this.control) this.control.enable();
      }
    }
    if (changes.required?.currentValue !== changes.required?.previousValue) {
      this.required = changes.required?.currentValue;
      if (this.required) {
        this._formControl.setValidators([Validators.required]);
        if (this.control) {
          this.control.addValidators([Validators.required]);
        }
      } else {
        this._formControl.setValidators([]);
        if (this.control) {
          this.control.removeValidators([Validators.required]);
        }
      }
      this._formControl.updateValueAndValidity();
      if (this.control) {
        this.control.updateValueAndValidity();
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
    if (changes.hint?.currentValue !== changes.hint?.previousValue) {
      this.hint = changes.hint?.currentValue;
    }
    if (changes.tabIndex?.currentValue !== changes.tabIndex?.previousValue) {
      this.tabIndex = changes.tabIndex?.currentValue;
    }
    if (changes.loading?.currentValue !== changes.loading?.previousValue) {
      this.loading = changes.loading?.currentValue;
      if (this.loading || this.loadingDB || this.disabled) {
        this._formControl.disable();
      } else {
        this._formControl.enable();
      }
    }
    if (
      changes.itemsLoadSize?.currentValue !==
      changes.itemsLoadSize?.previousValue
    ) {
      this.itemsLoadSize = changes.itemsLoadSize?.currentValue;
      this._applyFilters(this.value?.name);
    }
    // if (changes.countries?.currentValue) {
    //   this.countries$.next(changes.countries.currentValue);
    // }
    //
    // if (changes.excludedCountries?.currentValue) {
    //   this.excludedCountries$.next(changes.excludedCountries.currentValue);
    // }
    //
    if (
      changes.language?.currentValue &&
      changes.language.currentValue !== changes.language.previousValue
    ) {
      this._loadCountriesFromDb().then(() => {
        this.value = this.countries.find(
          (el) => el.alpha2Code == this.value?.alpha2Code
        );
        this._applyFilters(this._value?.name);
        this._formControl.setValue(this.getValueLabel(this.value));
      });
    }
  }

  clear() {
    this.filterString = "";
    this._applyFilters("");
    this.value = null;
    this._formControl.reset();
    if (!this.formControlName) {
      this.onCountrySelected.emit(null);
    } else if (this.control) {
      this.control.reset();
    }
  }

  inputChanged(value?: string | null): void {
    if (value != this.value?.name) {
      console.log(
        "input change detected before[" +
          this.value?.name +
          "] -> now[" +
          value +
          "]"
      );
      if (!value) {
        this.clear();
        return;
      }
      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }
      this.debounceTimeout = setTimeout(() => {
        this._applyFilters(value ?? "");
      }, this.debounceTime);
    }
  }

  onOptionsSelected($event: MatAutocompleteSelectedEvent) {
    console.log("Option selected!", $event);
    const country = this.countries.find(
      (country) => country.name === $event.option.value
    );
    this.filterString = country.name;
    this._applyFilters(country.name);
    if (this.value?.alpha2Code !== country.alpha2Code) {
      this.value = country;
      this._formControl.setValue(this.getValueLabel(this.value));
      this.onCountrySelected.emit(this.value);
    }
  }

  writeValue(value) {
    this.value = value;
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  // autocompleteScroll() {
  //   if (this.itemsLoadSize) {
  //     setTimeout(() => {
  //       if (
  //         this.statesAutocompleteRef &&
  //         this.autocompleteTrigger &&
  //         this.statesAutocompleteRef.panel
  //       ) {
  //         fromEvent(this.statesAutocompleteRef.panel.nativeElement, "scroll")
  //           .pipe(takeUntil(this.autocompleteTrigger.panelClosingActions))
  //           .subscribe(() => {
  //             const scrollTop =
  //               this.statesAutocompleteRef.panel.nativeElement.scrollTop;
  //             const scrollHeight =
  //               this.statesAutocompleteRef.panel.nativeElement.scrollHeight;
  //             const elementHeight =
  //               this.statesAutocompleteRef.panel.nativeElement.clientHeight;
  //             const atBottom = scrollHeight === scrollTop + elementHeight;
  //             if (atBottom) {
  //               // fetch more data if not filtered
  //               if (this.filterString === "") {
  //                 const fromIndex = this.filteredOptions.length;
  //                 const toIndex: number =
  //                   +this.filteredOptions.length + +this.itemsLoadSize;
  //                 this.filteredOptions = [
  //                   ...this.filteredOptions,
  //                   ...this.countries.slice(fromIndex, toIndex),
  //                 ];
  //               }
  //             }
  //           });
  //       }
  //     });
  //   }
  // }

  getValueLabel(el?: Country) {
    if (!el) return "";
    const mainValue = el.name
      ? el.name
      : el.alpha3Code
      ? el.alpha3Code
      : el.alpha2Code ?? "";
    if (this.showCallingCode) {
      return mainValue + (el.callingCode ? " (" + el.callingCode + ")" : "");
    }
    return mainValue;
  }

  async _loadCountriesFromDb(): Promise<void> {
    this._formControl.disable();
    this.loadingDB = true;
    try {
      const translatedCountries = await this._importLang();
      this.countries = translatedCountries;
    } catch (err) {
      console.error("Error: " + err);
    }
    this.loadingDB = false;
    if (this.loading || this.loadingDB || this.disabled) {
      this._formControl.disable();
    } else {
      this._formControl.enable();
    }
  }

  private _importLang(): Promise<any> {
    const lang = ((this.language || this.i18n) ?? "").toLowerCase();
    switch (lang) {
      case "be":
        return import("./i18n/be")
          .then((result) => result.COUNTRIES_DB_BY)
          .then((y) => y);
      case "br":
        return import("./i18n/br")
          .then((result) => result.COUNTRIES_DB_BR)
          .then((y) => y);
      case "ca":
        return import("./i18n/ca")
          .then((result) => result.COUNTRIES_DB_CA)
          .then((y) => y);
      case "de":
        return import("./i18n/de")
          .then((result) => result.COUNTRIES_DB_DE)
          .then((y) => y);
      case "es":
        return import("./i18n/es")
          .then((result) => result.COUNTRIES_DB_ES)
          .then((y) => y);
      case "eu":
        return import("./i18n/eu")
          .then((result) => result.COUNTRIES_DB_EU)
          .then((y) => y);
      case "fr":
        return import("./i18n/fr")
          .then((result) => result.COUNTRIES_DB_FR)
          .then((y) => y);
      case "gl":
        return import("./i18n/gl")
          .then((result) => result.COUNTRIES_DB_GL)
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
      case "uk":
        return import("./i18n/uk")
          .then((result) => result.COUNTRIES_DB_UA)
          .then((y) => y);
      default:
        return import("./i18n/en")
          .then((result) => result.COUNTRIES_DB)
          .then((y) => y);
    }
  }

  private _applyFilters(value?: string) {
    const filterValue = (value ?? "").toLowerCase();

    if (!filterValue) {
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
