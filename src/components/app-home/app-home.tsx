import { Component, Element, Prop, State } from "@stencil/core";
import { Plugins, CameraResultType } from "@capacitor/core";
import * as Tracker from "clmtrackr";

const { Camera } = Plugins;

@Component({
  tag: "app-home",
  styleUrl: "app-home.css"
})
export class AppHome {
  @State() src: string = "";
  @Prop({ connect: "ion-pwa-camera-modal" })
  cameraModal: HTMLIonPwaCameraModalElement;
  @Element() el: HTMLElement;

  ctrack: any;

  async componentWillLoad() {
    console.log(Tracker.default);
    this.ctrack = new Tracker.default.tracker({ useWebGL: false });
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      width: 500,
      height: 400,
      resultType: CameraResultType.Uri
    });
    this.resetCanvas();

    var imageUrl = image.webPath;
    this.src = imageUrl;

    let img = new Image();
    img.onload = () => {
      const imageCanvas: any = this.el.querySelector("#image");
      const cc = imageCanvas.getContext("2d");
      cc.drawImage(img, 0, 0, img.width, img.height);
      this.drawAnimation();
    };
    img.src = this.src;
  }

  resetCanvas() {
    this.ctrack.reset();
    const imageCanvas: any = this.el.querySelector("#image");
    const cc = imageCanvas.getContext("2d");
    cc.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

    const overlay: any = this.el.querySelector("#overlay");
    const overlayCC = overlay.getContext("2d");
    overlayCC.clearRect(0, 0, overlay.width, overlay.height);
  }

  drawAnimation() {
    this.ctrack.init();
    this.ctrack.start(this.el.querySelector("#image"));
    const overlay: any = this.el.querySelector("#overlay");
    const overlayCC = overlay.getContext("2d");
    let cnt = 0;
    let id = setInterval(() => {
      overlayCC.clearRect(0, 0, overlay.width, overlay.height);
      if (this.ctrack.getCurrentPosition()) {
        this.ctrack.draw(overlay);
      }
      cnt = cnt + 1;
      if (cnt >= 20) {
        clearInterval(id);
      }
    }, 80);
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Home</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content padding>
        <div class="scroll">
          <div id="container">
            <canvas id="image" width="500" height="400" />
            <canvas id="overlay" width="500" height="400" />
          </div>
        </div>
        <ion-button onClick={() => this.takePicture()}>Camera</ion-button>
      </ion-content>
    ];
  }
}
