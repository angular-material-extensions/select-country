import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {COUNTRIES_DB} from './db';
import {fromEvent, Subject, Subscription} from 'rxjs';
import {debounceTime, startWith, takeUntil} from 'rxjs/operators';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {MatFormFieldAppearance} from '@angular/material/form-field';

/**
 * Country interface ISO 3166
 */
export interface Country {
  name: string;
  alpha2Code: string;
  alpha3Code: string;
  numericCode: string;
}

/**
 * @author Anthony Nahas
 * @since 11.19
 * @version 1.0
 */
@Component({
  selector: 'mat-select-country',
  templateUrl: 'mat-select-country.component.html',
  styleUrls: ['mat-select-country.component.scss']
})
export class MatSelectCountryComponent implements OnInit, OnChanges, OnDestroy {

  @Input() appearance: MatFormFieldAppearance;
  @Input() country: string;
  @Input() label: string;
  @Input() placeHolder = 'Select country';
  @Input() disabled: boolean;
  @Input() nullable: boolean;
  @Input() readonly: boolean;
  @Input() itemsLoadSize: number;
  @ViewChild('countryAutocomplete') statesAutocompleteRef: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  @Output() onCountrySelected: EventEmitter<Country> = new EventEmitter<Country>();

  countryFormControl = new FormControl();
  selectedCountry: Country;
  countries: Country[] = COUNTRIES_DB;
  filteredOptions: Country[];

  private modelChanged: Subject<string> = new Subject<string>();
  private subscription: Subscription;
  debounceTime = 300;

  filterString = '';

  ngOnInit() {
    this.subscription = this.modelChanged
      .pipe(
        startWith(''),
        debounceTime(this.debounceTime),
      )
      .subscribe((value) => {
        this.filterString = value;
        this._filter(value);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.country) {
      if (changes.country.currentValue) {
        const newValue = changes.country.currentValue.toUpperCase();
        this.selectedCountry = this.countries.find(country =>
          country.name.toUpperCase() === newValue
          || country.alpha2Code === newValue
          || country.alpha3Code === newValue
          || country.numericCode === newValue
        );
        this.countryFormControl.setValue(
          this.selectedCountry ? this.selectedCountry.name : ''
        );
      } else {
        this.selectedCountry = undefined;
        this.countryFormControl.setValue('');
      }
    }
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();

    // if not filtered, fetch reduced array
    if (this.itemsLoadSize && filterValue === '') {
      this.filteredOptions = this.countries.slice(0, this.itemsLoadSize);
    } else {
      this.filteredOptions = this.countries.filter((option: Country) =>
        option.name.toLowerCase().includes(filterValue)
        || option.alpha2Code.toLowerCase().includes(filterValue)
        || option.alpha3Code.toLowerCase().includes(filterValue)
      );
    }
  }

  onBlur() {
    if (this.countryFormControl.value || !this.nullable) {
      this.countryFormControl.setValue(
        this.selectedCountry ? this.selectedCountry.name : ''
      );
    } else if (this.selectedCountry) {
      this.selectedCountry = null;
      this.onCountrySelected.emit(null);
    }
  }

  onOptionsSelected($event: MatAutocompleteSelectedEvent) {
    this.selectedCountry = this.countries.find(country => country.name === $event.option.value);
    this.onCountrySelected.emit(this.selectedCountry);
  }

  autocompleteScroll() {
    if (this.itemsLoadSize) {
      setTimeout(() => {
        if (
          this.statesAutocompleteRef &&
          this.autocompleteTrigger &&
          this.statesAutocompleteRef.panel
        ) {
          fromEvent(this.statesAutocompleteRef.panel.nativeElement, 'scroll')
            .pipe(
              takeUntil(this.autocompleteTrigger.panelClosingActions)
            )
            .subscribe(() => {
              const scrollTop = this.statesAutocompleteRef.panel.nativeElement
                .scrollTop;
              const scrollHeight = this.statesAutocompleteRef.panel.nativeElement
                .scrollHeight;
              const elementHeight = this.statesAutocompleteRef.panel.nativeElement
                .clientHeight;
              const atBottom = scrollHeight === scrollTop + elementHeight;
              if (atBottom) {
                // fetch more data if not filtered
                if (this.filterString === '') {
                  const fromIndex = this.filteredOptions.length;
                  const toIndex: number = +this.filteredOptions.length + +this.itemsLoadSize;
                  this.filteredOptions = [...this.filteredOptions, ...this.countries.slice(fromIndex, toIndex)];
                }
              }
            });
        }
      });
    }

  }

  inputChanged(value: string): void {
    this.modelChanged.next(value);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
