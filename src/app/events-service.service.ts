import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsServiceService {
  
  constructor() { }
  private DataUser : any;
  private DataNewUser : any;
  private Consultores: any;


  publishDataUser(data: any) {
    //console.log("recived");
    this.DataUser = data
  }
  publishNewUser(data: any) {
    //console.log("recived");
    this.DataNewUser = data
  }

  getDataUser(): Observable<any> {
    //console.log("send");
    return this.DataUser;
  }
  getDataNewUser(): Observable<any> {
    //console.log("send");
    return this.DataNewUser;
  }
  dropDataNewUser(){
    this.DataNewUser = []
  }
  saveConsultores(consultores : any){
    this.Consultores = consultores;
  }
  
  getConsultores(): Array<string>{    
    return this.Consultores;
  }
}
