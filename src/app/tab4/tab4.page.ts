import { Component, OnInit } from '@angular/core';
import { DataJsonService } from '../data-json.service';
import { AlertController, MenuController, NavController, ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { EventsServiceService } from '../events-service.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  siglasFilter = ""
  nombreFilter = ""
  areaFilter = ""
  public colorFilter = "primary"
  filtro = false
  private consultores: Array<string>
  private consultoresLista: Array<string>

  constructor(
    private serviceGetJson: DataJsonService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private events: EventsServiceService,
    public navCtrl: NavController,
    public appComponent: AppComponent,
    public alertController: AlertController,
    private menu: MenuController,
  ) { }

  ngOnInit() {
    this.presentLoading("Cargando listado de consultores...")
    this.getConsultors();
  }

  openMenu() {
    this.appComponent.colsultarIP();
    this.menu.toggle();
  }
  passUser(siglas, nombre, area, correo) {
    this.events.publishNewUser({ "siglas": siglas, "nombre": nombre, "area": area, "correo": correo })
    this.navCtrl.navigateRoot('/tabs/tab3');
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
  async showDetailsRegister(register) {
    const alert = await this.alertController.create({
      //cssClass: 'my-custom-class',
      header: 'Detalles del usuario',
      message:
        '<dl>' +
        '<li>Siglas: <strong>' + register.siglas + '</strong></li>' +
        '<li>Nombre corto: <br><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + register.nombre + '</strong></li>' +
        '<li>Correo: <br><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + register.correo + '</strong></li>' +
        '<li>Area: <br><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + register.area + '</strong></li>' +
        '</dl>',
      //'Siglas:\t'+register.siglas+'\nEntrada:\t'+register.Fecha_Hora+'\nSalida:\t'+register.Fecha_Hora_Salida,
      buttons: ['OK']
    });

    await alert.present();
  }

  filtroDeBusqueda() {
    this.colorFilter = "success"
    //console.log(this.consultoresLista);
    
    let arrayLista: Array<any> = this.events.getConsultores();
    let arrayList: any= [];
    for(var i = 0; i < arrayLista.length; i++){
      arrayList.push(arrayLista[i])
    }
    //console.log(arrayLista);
    //let arrayList: Array<any> = this.events.getConsultores();
    for (var i = 0; i < arrayList.length; i++) {
      if (arrayList[i].siglas.toLowerCase().startsWith(this.siglasFilter) ||
        arrayList[i].nombre.toLowerCase().startsWith(this.nombreFilter) ||
        arrayList[i].area.startsWith(this.areaFilter)) {
        if (!arrayList[i].siglas.toLowerCase().startsWith(this.siglasFilter) && this.siglasFilter != "") {
          arrayList.splice(i, 1)
          i--
        } else
          if (!arrayList[i].nombre.toLowerCase().startsWith(this.nombreFilter) && this.nombreFilter != "") {
            arrayList.splice(i, 1)
            i--
          } else
            if (!arrayList[i].area.toLowerCase().startsWith(this.areaFilter) && this.areaFilter != "") {
              arrayList.splice(i, 1)
              i--
            }

      }
    }
    //console.log(arrayList);
    //console.log(this.consultoresLista);
    this.consultores = arrayList
  }

  borrarFiltro(){
    this.colorFilter = "primary"
    this.consultores = this.events.getConsultores()
  }

  async showFilter() {
    const alert = await this.alertController.create({
      //cssClass: 'class-for-alert',
      header: 'Filtro de búsqueda',
      inputs: [
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
        },
        {
          name: 'area',
          type: 'text',
          placeholder: 'Area         ej. Space',
          value: this.areaFilter
        }
      ],
      buttons: [
        {
          text: 'Borrar filtro',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.siglasFilter = "";
            this.nombreFilter = "";
            this.areaFilter = "";
            this.presentToast("Filtro desactivado")
            this.borrarFiltro()
          }
        }, {
          text: 'Confirmar',
          handler: (alertData) => {
            this.siglasFilter = alertData.siglas.toLowerCase()
            this.nombreFilter = alertData.nombre.toLowerCase()
            this.areaFilter = alertData.area.toLowerCase()
            if (this.siglasFilter == "" && this.nombreFilter == "" && this.areaFilter == "") {
              this.presentToast("No hay filtros activos")
              this.borrarFiltro()
            } else {
              this.presentToast("Filtro activado")
              this.filtroDeBusqueda()
            }
          }
        }
      ]
    });

    await alert.present();
  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
  getConsultors() {
    this.serviceGetJson.getConsultores().subscribe(data => {
      this.events.saveConsultores(data.consultores);
      //this.consultores = data.consultores;
      //this.consultoresLista = data.consultores;
      //console.log(this.consultores);
      this.loadingController.dismiss()
      //console.log(this.events.getConsultores())
      this.consultores = this.events.getConsultores()

    });
    
      //this.consultores = 
  }
}
