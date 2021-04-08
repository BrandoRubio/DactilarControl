import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DataJsonService } from './data-json.service';
//import { Tab1Page } from './tab1/tab1.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  menu: FormGroup
  ipESP = ""
  constructor(
    //private tab1 : Tab1Page,
    private formBuilder: FormBuilder,
    private serviceGetJson: DataJsonService,
    public toastController: ToastController,
    private storage: Storage) {

  }
  ngOnInit() {
    //this.navCtrl.navigateRoot(['/app.component'])
    //this.intervaloValue = 30000
    //console.log("Data");

    this.menu = this.formBuilder.group({
      ip: ['', Validators.compose([
        Validators.pattern('^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'),
        Validators.required]),
      ]
    });
    //console.log(this.ipESP);
  }

  sendSettings(form) {
    console.log(form.form.ip);
    //this.tab1.tiempoRecarga = optionValue.value
    this.storage.set('ipESP32', form.form.ip);
    this.serviceGetJson.getIP(form.form.ip).subscribe(data => {
      //console.log(data);  
      if (data.message == "correcto") {
        this.presentToast("IP correcta, dispositivo encontrado")
      } else {
        this.presentToast("No se encontró el dispositivo")
      }
    },
      (error: any) => {
        console.log(error);
        this.presentToast("No se encontró el dispositivo")
      });
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
  public colsultarIP() {
    this.storage.get('ipESP32').then((val) => {
      this.ipESP = val
    });
  }
  /*
  ionViewDidEnter(){
    this.intervaloValue = 30000
    this.storage.get('intervalo').then((val) => {
      if(val == null){
        //this.storage.set('intervalo', 3000);
        this.intervaloValue = 30000
      }else{
        this.intervaloValue = val;
      }
    });
  }*/

}
