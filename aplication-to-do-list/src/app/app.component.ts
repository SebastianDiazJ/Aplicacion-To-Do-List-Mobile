import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, RouterModule, IonicModule],
  template: `
    <ion-app>
      <ion-menu contentId="main-content" type="overlay">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Menú</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ion-menu-toggle auto-hide="false">
              <ion-item routerLink="/home" routerLinkActive="active">
                <ion-icon name="checkmark-circle-outline" slot="start"></ion-icon>
                <ion-label>Tareas</ion-label>
              </ion-item>
              <ion-item routerLink="/categories" routerLinkActive="active">
                <ion-icon name="pricetags-outline" slot="start"></ion-icon>
                <ion-label>Categorías</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-app>
  `,
  styles: [
    `
      ion-item.active {
        --color: var(--ion-color-primary);
        font-weight: bold;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  constructor(private platform: Platform, private storage: Storage) {}

  async ngOnInit() {
    await this.storage.create();
    this.platform.ready().then(() => {
      console.log('App ready');
    });
  }
}