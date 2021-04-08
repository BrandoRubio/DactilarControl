import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowAccessPageRoutingModule } from './show-access-routing.module';

import { ShowAccessPage } from './show-access.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowAccessPageRoutingModule
  ],
  declarations: [ShowAccessPage]
})
export class ShowAccessPageModule {}
