import { Component, OnInit } from "@angular/core";
import { Country } from "@angular-material-extensions/select-country";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-all",
  templateUrl: "./all.component.html",
  styleUrls: ["./all.component.scss"],
})
export class AllComponent implements OnInit {
  appearance: "fill" | "outline" = "outline";
  countries: Country[] = [];
  label: string = "Label";
  placeHolder = "Select country";
  required: boolean;
  disabled: boolean;
  readonly: boolean;
  tabIndex: number | string;
  class: string;
  itemsLoadSize: number = 20;
  loading: boolean;
  showCallingCode = false;
  excludedCountries: Country[] = [];
  language: string;
  name: string = "country";
  error?: string | undefined;
  cleareable: boolean = false;
  extendWidth: boolean = false;
  _panelWidth?: string | undefined;
  value: Country | null = null;
  hint?: string | undefined;

  // helper variables
  panelWidth: number = 100;
  panelDisabled = true;

  availableLanguages: { value: string; viewValue: string }[] = [
    { value: "br", viewValue: "Breton" },
    { value: "be", viewValue: "Belarusian" },
    { value: "de", viewValue: "German" },
    { value: "en", viewValue: "English" },
    { value: "es", viewValue: "Spanish" },
    { value: "fr", viewValue: "French" },
    { value: "hr", viewValue: "Croatian" },
    { value: "hu", viewValue: "Hungarian" },
    { value: "it", viewValue: "Italian" },
    { value: "gl", viewValue: "Galician" },
    { value: "ca", viewValue: "Catalan" },
    { value: "eu", viewValue: "Basque" },
    { value: "nl", viewValue: "Flemish" },
    { value: "pt", viewValue: "Portuguese" },
    { value: "ru", viewValue: "Russian" },
    { value: "uk", viewValue: "Ukrainian" },
  ];
  languageControl = new FormControl("en");

  countryFormGroup = new FormGroup({
    appearance: new FormControl({ value: "outline", disabled: false }, [
      Validators.required,
    ]),
    // countries: new FormControl(),
    label: new FormControl({ value: "Label", disabled: false }, [
      Validators.required,
    ]),
    placeHolder: new FormControl("Select country", [Validators.required]),
    required: new FormControl(),
    disabled: new FormControl(),
    readonly: new FormControl(),
    class: new FormControl(),
    itemsLoadSize: new FormControl(this.itemsLoadSize),
    loading: new FormControl(),
    showCallingCode: new FormControl(false, [Validators.required]),
    // excludedCountries: new FormControl(),
    name: new FormControl("country", [Validators.required]),
    error: new FormControl(),
    cleareable: new FormControl(false, [Validators.required]),
    extendWidth: new FormControl(false, [Validators.required]),
    panelWidth: new FormControl(this.panelWidth),
    panelDisabled: new FormControl(this.panelDisabled, [Validators.required]),
    value: new FormGroup({
      alpha2Code: new FormControl(this.value?.alpha2Code, [
        Validators.pattern(/^[A-Z]{2}$/),
      ]),
    }),
    hint: new FormControl(),
    lang: this.languageControl,
  });

  ngOnInit() {
    this.countryFormGroup.valueChanges.subscribe((change) => {
      if (this.countryFormGroup.valid) {
        if (
          this.value?.alpha2Code != this.countryFormGroup.value.value.alpha2Code
        ) {
          this.value = {
            alpha2Code: this.countryFormGroup.value.value.alpha2Code,
          };
        }
        if (this.appearance !== this.countryFormGroup.value.appearance) {
          this.appearance = this.countryFormGroup.value.appearance as
            | "fill"
            | "outline";
        }
        if (this.label !== this.countryFormGroup.value.label) {
          this.label = this.countryFormGroup.value.label;
        }
        if (this.placeHolder !== this.countryFormGroup.value.placeHolder) {
          this.placeHolder = this.countryFormGroup.value.placeHolder;
        }
        if (this.class !== this.countryFormGroup.value.class) {
          this.class = this.countryFormGroup.value.class;
        }
        if (this.name !== this.countryFormGroup.value.name) {
          this.name = this.countryFormGroup.value.name;
        }
        if (this.error !== this.countryFormGroup.value.error) {
          this.error = this.countryFormGroup.value.error;
        }
        if (this.required !== this.countryFormGroup.value.required) {
          this.required = this.countryFormGroup.value.required;
        }
        if (this.disabled !== this.countryFormGroup.value.disabled) {
          this.disabled = this.countryFormGroup.value.disabled;
        }
        if (this.readonly !== this.countryFormGroup.value.readonly) {
          this.readonly = this.countryFormGroup.value.readonly;
        }
        if (
          this.showCallingCode !== this.countryFormGroup.value.showCallingCode
        ) {
          this.showCallingCode = this.countryFormGroup.value.showCallingCode;
        }
        if (this.cleareable !== this.countryFormGroup.value.cleareable) {
          this.cleareable = this.countryFormGroup.value.cleareable;
        }
        if (this.extendWidth !== this.countryFormGroup.value.extendWidth) {
          this.extendWidth = this.countryFormGroup.value.extendWidth;
        }
        if (this.loading !== this.countryFormGroup.value.loading) {
          this.loading = this.countryFormGroup.value.loading;
        }
        if (this.language !== this.countryFormGroup.value.lang) {
          this.language = this.countryFormGroup.value.lang;
        }
        if (this.panelWidth !== this.countryFormGroup.value.panelWidth) {
          this.panelWidth = this.countryFormGroup.value.panelWidth;
          this._panelWidth = this.panelWidth + "px";
        }
        if (this.panelDisabled !== this.countryFormGroup.value.panelDisabled) {
          this.panelDisabled = this.countryFormGroup.value.panelDisabled;
          this._panelWidth = this.panelDisabled
            ? undefined
            : this.panelWidth + "px";
        }
        if (this.hint !== this.countryFormGroup.value.hint) {
          this.hint = this.countryFormGroup.value.hint;
        }
        if (this.itemsLoadSize !== this.countryFormGroup.value.itemsLoadSize) {
          this.itemsLoadSize = this.countryFormGroup.value.itemsLoadSize;
        }
      }
    });
  }

  onCountrySelected($event: Country): void {
    console.log("All example: onCountrySelected", $event);
  }
}
