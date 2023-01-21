import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Host,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  SkipSelf,
} from "@angular/core";
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validators,
} from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatSelectCountryLangToken } from "./tokens";
import { distinctUntilChanged } from "rxjs/operators";

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
  implements OnInit, OnChanges, ControlValueAccessor
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

  async ngOnInit() {
    if (this.formControlName && this.controlContainer) {
      this.control = this.controlContainer.control.get(this.formControlName);
      this._formControl = new FormControl(
        { value: this.control.value?.name, disabled: this.disabled },
        this.control.hasValidator(Validators.required)
          ? [Validators.required]
          : []
      );
      this.control.valueChanges
        .pipe(distinctUntilChanged()) // Workaround for Angular Issue: https://github.com/angular/angular/issues/12540
        .subscribe((el: Country) => {
          console.log("Parent form control cahnged!", el);
          this._formControl.setValue(this.getValueLabel(el));
          this._applyFilters(el?.name ?? el?.alpha2Code);
          // this.inputChanged(this.getValueLabel(el));
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
      this.inputChanged(el);
    });

    if (!this.countries.length) {
      this.countries = await this._loadCountriesFromDb();
    }
    this.value = this.countries.find(
      (el) =>
        el.alpha2Code == this.value?.alpha2Code &&
        !this.excludedCountries.find((el2) => el2.alpha2Code == el.alpha2Code)
    );
    this._formControl.setValue(this.getValueLabel(this.value));
    this._applyFilters(this._value?.name);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("changes select-country", changes);
    let mustUpdateValueAndFilters = false;
    if (changes.countries !== undefined) {
      if (
        !changes.countries?.currentValue ||
        changes.countries?.currentValue.length === 0
      ) {
        console.log("Se han vaciado las coutries, recargamos de BD");
        this._loadCountriesFromDb().then((transCountries) => {
          this.countries = transCountries;
          this._formControl.setValue(this.getValueLabel(this.value));
          this._applyFilters(this._value?.name);
        });
      } else {
        console.log("Hay filtro de countries.");
        this.countries = changes.countries?.currentValue ?? [];
        this.value = this.countries.find(
          (el) =>
            el.alpha2Code == this.value?.alpha2Code &&
            !this.excludedCountries.find(
              (el2) => el2.alpha2Code == el.alpha2Code
            )
        );
        mustUpdateValueAndFilters = true;
      }
    }
    if (changes.excludedCountries?.currentValue) {
      this.value = this.countries.find(
        (el) =>
          el.alpha2Code == this.value?.alpha2Code &&
          !this.excludedCountries.find((el2) => el2.alpha2Code == el.alpha2Code)
      );
      mustUpdateValueAndFilters = true;
    }
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
          country.alpha2Code === changes._value?.currentValue.alpha2Code &&
          !this.excludedCountries.find(
            (el2) => el2.alpha2Code == country.alpha2Code
          )
      );
      this.value = country;
      this._formControl.setValue(this.getValueLabel(this.value));
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
      mustUpdateValueAndFilters = true;
    }
    if (
      changes.showCallingCode?.currentValue !==
      changes.showCallingCode?.previousValue
    ) {
      this.showCallingCode = changes.showCallingCode?.currentValue;
      this._formControl.setValue(this.getValueLabel(this.value));
    }
    if (changes.countries?.currentValue) {
      this.countries = changes.countries.currentValue;
    }
    if (changes.excludedCountries?.currentValue) {
      this.excludedCountries = changes.excludedCountries.currentValue;
    }
    if (
      changes.language?.currentValue &&
      changes.language.currentValue !== changes.language.previousValue
    ) {
      this._loadCountriesFromDb().then((transCountries) => {
        this.countries = transCountries.filter(
          (el) =>
            this.countries.findIndex(
              (el2) => el2.alpha2Code == el.alpha2Code
            ) >= 0
        );
        this.value = this.countries.find(
          (el) =>
            el.alpha2Code == this.value?.alpha2Code &&
            !this.excludedCountries.find(
              (el2) => el2.alpha2Code == el.alpha2Code
            )
        );
        this._formControl.setValue(this.getValueLabel(this.value));
        this._applyFilters(this._value?.name);
      });
    }
    if (mustUpdateValueAndFilters) {
      this._applyFilters(this._value?.name);
      this._formControl.setValue(this.getValueLabel(this.value));
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
    const country = this.countries.find(
      (country) => country.name === $event.option.value
    );
    this.filterString = country.name;
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

  async _loadCountriesFromDb(): Promise<Country[]> {
    this._formControl.disable();
    this.loadingDB = true;
    let translatedCountries = [];
    try {
      translatedCountries = await this._importLang();
    } catch (err) {
      console.error("Error: " + err);
    }
    this.loadingDB = false;
    if (this.loading || this.loadingDB || this.disabled) {
      this._formControl.disable();
    } else {
      this._formControl.enable();
    }
    return translatedCountries;
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
    console.log("Aplicamoss filtros a ", this.countries);
    const filterValue = (value ?? "").toLowerCase();

    if (!filterValue) {
      this.filteredOptions = this.countries.filter(
        (el) =>
          !this.excludedCountries.find((el2) => el2.alpha2Code == el.alpha2Code)
      );
    } else {
      this.filteredOptions = this.countries.filter(
        (option: Country) =>
          !this.excludedCountries.find(
            (el2) => el2.alpha2Code == option.alpha2Code
          ) &&
          (option.name?.toLowerCase().includes(filterValue) ||
            option.alpha2Code.toLowerCase().includes(filterValue) ||
            option.alpha3Code?.toLowerCase().includes(filterValue) ||
            this.getValueLabel(option)
              .toLocaleLowerCase()
              .includes(filterValue))
      );
    }
    if (this.itemsLoadSize) {
      this.filteredOptions = this.filteredOptions.slice(0, this.itemsLoadSize);
    }

    // options in the UI are not updated when this component is used within a host component that uses OnPush
    this.cdRef.markForCheck();
  }
}
