```typescript
import { Component, OnInit } from "@angular/core";
import { Country } from "@angular-material-extensions/select-country";
import { GERMANY_COUNTRY } from "../contants";

@Component({
  selector: "app-default",
  templateUrl: "./default.component.html",
  styleUrls: ["./default.component.scss"],
})
export class DefaultComponent implements OnInit {
  defaultCountry: Country = {
    name: "Deutschland",
    alpha2Code: "DE", // This is the only one required.
    alpha3Code: "DEU",
    numericCode: "276",
    callingCode: "+49",
  };

  onCountrySelected($event: Country): void {
    console.log("Default example: onCountrySelected", $event);
  }
}

```