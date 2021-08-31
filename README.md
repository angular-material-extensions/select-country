<p align="center">
  <img alt="angular-material-extensions's logo"
   height="256px" width="256px" style="text-align: center;"
   src="https://cdn.jsdelivr.net/gh/angular-material-extensions/select-country@master/assets/angular-material-extensions-logo.svg">
</p>

# @angular-material-extensions/select-country - Angular Material component that allow users to select a country or nationality with an autocomplete feature - Angular V12 supported incl. schematics

[![npm version](https://badge.fury.io/js/%40angular-material-extensions%2Fselect-country.svg)](https://badge.fury.io/js/%40angular-material-extensions%2Fselect-country)
[![npm demo](https://img.shields.io/badge/demo-online-ed1c46.svg)](https://angular-material-extensions.github.io/select-country)
[![docs: typedoc](https://img.shields.io/badge/docs-typedoc-4D0080.svg)](https://angular-material-extensions.github.io/select-country/doc/index.html)
[![Join the chat at https://gitter.im/angular-material-extensions/Lobby](https://badges.gitter.im/angular-material-extensions/Lobby.svg)](https://gitter.im/angular-material-extensions/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/angular-material-extensions/select-country.svg?branch=master)](https://travis-ci.org/angular-material-extensions/select-country)
[![codecov](https://codecov.io/gh/angular-material-extensions/select-country/branch/master/graph/badge.svg)](https://codecov.io/gh/angular-material-extensions/select-country)
[![dependency Status](https://david-dm.org/angular-material-extensions/select-country/status.svg)](https://david-dm.org/angular-material-extensions/select-country)
[![devDependency Status](https://david-dm.org/angular-material-extensions/select-country/dev-status.svg?branch=master)](https://david-dm.org/angular-material-extensions/select-country#info=devDependencies)
[![Greenkeeper Badge](https://badges.greenkeeper.io/angular-material-extensions/select-country.svg)](https://greenkeeper.io/)
[![license](https://img.shields.io/github/license/angular-material-extensions/select-country.svg?style=flat-square)](https://github.com/angular-material-extensions/select-country/blob/master/LICENSE)

<p align="center">
  <img alt="@angular-material-extensions/select-country demonstration" style="text-align: center;"
   src="https://raw.githubusercontent.com/angular-material-extensions/select-country/HEAD/assets/v0.2.0/select-country.gif">
</p>

<p align="center">
  <img alt="@angular-material-extensions/select-country demonstration" style="text-align: center;"
   src="https://raw.githubusercontent.com/angular-material-extensions/select-country/HEAD/assets/v0.2.0/select-country.png">
</p>

## Built by and for developers :heart:
Do you have any question or suggestion ? Please do not hesitate to contact us!
Alternatively, provide a PR | open an appropriate issue [here](https://github.com/angular-material-extensions/select-country/issues)

If you like this project, support [angular-material-extensions](https://github.com/angular-material-extensions)
by starring :star: and sharing it :loudspeaker:

## Table of Contents
- [Demo](#demo)
- [Components](#components)
- [Dependencies](#dependencies)
- [Installation](#installation)
- [API](#api)
- [Usage](#usage)
- [Run Demo App Locally](#run-demo-app-locally)
- [Other Angular Libraries](#other-angular-libraries)
- [Support](#support)
- [License](#license)

<a name="demo"/>

## [Demo](https://angular-material-extensions.github.io/select-country)

View all the directives and components in action at [https://angular-material-extensions.github.io/select-country](https://angular-material-extensions.github.io/select-country)

<a name="components"/>

## Library's components
- `<mat-select-country>` used to display the main component

---

<a name="dependencies"/>

## Dependencies
* [Angular](https://angular.io) developed and tested with `12.x`

---

<a name="installation"/>

##  [Installation](https://angular-material-extensions.github.io/select-country/getting-started)

## 1. Install via *ng add*. (Recommended)

If Angular Material Design is not setup, just run `ng add @angular/material` [learn more](https://material.angular.io/guide/getting-started)

Now add the library via the `angular schematics`
```shell
ng add @angular-material-extensions/select-country
```

## 2. Install via *npm*. (Alternative)

Install peer dependencies
```shell
npm i svg-country-flags -s
```

then update your `angular.json` like below (svg-country-flags)

```json
"assets": [
              "src/favicon.ico",
              "src/assets",
              {
                "glob": "**/*",
                "input": "./node_modules/svg-country-flags/svg",
                "output": "src/assets/svg-country-flags/svg"
              }
            ],
```

Now install `@angular-material-extensions/select-country` via:

```shell
npm install --save @angular-material-extensions/select-country
```

### Import the library

If you installed the library via angular schematics, you can skip this step

Once installed you need to import the main module and the `HttpClientModule`:

```js
import { MatSelectCountryModule } from "@angular-material-extensions/select-country";
```

```typescript
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, ...],
  imports: [
              MatSelectCountryModule.forRoot('de'), // you can use 'br' | 'de' | 'en' | 'es' | 'fr' | 'hr' | 'it' | 'nl' | 'pt' --> MatSelectCountrySupportedLanguages
             HttpClientModule, ...],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

in other modules

```typescript
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, ...],
  imports: [MatSelectCountryModule, HttpClientModule, ...],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

Other modules in your application like for lazy loading import `MatSelectCountryModule` into your feature module:

<a name="api"/>

## API

### `<mat-select-country>` used to display the main component - [see the demo examples](https://angular-material-extensions.github.io/select-country/examples)

| option            |    bind    |           type           |             default             | description                                                                                        |
| :---------------- | :--------: | :----------------------: | :-----------------------------: | :------------------------------------------------------------------------------------------------- |
| value             | `Input()`  |        `Country`         |                -                | the selected country (pass an empty Country object with alpha2 code populated to do alpha2 lookup) |
| appearance        | `Input()`  | `MatFormFieldAppearance` |                -                | Possible appearance styles for `mat-form-field` ('legacy', 'standard', 'fill' or 'outline')        |
| countries         | `Input()`  |       `Country[]`        | All countries stored in the lib | Countries that should be loaded - predefine the countries that you only need!                      |
| label             | `Input()`  |        `boolean`         |                -                | `mat-form-field` label's text                                                                      |
| itemsLoadSize     | `Input()`  |         `number`         |                -                | the number of countries that should be fetched --> improves the performance                        |
| placeHolder       | `Input()`  |        `boolean`         |                -                | input placeholder text                                                                             |
| disabled          | `Input()`  |        `boolean`         |                -                | Whether the component is disabled                                                                  |
| loading           | `Input()`  |        `boolean`         |                -                | Whether the component is loading                                                                   |
| nullable          | `Input()`  |        `boolean`         |                -                | Whether the component is able to emit `null`                                                       |
| readonly          | `Input()`  |        `boolean`         |                -                | Whether the component is read only                                                                 |
| tabIndex          | `Input()`  |    `number | string`     |                -                | Whether the component can be focused, and where it participates in sequential keyboard navigation  |
| showCallingCode   | `Input()`  |        `boolean`         |              false              | Whether the component to show the country's calling code in the label and selection                |
| class             | `Input()`  |         `string`         |                -                | Class attribute apply style to input text or validation ignore (optional)                          |
| onCountrySelected | `Output()` | `EventEmitter<Country>`  |                -                | emits the selected country as object (see the interface below)                                     |

```typescript
interface Country {
  name: string;
  alpha2Code: string;
  alpha3Code: string;
  numericCode: string;
  callingCode: string;
}
```


<a name="usage"/>

## [Usage](https://angular-material-extensions.github.io/select-country)

add the `<mat-select-country>` element to your template:

```html
<mat-select-country>
</mat-select-country>
```

<p align="center">
  <img alt="@angular-material-extensions/select-country demonstration" style="text-align: center;"
   src="https://raw.githubusercontent.com/angular-material-extensions/select-country/HEAD/assets/v0.2.0/example_full.png">
</p>

<p align="center">
  <img alt="@angular-material-extensions/select-country demonstration" style="text-align: center;"
   src="https://raw.githubusercontent.com/angular-material-extensions/select-country/HEAD/assets/v0.2.0/example3.png">
</p>

<p align="center">
  <img alt="@angular-material-extensions/select-country demonstration" style="text-align: center;"
   src="https://raw.githubusercontent.com/angular-material-extensions/select-country/HEAD/assets/v0.2.0/example2.png">
</p>


#### Use the library with reactive forms

### option 1 with Reactive Forms

```html
<mat-select-country appearance="outline"
                    label="Country"
                    [formControl]="countryFormControl"
                    (onCountrySelected)="onCountrySelected($event)">
</mat-select-country>
```

### option 2 with Reactive Forms

```html
<form [formGroup]="countryFormGroup">
    <div fxLayoutAlign="center">
      <mat-select-country appearance="outline"
                          label="Country"
                          class="className"
                          formControlName="country"
                          (onCountrySelected)="onCountrySelected($event)">
      </mat-select-country>
    </div>
  </form>
```

```typescript
import {Component,OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';

import {Country} from '@angular-material-extensions/select-country';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'select-country';

  countryFormControl = new FormControl();
  countryFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    angulartics2GoogleAnalytics.startTracking();
  }

  ngOnInit(): void {

    this.countryFormGroup = this.formBuilder.group({
      country: []
    });

    this.countryFormGroup.get('country').valueChanges
.subscribe(country => console
.log('this.countryFormGroup.get("country").valueChanges', country));

    this.countryFormControl.valueChanges
.subscribe(country => console
.log('this.countryFormControl.valueChanges', country));
  }


  onCountrySelected($event: Country) {
    console.log($event);
  }
}

```


### Predefine your countries to load

```html
<mat-select-country appearance="outline"
                    label="Country"
                    [countries]="predefinedCountries"
                    (onCountrySelected)="onCountrySelected($event)">
</mat-select-country>
```

```typescript
import {Country} from '@angular-material-extensions/select-country';

predefinedCountries: Country[] = [
  {
    name: 'Germany',
    alpha2Code: 'DE',
    alpha3Code: 'DEU',
    numericCode: '276',
    callingCode: '+49'
  },
  {
    name: 'Greece',
    alpha2Code: 'GR',
    alpha3Code: 'GRC',
    numericCode: '300',
    callingCode: '+30'
  },
  {
    name: 'France',
    alpha2Code: 'FR',
    alpha3Code: 'FRA',
    numericCode: '250',
    callingCode: '+33'
  },
  {
    name: 'Belgium',
    alpha2Code: 'BE',
    alpha3Code: 'BEL',
    numericCode: '056',
    callingCode: '+32'
  }
];
```

Result:

<p align="center">
  <img alt="@angular-material-extensions/select-country demonstration" style="text-align: center;"
   src="https://raw.githubusercontent.com/angular-material-extensions/select-country/HEAD/assets/v2.1.0/predefined.png">
</p>


### Improve performance - use the `itemsLoadSize` property

```html
<mat-select-country appearance="outline"
                    label="Country"
                    [itemsLoadSize]="5">
</mat-select-country>
```

only 5 countries will fetched!



<a name="run-demo-app-locally"/>

###  Run Demo App Locally


Build the library

```bash
$ npm run build:lib
```

Serve the demo app

```bash
$ npm start
```



## Other Angular Libraries
- [ngx-auth-firebaseui](https://github.com/AnthonyNahas/ngx-auth-firebaseui)
- [ngx-linkifyjs](https://github.com/AnthonyNahas/ngx-linkifyjs)
- [@angular-material-extensions/password-strength](https://github.com/angular-material-extensions/password-strength)
- [@angular-material-extensions/google-maps-autocomplete](https://github.com/angular-material-extensions/google-maps-autocomplete)
- [@angular-material-extensions/link-preview](https://github.com/angular-material-extensions/link-preview)
- [@angular-material-extensions/fab-menu](https://github.com/angular-material-extensions/fab-menu)
- [@angular-material-extensions/pages](https://github.com/angular-material-extensions/pages)
- [@angular-material-extensions/contacts](https://github.com/angular-material-extensions/contacts)
---

<a name="support"/>

## Support
+ Drop an email to: [Anthony Nahas](mailto:anthony.na@hotmail.de)
+ or open an appropriate [issue](https://github.com/angular-material-extensions/select-country/issues)
+ let us chat on [Gitter](https://gitter.im/angular-material-extensions/Lobby)

 Built by and for developers :heart: we will help you :punch:

---

![jetbrains logo](https://raw.githubusercontent.com/angular-material-extensions/select-country/HEAD/assets/jetbrains-variant-4_logos/jetbrains-variant-4.png)

This project is supported by [jetbrains](https://www.jetbrains.com/) with 1 ALL PRODUCTS PACK OS LICENSE incl. [webstorm](https://www.jetbrains.com/webstorm)

---

<a name="license"/>

## License

Copyright (c) 2020-2021 [Anthony Nahas](https://github.com/AnthonyNahas). Licensed under the MIT License (MIT) <p align="center">
                                                                                                            <img alt="angular-material-extensions's logo"
                                                                                                             height="92px" width="92px" style="text-align: center;"
                                                                                                             src="https://cdn.jsdelivr.net/gh/angular-material-extensions/select-country@master/assets/badge_made-in-germany.svg">
                                                                                                          </p>
