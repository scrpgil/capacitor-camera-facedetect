import { Component, Prop, State } from "@stencil/core";
import { Plugins, CameraResultType } from "@capacitor/core";

const { Camera } = Plugins;

@Component({
  tag: "app-home",
  styleUrl: "app-home.css"
})
export class AppHome {
  @State() src: string = "";
  @Prop({ connect: "ion-pwa-camera-modal" })
  cameraModal: HTMLIonPwaCameraModalElement;

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
    var imageUrl = image.webPath;
    this.src = imageUrl;
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Home</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content padding>
        <img src={this.src} />
        <ion-button onClick={() => this.takePicture()}>Camera</ion-button>
      </ion-content>
    ];
  }
}
