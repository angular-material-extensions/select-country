import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FlexLayoutModule } from "@angular/flex-layout";

import { MatSelectCountryModule } from "@angular-material-extensions/select-country";
import { MarkdownModule } from "ngx-markdown";
import { Angulartics2Module } from "angulartics2";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MinimalComponent } from "./examples/minimal/minimal.component";
import { DefaultComponent } from "./examples/default/default.component";
import { MatInputModule } from "@angular/material/input";
import { AllComponent } from "./examples/all/all.component";

@NgModule({
  declarations: [
    AppComponent,
    MinimalComponent,
    DefaultComponent,
    AllComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: "serverApp" }),
    BrowserAnimationsModule,

    FormsModule,
    ReactiveFormsModule,

    HttpClientModule,
    AppRoutingModule,
    FlexLayoutModule,
    MatSelectModule,
    Angulartics2Module.forRoot(),
    MarkdownModule.forRoot(),
    MatSelectCountryModule.forRoot("de"),
    MatInputModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
