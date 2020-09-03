import {InjectionToken} from '@angular/core';
import {Country} from '../mat-select-country.component';

export const MatSelectCountryDBToken = new InjectionToken<Country[]>('MatSelectCountryDBToken');
