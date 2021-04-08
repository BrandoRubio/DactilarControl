import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsUserPageRoutingModule } from './details-user-routing.module';

import { DetailsUserPage } from './details-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DetailsUserPageRoutingModule
  ],
  declarations: [DetailsUserPage]
})
export class DetailsUserPageModule {}
