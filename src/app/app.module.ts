import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FlexLayoutModule } from "@angular/flex-layout";

import { MatSelectCountryModule } from "@angular-material-extensions/select-country";
import { MarkdownModule } from "ngx-markdown";
import { Angulartics2Module } from "angulartics2";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: "serverApp" }),
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatSelectModule,
    Angulartics2Module.forRoot(),
    MarkdownModule.forRoot(),
    MatSelectCountryModule.forRoot("de"),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
