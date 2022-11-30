import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
    initialNavigation: 'enabledNonBlocking'
}),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
