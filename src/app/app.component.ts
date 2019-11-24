import {Component} from '@angular/core';
import {Country} from '@angular-material-extensions/select-country';
import {Angulartics2GoogleAnalytics} from 'angulartics2/ga';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'select-county';

  constructor(angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
    angulartics2GoogleAnalytics.startTracking();
  }

  onCountrySelected($event: Country) {
    console.log($event);
  }
}
