import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
//import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})

export class DataJsonService {

  constructor(private http: HttpClient) { }

  public details: any = []; 
  urlRemota = "http://huellascheck.000webhostapp.com";
  urlLocal = "http://192.168.1.70/HuellaProject";
  urlESP32 = "http://192.168.1.74";

  public getDataUsers(): Observable<any> {
    return this.http.get(this.urlRemota);
  }
  public getAccess(): Observable<any> {
    return this.http.get(this.urlRemota + '/api/Api.php?apicall=getAccessRegister')
  }
  public getIP(ip): Observable<any> {
    this.urlESP32 = "http://"+ip
    return this.http.get(this.urlESP32+'/ScannFinger')
  }
  public getConsultores(): Observable<any> {
    return this.http.get(this.urlRemota + '/api/Api.php?apicall=getConsultores')
  }
  /*public getRegistroAccesos(): Observable<any> {
    return this.http.get(this.urlRemota + '/api/Api.php?apicall=getAccesos');
  }*/
  public UpdateUser(formulario): Observable<any> {
    const body = new HttpParams()
      .set('id', formulario.id)
      .set('nombre', formulario.nombre)
      .set('siglas', formulario.siglas)
      .set('correo', formulario.correo)
      .set('area', formulario.area)
    
      return this.http.post(this.urlRemota+"/api/Api.php?apicall=updateUser",
      body,
      {headers:{ 
                  'Content-Type': 'application/x-www-form-urlencoded',
              }})/*
        .subscribe(data => {
          console.log(data);
        }, error => {
          //console.log(error.error.text);
          console.log(error);
    });*/
  }

  public getUsers(): Observable<any> {
    return this.http.get(this.urlRemota + '/api/Api.php?apicall=getUsers');
  }

  public SendDataNewUser(formulario, id): Observable<any> {
    return this.http.get(this.urlESP32 + '/AddFingerPrint?'
      + 'id=' + id
      + '&nombre=' + formulario.nombre
      + '&siglas=' + formulario.siglas
      + '&area=' + formulario.area
      + '&correo=' + formulario.correo)/*,
    {headers:{ 
        //'Access-Control-Allow-Origin': '*'
                  'Content-Type': 'application/x-www-form-urlencoded',
              }}).subscribe(data => {
          console.log(data);
          return data;
        }, error => {
          //console.log(error.error.text);
          return error;
    });
    this.http.post(this.urlESP32+'/AddFingerPrint?'
                                +'id='+formulario.id
                                +'&siglas='+formulario.siglas
                                +'&area='+formulario.area
                                +'&correo='+formulario.correo,
                                {headers:{ 
      'Content-Type': 'application/x-www-form-urlencoded',
      //'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, HEAD'
  }})
  .subscribe(data => {
    console.log(data);
   }, error => {
    console.log(error);
  });*//*
    const body = new HttpParams()
      .set('id', formulario.id)
      .set('siglas', formulario.siglas)
      .set('correo', formulario.correo)
      .set('area', formulario.area)
      
    this.http.post(this.urlRemota+"/api/Api.php?apicall=createUser",
      body,
      {headers:{ 
                  'Content-Type': 'application/x-www-form-urlencoded',
              }})
        .subscribe(data => {
          console.log(data);
        }, error => {
          //console.log(error.error.text);
          console.log(error);
    });*/
  }

  public DeleteUserByID(id): Observable<any> {
    return this.http.get(this.urlESP32 + '/DeleteFingerIDUser?'
      + 'id=' + id)
  }
}
