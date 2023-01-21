```typescript
import { Component, OnInit } from "@angular/core";
import { Country } from "@angular-material-extensions/select-country";

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
  hint?: string | undefined;

  onCountrySelected($event: Country): void {
    console.log("All example: onCountrySelected", $event);
  }
}

```