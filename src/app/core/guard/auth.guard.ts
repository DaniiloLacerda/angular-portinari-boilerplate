import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '@core/service/auth.service';
import { MenuService } from '@core/service/menu.service';
import { UserModel } from '@shared/base/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private menuService: MenuService) {
    this.authService.currentUser.subscribe((u) => (this.user = u));
  }

  private readonly KEY_USER = 'USER_KEY';
  private user: UserModel;
  private message = 'Sua sessão expirou!';

  canActivate() {
    if (!this.authService.isTokenExpired) {
      this.reloadMenu();
      this.menuService.collapseMenu();
      return true;
    }
    this.authService.logout(this.message);
    return false;
  }

  private async reloadMenu() {
    await this.menuService.setMenu();
  }
}
