```typescript
import { Component, OnInit } from "@angular/core";
import { Country } from "@angular-material-extensions/select-country";
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
  error?: string | undefined;
  cleareable: boolean = false;
  extendWidth: boolean = false;
  _panelWidth?: string | undefined;
  hint?: string | undefined;

  countryComponentFormGroup = new FormGroup({
    country: new FormControl(
      { value: null /*{ ...GERMANY_COUNTRY }*/, disabled: false },
      [Validators.required]
    ),
  });

  nothing() {}

  setGermany() {
    this.countryComponentFormGroup.setValue({
      country: { ...GERMANY_COUNTRY },
    });
  }

  onCountrySelected($event: Country): void {
    console.log("All formControl example: onCountrySelected", $event);
  }
}

```