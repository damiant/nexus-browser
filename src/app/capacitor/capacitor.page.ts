import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';
import { addIcons } from 'ionicons';
import { logoAppleAppstore, logoGooglePlaystore } from 'ionicons/icons';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
    imports: [CommonModule, FormsModule, QRCodeComponent, IonContent, IonButton, IonIcon],
    selector: 'app-link',
    templateUrl: './capacitor.page.html',
    styleUrls: ['./capacitor.page.scss']
})
export class CapacitorPage implements OnInit {
  opening: boolean = false;
  web: boolean = false;
  plugins: Plugin[] = [];
  appStoreUrl = 'https://apps.apple.com/us/app/nexus-web-browser/id6445866986';
  playStoreUrl = 'https://play.google.com/store/apps/details?id=com.nexusconcepts.nexus';

  constructor() {
    addIcons({ logoAppleAppstore, logoGooglePlaystore });
  }

  async ngOnInit() {
    //document.location.href = 'io.ionic.capview://launch';
    this.web = !this.isAndroid() && !this.isIOS() && Capacitor.getPlatform() == 'web';
    let waitTime = this.web ? 5 : 5000;
    // const timer = setTimeout(() => {
    //   this.launchStore();
    // }, waitTime);

    const res = await fetch('assets/app-data.json');
    const data = await res.json();
    this.plugins = data.plugins;
  }

  public launchStore() {
    if (document.hidden) {
      console.log('dont launch store');
      return;
    }
    switch (Capacitor.getPlatform()) {
      case 'ios':
        this.openAppStore();
        break;
      case 'android':
        this.openPlayStore();
        break;
      case 'web':
        this.isIOS() ? this.openAppStore() : this.isAndroid() ? this.openPlayStore() : this.showLinks();
        break;
      default:
        console.log(Capacitor.getPlatform());
    }
  }

  public openAppStore() {
    this.open(this.appStoreUrl);
  }

  public openPlayStore() {
    this.open(this.playStoreUrl);
  }

  public url(name: string) {
    if (name.startsWith('@capacitor/')) {
      return `https://capacitorjs.com/docs/apis/${name.replace('@capacitor/', '')}`;
    }
    return `https://www.npmjs.com/package/${name}`;
  }

  private showLinks() {
    this.opening = false;
    console.log('This is web');
  }

  private open(url: string) {
    document.location.href = url;
    this.opening = false;
  }

  public isIOS() {
    return (
      ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) ||
      // iPad on iOS 13 detection
      (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
    );
  }

  public isAndroid() {
    const ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('android') > -1;
  }
}

interface Plugin {
  name: string;
  version: string;
}
