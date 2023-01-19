import { Component, OnInit } from "@angular/core";
import { Country } from "@angular-material-extensions/select-country";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { GERMANY_COUNTRY } from "../contants";

@Component({
  selector: "app-all-formcontrol",
  templateUrl: "./all-formcontrol.component.html",
  styleUrls: ["./all-formcontrol.component.scss"],
})
export class AllFormControlComponent implements OnInit {
  appearance: "fill" | "outline" = "outline";
  countries: Country[] = [];
  label: string = "Label";
  placeHolder = "Select country";
  readonly: boolean;
  tabIndex: number | string;
  class: string;
  itemsLoadSize: number = 20;
  loading: boolean;
  showCallingCode = false;
  excludedCountries: Country[] = [];
  language: string;
  name: string = "country";
  // error: string = "";
  cleareable: boolean = false;
  extendWidth: boolean = false;
  formControl?: FormControl = new FormControl(
    { value: { ...GERMANY_COUNTRY }, disabled: false },
    [Validators.required]
  );
  _panelWidth?: string | undefined;
  value: Country | null = null;

  // helper variables
  panelWidth: number = 100;
  panelDisabled = true;

  countryFormGroup = new FormGroup({
    appearance: new FormControl({ value: "outline", disabled: false }, [
      Validators.required,
    ]),
    // countries: new FormControl(),
    label: new FormControl({ value: "Label", disabled: false }, [
      Validators.required,
    ]),
    placeHolder: new FormControl("Select country", [Validators.required]),
    readonly: new FormControl(),
    // tabIndex: new FormControl(),
    class: new FormControl(),
    // itemsLoadSize: new FormControl(),
    loading: new FormControl(),
    showCallingCode: new FormControl(false, [Validators.required]),
    // excludedCountries: new FormControl(),
    // language: new FormControl(),
    name: new FormControl("country", [Validators.required]),
    cleareable: new FormControl(false, [Validators.required]),
    extendWidth: new FormControl(false, [Validators.required]),
    // formControl: new FormControl(),
    panelWidth: new FormControl(this.panelWidth),
    panelDisabled: new FormControl(this.panelDisabled, [Validators.required]),
    value: new FormGroup({
      alpha2Code: new FormControl(this.value?.alpha2Code, [
        Validators.pattern(/^[A-Z]{2}$/),
      ]),
    }),
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
      }
    });
  }

  onCountrySelected($event: Country): void {
    console.log("All formControl example: onCountrySelected", $event);
  }
}
