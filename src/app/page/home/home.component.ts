import { Component } from '@angular/core';
import { LocalStorageCurrentUser } from '@interface/local-storage.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public welcomeMessage: string;
  private currentUser: LocalStorageCurrentUser;
  private readonly CURRENT_USER = 'CURRENT_USER';

  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem(this.CURRENT_USER) as string);
    this.welcomeMessage = this.currentUser.name
      ? `Olá ${this.currentUser.name}!`
      : 'Seja Bem Vindo(a)';
  }
}
