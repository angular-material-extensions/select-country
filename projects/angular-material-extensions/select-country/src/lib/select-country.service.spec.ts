import { TestBed } from '@angular/core/testing';

import { SelectCountryService } from './select-country.service';

describe('SelectCountryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectCountryService = TestBed.get(SelectCountryService);
    expect(service).toBeTruthy();
  });
});
