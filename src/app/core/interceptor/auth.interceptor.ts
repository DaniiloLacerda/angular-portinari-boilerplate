import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { AuthService } from '@core/service/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiViaCep = request.url.search(environment.API_VIACEP) >= 0;
    const resetPassword = request.url.localeCompare('userForgetPassword') >= 0;
    if (this.authService.isLogged && !apiViaCep && !resetPassword) {
      request = request.clone({
        headers: request.headers.set('Authorization', this.authService.getToken),
      });
    }

    request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

    return next.handle(request);
  }
}
