import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MatSelectCountryComponent} from './mat-select-country.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { SimpleChange } from '@angular/core';

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

  it('should load 203 countries', () => {
    expect(component.countries.length).toEqual(203);
  });

  it('should load all countries (203) if the input value is empty', async () => {
    prepare(inputElement, '');

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const matOptions = document.querySelectorAll('mat-option');
    expect(matOptions.length).toEqual(203);
  });

  it('should load all countries (4) if the input value is equal to `ger` ', async () => {

    prepare(inputElement, 'ger');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const matOptions = document.querySelectorAll('mat-option');
    expect(matOptions.length).toEqual(4);
  });

  it('should find only germany ', async () => {

    prepare(inputElement, 'germany');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const matOptions = document.querySelectorAll('mat-option');
    expect(matOptions.length).toEqual(1);

    await fixture.whenStable();

    const optionToClick = matOptions[0] as HTMLElement;
    optionToClick.click();
    fixture.detectChanges();

    expect(component.value).toStrictEqual({
      name: 'Germany',
      alpha2Code: 'DE',
      alpha3Code: 'DEU',
      numericCode: '276'
    });
  });

  it('should set correct value', async () => {

    component.ngOnChanges({
      country: new SimpleChange(undefined, 'de', true)
    });

    await fixture.whenStable();

    expect(inputElement.value).toMatch('Germany');
  });

  it('should set empty value', async () => {

    component.ngOnChanges({
      country: new SimpleChange(undefined, 'de', true)
    });
    component.ngOnChanges({
      country: new SimpleChange('de', undefined, false)
    });

    await fixture.whenStable();

    expect(inputElement.value).toMatch('');
  });

  it('should rollback input', async () => {

    component.ngOnChanges({
      country: new SimpleChange(undefined, 'de', true)
    });

    await fixture.whenStable();

    inputElement.value = 'test';
    inputElement.dispatchEvent(new Event('input'));
    inputElement.dispatchEvent(new Event('blur'));

    await fixture.whenStable();

    expect(inputElement.value).toMatch('Germany');
  });

  it('should reset value', async () => {

    component.nullable = true;
    component.ngOnChanges({
      country: new SimpleChange(undefined, 'de', true)
    });

    await fixture.whenStable();

    inputElement.value = '';
    inputElement.dispatchEvent(new Event('input'));
    inputElement.dispatchEvent(new Event('blur'));

    await fixture.whenStable();

    expect(component.value).toBeNull();
  });
});

function prepare(inputElement: HTMLInputElement, value: string) {
  inputElement.dispatchEvent(new Event('input'));
  inputElement.dispatchEvent(new Event('focusin'));
  inputElement.value = value;
  inputElement.dispatchEvent(new Event('input'));
}
