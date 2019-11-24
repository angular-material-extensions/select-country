import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSelectCountryModule} from '@angular-material-extensions/select-country';
import {HttpClientModule} from '@angular/common/http';
import {MarkdownModule} from 'ngx-markdown';
import {FlexLayoutModule} from '@angular/flex-layout';
import {BrowserModule} from '@angular/platform-browser';
import { Angulartics2Module } from 'angulartics2';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FlexLayoutModule,
    Angulartics2Module.forRoot(),
    MarkdownModule.forRoot(),
    MatSelectCountryModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
