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
  nullable: boolean;
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
  // formControl?: FormControl | undefined = undefined;
  panelWidth: string | number = "";
  value: Country | null = null;

  countryFormGroup = new FormGroup({
    appearance: new FormControl({ value: "outline", disabled: false }, [
      Validators.required,
    ]),
    // countries: new FormControl(),
    label: new FormControl({ value: "Label", disabled: false }, [
      Validators.required,
    ]),
    placeHolder: new FormControl("Select country", [Validators.required]),
    // required: new FormControl(),
    // disabled: new FormControl(),
    // nullable: new FormControl(),
    // readonly: new FormControl(),
    // tabIndex: new FormControl(),
    class: new FormControl(),
    // itemsLoadSize: new FormControl(),
    // loading: new FormControl(),
    // showCallingCode: new FormControl(),
    // excludedCountries: new FormControl(),
    // language: new FormControl(),
    name: new FormControl("country", [Validators.required]),
    // cleareable: new FormControl(),
    // formControl: new FormControl(),
    // panelWidth: new FormControl(),
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
      }
    });
  }

  onCountrySelected($event: Country): void {
    console.log("All example: onCountrySelected", $event);
  }
}
