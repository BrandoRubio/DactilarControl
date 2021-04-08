import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { DataJsonService } from '../data-json.service';
import { EventsServiceService } from '../events-service.service';

@Component({
  selector: 'app-details-user',
  templateUrl: './details-user.page.html',
  styleUrls: ['./details-user.page.scss'],
})
export class DetailsUserPage implements OnInit {
  idUser
  siglasUser
  correoUser
  nombreUser
  areaUser
  UpdateUserForm: FormGroup
  constructor(
    public loadingController: LoadingController,
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private events: EventsServiceService,
    public toastController: ToastController,
    private serviceGetJson: DataJsonService, 
  ) { }

  ngOnInit() {
    this.setForm()
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
  setForm() {
    this.UpdateUserForm = this.formBuilder.group({
      id: ['', Validators.compose([
        Validators.minLength(5),
        Validators.required])],
      siglas: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(5),
        Validators.pattern('[a-zA-Z ]*'),
        Validators.required])],
      correo: ['', Validators.compose([
        Validators.email,
        Validators.required])],
      area: ['', Validators.compose([
        Validators.minLength(2),
        Validators.required])],
      nombre: ['', Validators.compose([
        Validators.minLength(4),
        Validators.required])]
    });
  }
  ionViewDidEnter() {
    let UserData: any = this.events.getDataUser()
    this.idUser = UserData.id
    this.nombreUser = UserData.nombre
    this.siglasUser = UserData.siglas
    this.correoUser = UserData.correo
    this.areaUser = UserData.area
  }

  GoToBack() {
    this.navCtrl.back()
    this.presentToast("No se realizó ningún cambio")
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
  UpdateUserDatabase(form) {
    this.serviceGetJson.UpdateUser(form.form)
    if (!this.UpdateUserForm.valid) {
      console.log(this.UpdateUserForm.valid)
      this.presentToast("Llena correctamente todos los campos")
    } else {
      this.presentLoading("Actualizando usuario...")
      this.serviceGetJson.UpdateUser(form.form).subscribe(data => {
        //console.log(received.error.error.text);
        //console.log(data.message)
        this.loadingController.dismiss()
        if (data.message == "Actualizado") {
          this.presentToast("Usuario "+ this.siglasUser +" actualizado correctamente.")
          this.navCtrl.navigateRoot("tabs/tab2")
        } else {

          this.presentToast("Error en la comunicación, vuelve a intentarlo")
        }
      },
        (error: any) => {
          console.log(error);
          //this.loadingController.dismiss()
          this.presentToast("Algo salió mal al hacer realizar la conexión, inténtalo más tarde")
        });
        
    }
  }
}
