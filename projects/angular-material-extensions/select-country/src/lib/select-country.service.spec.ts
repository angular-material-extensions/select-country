import { TestBed } from '@angular/core/testing';

import { MatSelectCountryService } from './mat-select-country.service';

describe('SelectCountryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MatSelectCountryService = TestBed.get(MatSelectCountryService);
    expect(service).toBeTruthy();
  });
});
