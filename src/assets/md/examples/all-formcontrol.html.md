```html
<form [formGroup]="countryComponentFormGroup">
    <mat-select-country
      formControlName="country"
      [appearance]="appearance"
      [countries]="countries"
      [label]="label"
      [placeHolder]="placeHolder"
      [readonly]="readonly"
      [tabIndex]="2"
      [class]="class"
      [itemsLoadSize]="itemsLoadSize"
      [loading]="loading"
      [showCallingCode]="showCallingCode"
      [excludedCountries]="excludedCountries"
      [language]="language"
      [name]="name"
      [cleareable]="cleareable"
      [panelWidth]="_panelWidth"
      [extendWidth]="extendWidth"
      [error]="error"
      [hint]="hint"
      (onCountrySelected)="onCountrySelected($event)"
    >
    </mat-select-country>
    <br />
    <button
      mat-raised-button
      type="submit"
      [disabled]="!countryComponentFormGroup.valid"
      (click)="nothing()"
    >
      Submit
    </button>
    <br />
    <button mat-raised-button (click)="setGermany()">Set Germany</button>
  </form>
```