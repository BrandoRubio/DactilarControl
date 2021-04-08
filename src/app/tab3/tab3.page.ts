import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataJsonService } from '../data-json.service';
import { LoadingController } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { MenuController, ToastController } from '@ionic/angular';
import { EventsServiceService } from '../events-service.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {

  NewUserForm: FormGroup
  DataUser
  IDToNewUser = 0
  emailToNewUser = ""
  siglasToNewUser = ""
  nombreToNewUser = ""
  areaToNewUser = ""
  buttonDisabled = true
  constructor(private formBuilder: FormBuilder,
    private serviceGetJson: DataJsonService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private events: EventsServiceService,
    private menu: MenuController) {
  }
  ionViewDidLeave() {
    this.events.dropDataNewUser()
  }
  ionViewDidEnter() {
    
    if (this.events.getDataNewUser() == undefined) {
      this.emailToNewUser = ""
      this.siglasToNewUser = ""
      this.nombreToNewUser = ""
      this.areaToNewUser = ""
    } else {
      let UserData: any = this.events.getDataNewUser()
      this.emailToNewUser = UserData.correo
      this.siglasToNewUser = UserData.siglas
      this.nombreToNewUser = UserData.nombre
      this.areaToNewUser = UserData.area
    }
    this.serviceGetJson.getUsers().subscribe(data => {
      if (data.users.length < 162) {
        for (let index = 0; index < data.users.length; index++) {
          if (data.users[index].ID != index + 1) {
            this.IDToNewUser = data.users[index].ID - 1
            return
          } else if (data.users[index].ID == data.users.length) {
            this.IDToNewUser = data.users.length + 1;
          }
        }
      } else {
        this.presentToast("Ya no se pueden agregar más usuarios")
      }
    });
    if(this.IDToNewUser==0){
      this.IDToNewUser = 1;
    }
    //console.log(this.IDToNewUser);
  }
  openMenu() {
    this.menu.toggle();
  }
  getConsultor() {
  }
  ngOnInit() {
    this.setForm();
    //this.serviceGetJson.getusers();
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Enviando datos al dispositivo...',
      duration: 25000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    //console.log('Loading dismissed!');
  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
  setForm() {
    this.NewUserForm = this.formBuilder.group({
      id: ['', Validators.compose([
        Validators.minLength(5),
        Validators.required])],
      siglas: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(5),
        //Validators.pattern("^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"),
        Validators.required])],
      correo: ['', Validators.compose([
        Validators.email,
        Validators.required])],
      area: ['', Validators.compose([
        Validators.minLength(2),
        Validators.required])],
      nombre: ['', Validators.compose([
        Validators.minLength(5),
        Validators.required])]
    });
  }

  sendDataNewUser(form) {
    if (!this.NewUserForm.valid) {
      console.log(this.NewUserForm.valid)
      console.log(form.id)
      this.presentToast("Llena correctamente todos los campos")
    } else {
      this.presentLoading()
      this.serviceGetJson.SendDataNewUser(form.form, this.IDToNewUser).subscribe(data => {
        //console.log(received.error.error.text);
        console.log(data.message)
        this.loadingController.dismiss()
        if (data.message == "recibidos") {
          this.presentToast("Datos enviados correctamente")
        } else {

          this.presentToast("Error en la comunicación, vuelve a intentarlo")
        }
      },
        (error: any) => {
          console.log(error);
          this.loadingController.dismiss()
          this.presentToast("Algo salió mal al hacer realizar la conexión, inténtalo más tarde")
        });
    }
  }
}
