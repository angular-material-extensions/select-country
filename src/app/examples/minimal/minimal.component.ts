import { Component } from "@angular/core";
import { Country } from "@angular-material-extensions/select-country";

@Component({
  selector: "app-minimal",
  templateUrl: "./minimal.component.html",
})
export class MinimalComponent {
  onCountrySelected($event: Country): void {
    console.log("Minimal example: onCountrySelected", $event);
  }
}
