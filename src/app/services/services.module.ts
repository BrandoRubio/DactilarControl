import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ServicesModule { 
  constructor( private http: HttpClient ){  }
/*
  getRemoteData(){
    return this.http.get("https://127.0.0.1/pruebas/consultaDatos.php");
  }*/
}


