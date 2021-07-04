import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, timeout } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { UserModel } from '@shared/base/user.model';
import { BaseNotificationComponent } from '../../shared/component/base-resource/base-notification.component';
import { Router } from '@angular/router';
import { LoginData } from '@interface/login.interface';
import jwtDecode from 'jwt-decode';
import { IAuth } from '@interface/auth.interface';
import { Utils } from '../../shared/utils/utils';
import { PoToasterType } from '@po-ui/ng-components';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseNotificationComponent {
  private header = {
    headers: {
      'Content-Type': 'application/json',
      'X-PO-No-Message': 'false',
    },
  };

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<UserModel>;
  private apiPath: string;

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly CURRENT_USER = 'CURRENT_USER';
  private readonly KEY_USER = 'USER_KEY';
  private readonly TIME_EXPIRE = 'TIME_EXPIRE';

  constructor(private http: HttpClient, private router: Router, public injector: Injector) {
    super(injector);
    this.currentUserSubject = new BehaviorSubject<UserModel>(
      JSON.parse(localStorage.getItem(this.CURRENT_USER) as string)
    );
    this.currentUser = this.currentUserSubject.asObservable();
    this.apiPath = environment.API_URL;
  }

  get getToken(): string {
    return localStorage.getItem(this.JWT_TOKEN) as string;
  }

  get isLogged(): boolean {
    return !!this.getToken;
  }

  get isTokenExpired(): boolean {
    const date = this.getTokenExpirationDate();
    if (date && date.toString() === 'Invalid Date') {
      return true;
    }
    return date.valueOf() <= new Date().valueOf();
  }

  public async login(loginData: LoginData): Promise<void> {
    const body = {
      username: loginData.username,
      password: loginData.password,
    };

    return await this.http
      .post<any>(`${this.apiPath}/token`, body, this.header)
      .pipe(
        map((resp) => {
          if (resp) {
            const jwtDecoded = jwtDecode<IAuth>(resp.token);
            this.storageToken(resp.token);
            localStorage.setItem(this.TIME_EXPIRE, jwtDecoded.exp);
            const user: UserModel = Utils.fromJson<UserModel>(UserModel, jwtDecoded.data);
            this.currentUserSubject.next(user);
            localStorage.setItem(this.CURRENT_USER, JSON.stringify(user));
          }
        })
      )
      .toPromise();
  }

  public async setNewPassword(password: string, token: any) {
    return await this.http
      .post<any>(
        `${this.apiPath}/login/userSetPassword`,
        { password: password },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-PO-No-Message': 'false',
            Authorization: token,
          },
        }
      )
      .toPromise();
  }

  public logout(): void;
  public logout(message: string): void;
  public logout(message?: string): void {
    if (message) {
      this.createNotification(message, PoToasterType.Warning);
    }
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.CURRENT_USER);
    localStorage.removeItem(this.TIME_EXPIRE);
    localStorage.removeItem(this.KEY_USER);
    this.currentUserSubject.next(undefined);
    this.router
      .navigateByUrl('login', { skipLocationChange: true })
      .then(() => this.router.navigate(['login']));
  }

  private getTokenExpirationDate(): Date {
    const date = new Date(0);
    date.setUTCSeconds(parseInt(localStorage.getItem(this.TIME_EXPIRE) as string));
    return date;
  }

  private storageToken(token: string) {
    localStorage.setItem(this.JWT_TOKEN, token);
  }
}
