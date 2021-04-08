import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowAccessPage } from './show-access.page';

const routes: Routes = [
  {
    path: '',
    component: ShowAccessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowAccessPageRoutingModule {}
