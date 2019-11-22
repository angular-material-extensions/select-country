import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSelectCountryComponent } from './mat-select-country.component';
// import {MatInputModule} from '@angular/material';

describe('SelectCountryComponent', () => {
  let component: MatSelectCountryComponent;
  let fixture: ComponentFixture<MatSelectCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatSelectCountryComponent ],
      // imports : [MatInputModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatSelectCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
