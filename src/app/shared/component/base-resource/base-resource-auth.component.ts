import { Injector, OnInit } from '@angular/core';
import { BaseResourceComponent } from './base-resource.component';
import { LoginData } from 'src/app/shared/interface/login.interface';
import { Directive } from '@angular/core';

@Directive()
export abstract class BaseResourceAuthComponent
  extends BaseResourceComponent
  implements OnInit
{
  readonly loginPath: string = 'login';

  constructor(protected injector: Injector) {
    super(injector);
  }

  async onSubmit(loginFormData: LoginData) {
    if (this.componentUrl == this.loginPath) {
      this.validateLogin(loginFormData);
    } else {
      this.redirectTo('home');
    }
  }

  private validateLogin(formLogin: LoginData) {
    if (formLogin.username && formLogin.password) {
      this.authService.login(formLogin).then(() => {
        this.redirectTo('home');
      });
    } else {
      this.createNotification('Preencha Login e senha', 3);
    }
  }

  ngOnInit() {
    if (this.authService.isLogged) {
      this.redirectTo('home');
    }
  }
}
