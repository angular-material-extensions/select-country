import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MatSelectCountryComponent} from './mat-select-country.component';
import {MatAutocompleteModule, MatIconModule, MatInputModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('SelectCountryComponent', () => {
  let component: MatSelectCountryComponent;
  let fixture: ComponentFixture<MatSelectCountryComponent>;
  let inputElement: HTMLInputElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MatSelectCountryComponent],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatAutocompleteModule,
        MatIconModule,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatSelectCountryComponent);
    component = fixture.componentInstance;
    inputElement = fixture.nativeElement.querySelector('input');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load 148 countries', () => {
    expect(component.countries.length).toEqual(148);
  });

  it('should load all countries (148) if the input value is empty', async () => {
    prepare(inputElement, '');

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const matOptions = document.querySelectorAll('mat-option');
    expect(matOptions.length).toEqual(148);
  });

  it('should load all countries (3) if the input value is equal to `ger` ', async () => {

    prepare(inputElement, 'ger');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const matOptions = document.querySelectorAll('mat-option');
    expect(matOptions.length).toEqual(3);
  });

  it('should find only germany ', async () => {

    prepare(inputElement, 'germany');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const matOptions = document.querySelectorAll('mat-option');
    expect(matOptions.length).toEqual(1);

    const optionToClick = matOptions[0] as HTMLElement;
    optionToClick.click();
    fixture.detectChanges();

    expect(component.selectedCountry).toStrictEqual({
      name: 'Germany',
      alpha2Code: 'DE',
      alpha3Code: 'DEU',
      numericCode: '276'
    });
  });
});

function prepare(inputElement: HTMLInputElement, value: string) {
  inputElement.dispatchEvent(new Event('input'));
  inputElement.dispatchEvent(new Event('focusin'));
  inputElement.value = value;
  inputElement.dispatchEvent(new Event('input'));
}
