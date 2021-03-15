import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    FlexLayoutServerModule,
    ServerModule
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
