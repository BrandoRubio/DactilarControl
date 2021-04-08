import { Component } from '@angular/core';
import { DataJsonService } from '../data-json.service';
import { EventsServiceService } from '../events-service.service';
import { MenuController, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public lista: Array<string>
  constructor(private menu: MenuController,
    public navCtrl: NavController,
    private serviceGetJson: DataJsonService,
    private events: EventsServiceService,
    private alertController: AlertController,
    public loadingController: LoadingController,
    public toastController: ToastController,
  ) {}

  openMenu() {
    this.menu.toggle();
  }
  doRefresh(event) {
    this.presentLoading("Actualizando lista de usuarios")
    this.serviceGetJson.getUsers().subscribe(data => {
      this.lista = data.users;
      this.loadingController.dismiss()
    });
    setTimeout(() => {
      //console.log('Async operation has ended');
      event.target.complete();
    }, 200);
  }
  goToUpdateUser(id, nombre, siglas, correo, area) {
    //push another page onto the history stack
    //causing the nav controller to animate the new page in
    this.navCtrl.navigateForward("detailsUser");
    this.events.publishDataUser({"id" : id, "nombre" : nombre,"siglas" : siglas, "correo" : correo, "area" : area})
  }
  eliminarUsuario(id, siglas) {
    this.presentLoading("Eliminando usuario, espera por favor...")
    this.serviceGetJson.DeleteUserByID(id).subscribe(data => {
      //let received = data;
      //console.log(received.error.error.text);
      //console.log(data.message);
      if (data.message == "user deleted") {
        this.loadingController.dismiss()
        this.presentToast("Usuario " + siglas + " eliminado.");
        this.serviceGetJson.getUsers().subscribe(data => {
          this.lista = data.users;
        });
      }
    },
    (error: any) => {
        console.log(error);
        this.loadingController.dismiss()
        this.presentToast("No se pudo eliminar, vuelve a intentarlo...")
    });
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

  ionViewWillEnter(){
    this.presentLoading("Actualizando lista de usuarios")
    this.serviceGetJson.getUsers().subscribe(data => {
      this.lista = data.users;
      this.loadingController.dismiss()
    });
  }
  async showDetailsRegister(register) {
    const alert = await this.alertController.create({
      //cssClass: 'my-custom-class',
      header: 'Detalles',
      message: 'Detalles del usuario' +
        '<ul>' +
        '<li>Siglas: ' + register.Siglas+'</li>'+
        '<li>Nombre corto: ' + register.Nombre+'</li>'+
        '<li>Correo: ' + register.Correo+'</li>'+
        '<li>Area: ' + register.Area+'</li>'+
        '</ul>',
      //'Siglas:\t'+register.siglas+'\nEntrada:\t'+register.Fecha_Hora+'\nSalida:\t'+register.Fecha_Hora_Salida,
      buttons: ['OK']
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
  async deleteUser(id, siglas) {
    const alert = await this.alertController.create({
      //cssClass: 'my-custom-class',
      header: '¡Confirma!',
      message: '¿Estás seguro que deseas eliminar el usuario "' + siglas + '"?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            //console.log('Cancel: usuario no eliminado');
            this.presentToast("usuario no eliminado")
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            //console.log('Eliminando usuario...');
            this.eliminarUsuario(id, siglas);
          }
        }
      ]
    });

    await alert.present();
  }

}
