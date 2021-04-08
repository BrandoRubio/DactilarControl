import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab2Page } from './tab2.page';
import { Tab3Page } from '../tab3/tab3.page';

const routes: Routes = [
  {
    path: '',
    component: Tab2Page},
  {
    path: 'detailsPage', loadChildren: () => import('../details-user/details-user.module').then(m => m.DetailsUserPageModule)
  },
  {
    path: 'addUser', loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
  }

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab2PageRoutingModule {}