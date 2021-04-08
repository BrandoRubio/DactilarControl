import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsUserPage } from './details-user.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsUserPageRoutingModule {}
