import { AfterContentChecked, AfterContentInit, Component, Injector } from '@angular/core';
import { LoginData } from '@interface/login.interface';
import { BaseResourceAuthComponent } from 'src/app/shared/component/base-resource/base-resource-auth.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseResourceAuthComponent implements AfterContentChecked {
  inputUser: string;
  inputPassword: string;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngAfterContentChecked() {
    if (document.getElementsByClassName('po-select')[0]) {
      document.getElementsByClassName('po-page-background-footer-select')[0].remove();
    }
  }

  submitLogin() {
    this.onSubmit({
      username: this.inputUser,
      password: this.inputPassword,
    });
  }
}
