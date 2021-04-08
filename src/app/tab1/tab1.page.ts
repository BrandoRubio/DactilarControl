import { Component } from '@angular/core';
import { DataJsonService } from '../data-json.service';
import { AlertController, MenuController } from '@ionic/angular';
import { interval, Subscription } from 'rxjs';
import { ToastController, LoadingController } from '@ionic/angular';
import { AppComponent } from '../app.component'
import { Storage } from '@ionic/storage';
//import { HttpClient, HttpHeaderResponse } from '@angular/common/http';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public lista: Array<string>
  public filtro = false;
  private textoIn = "Buscando registros"
  private idFilter;
  private siglasFilter = "";
  private nombreFilter = "";
  public colorFilter = "primary"
  public fechaFilter = ""
  public tiempoRecarga = 3000
  noElements = false
  public Elements: Array<string>
  public fech = new Date(Date.now())

  constructor(private serviceGetJson: DataJsonService,
    private menu: MenuController,
    public toastController: ToastController,
    public alertController: AlertController,
    public appComponent: AppComponent,
    public loadingController: LoadingController,
    private storage: Storage) {
  }

  openMenu() {
    this.appComponent.colsultarIP();
    this.menu.toggle();
  }

  ngOnInit() {
  }
  doRefresh(event) {
    this.appComponent.colsultarIP();
    this.fechaFilter = this.getFechaDeHoy()
    this.reloadDataAccess();
    setTimeout(() => {
      //console.log('Async operation has ended');
      event.target.complete();
    }, 200);
  }

  async showDetailsRegister(register) {
    const alert = await this.alertController.create({
      //cssClass: 'my-custom-class',
      header: 'Detalles del acceso',
      message:
        '<dl>' +
        '<li>Siglas: <strong>' + register.siglas + '</strong></li>' +
        '<li>Nombre corto: <br><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + register.nombre + '</strong></li>' +
        '<li>Entrada: <br><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + register.Fecha_Hora + '</strong></li>' +
        '<li>Salida: <br><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + register.Fecha_Hora_Salida + '</strong></li>' +
        '</dl>',
      //'Siglas:\t'+register.siglas+'\nEntrada:\t'+register.Fecha_Hora+'\nSalida:\t'+register.Fecha_Hora_Salida,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentLoading(message) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: message,
      duration: 20000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    //console.log('Loading dismissed!');
  }
  ionViewDidEnter() {
    //this.presentLoading("Cargando listado de accesos...")
    this.appComponent.colsultarIP();
    this.fechaFilter = this.getFechaDeHoy()
    this.reloadDataAccess();
  }
  getFechaDeHoy() {
    let formatoFecha
    formatoFecha = this.fech.getFullYear() + '-'
    if (this.fech.getMonth() < 10) {
      formatoFecha = formatoFecha + '0' + (this.fech.getMonth() + 1) + '-'
    } else {
      formatoFecha = formatoFecha + this.fech.getMonth() + 1 + '-'
    }
    if (this.fech.getDate() < 10) {
      formatoFecha = formatoFecha + '0' + this.fech.getDate()
    } else {
      formatoFecha = formatoFecha + this.fech.getDate()
    }
    return formatoFecha;
  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  reloadDataAccess() {
    //this.presentLoading("Cargando listado de accesos...")
    this.serviceGetJson.getAccess().subscribe(data => {
      //this.lista = data.registers;
      let arrayList = data.registers;
      if (this.filtro) {
        this.colorFilter = "success"
        for (var i = 0; i < arrayList.length; i++) {
          if (arrayList[i].siglas.toLowerCase().startsWith(this.siglasFilter) ||
            arrayList[i].nombre.toLowerCase().startsWith(this.nombreFilter) ||
            arrayList[i].Fecha_Hora.startsWith(this.fechaFilter)) {
            if (!arrayList[i].siglas.toLowerCase().startsWith(this.siglasFilter) && this.siglasFilter != "") {
              arrayList.splice(i, 1)
              i--
            } else
              if (!arrayList[i].nombre.toLowerCase().startsWith(this.nombreFilter) && this.nombreFilter != "") {
                arrayList.splice(i, 1)
                i--
              } else
                if (!arrayList[i].Fecha_Hora.startsWith(this.fechaFilter) && this.fechaFilter != "") {
                  arrayList.splice(i, 1)
                  i--
                }
          } else {
            arrayList.splice(i, 1)
            i--
          }
        }
      } else {
        this.colorFilter = "primary"
      }
      for (var i = 0; i < arrayList.length; i++) {
        if (arrayList[i].Fecha_Hora_Salida == "0000-00-00 00:00:00") {
          arrayList[i].Fecha_Hora_Salida = "Abierto"
          arrayList[i].color = "danger"
        } else {
          arrayList[i].color = "success"
        }
      }
      this.lista = arrayList;
      if (this.lista.length == 0) {
        this.noElements = false
        this.textoIn = "No hay registros relacionados con esta búsqueda"
      } else {
        this.noElements = true
      }
      if(data.registers.length== 0){
        this.textoIn = "Aún no se han registrado accesos."
      }
      //this.loadingController.dismiss()
    });
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'class-for-alert',
      header: 'Filtro de búsqueda',
      inputs: [
        /*{
          name: 'id',
          type: 'number',
          placeholder: 'ID                  ej. 107',
          value: this.idFilter
        },*/
        {
          name: 'siglas',
          type: 'text',
          placeholder: 'Siglas          ej. BRRS',
          value: this.siglasFilter
        },
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre        ej. Brando R',
          value: this.nombreFilter
        },/*
        // multiline input.
        {
          name: 'lugar',
          type: 'text',
          placeholder: 'Lugar          ej. Casa',
          value: this.lugarFilter
        },*/
        // input date with min & max
        {
          name: 'fecha',
          type: 'date',
          value: this.fechaFilter,
          min: '2021-01-01',
          max: this.getFechaDeHoy()//'2021-03-12'
        }
      ],
      buttons: [
        {
          text: 'Borrar filtro',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.idFilter = "";
            this.siglasFilter = "";
            this.nombreFilter = "";
            this.fechaFilter = this.getFechaDeHoy();
            this.presentToast("Filtro desactivado")
            this.filtro = false
            this.reloadDataAccess()
          }
        }, {
          text: 'Confirmar',
          handler: (alertData) => {
            this.idFilter = parseInt(alertData.id)
            this.siglasFilter = alertData.siglas.toLowerCase()
            this.nombreFilter = alertData.nombre.toLowerCase()
            this.fechaFilter = alertData.fecha
            if (isNaN(this.idFilter) && this.siglasFilter == "" && this.nombreFilter == "" && this.fechaFilter == "") {
              this.presentToast("No hay filtros activos")
              this.filtro = false
            } else {
              this.presentToast("Filtro activado")
              this.filtro = true
              this.reloadDataAccess()
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
