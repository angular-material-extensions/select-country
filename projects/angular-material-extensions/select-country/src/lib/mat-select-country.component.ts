import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {COUNTRIES_DB} from './db';

/**
 * Country interface ISO 3166
 */
export interface Country {
  name: string;
  alpha2Code: string;
  alpha3Code: string;
  numericCode: string;
}

@Component({
  selector: 'mat-select-country',
  templateUrl: 'mat-select-country.component.html',
  styleUrls: ['mat-select-country.component.scss']
})
export class MatSelectCountryComponent implements OnInit {

  countries: Country[] = COUNTRIES_DB;
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  // @Input() menuItems: MatMenuButtonItem[] = [];
  @Input() height: string;

  @Output() onCountrySelected: EventEmitter<string> = new EventEmitter<string>();

  // selectedMenuItem: MatMenuButtonItem;

  ngOnInit() {
  }


}
