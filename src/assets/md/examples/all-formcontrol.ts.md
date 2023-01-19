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
  label: string;
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
  cleareable: boolean = false;
  panelWidth: string | number = "";
  value: Country | null = null;

  onCountrySelected($event: Country): void {
    console.log("All example: onCountrySelected", $event);
  }
}
```