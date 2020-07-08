import {Component, OnInit} from '@angular/core';
import {Country} from '@angular-material-extensions/select-country';
import {Angulartics2GoogleAnalytics} from 'angulartics2/ga';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'select-county';

  countryFormControl = new FormControl();
  countryFormGroup: FormGroup;

  constructor(angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
              private formBuilder: FormBuilder) {
    angulartics2GoogleAnalytics.startTracking();
  }

  onCountrySelected($event: Country) {
    console.log($event);
  }

  ngOnInit(): void {

    this.countryFormGroup = this.formBuilder.group({
      country: []
    });

    this.countryFormGroup.get('country').valueChanges.subscribe(country => console.log('this.countryFormGroup.get(\'country\').valueChanges', country));

    this.countryFormControl.valueChanges.subscribe(country => console.log('this.countryFormControl.valueChanges', country));
  }
}
