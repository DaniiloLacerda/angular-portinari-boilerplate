import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { MessageResponseService } from '@core/service/message-response.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseNotificationComponent } from 'src/app/shared/component/base-resource/base-notification.component';

@Injectable()
export class ErrorInterceptor extends BaseNotificationComponent implements HttpInterceptor {
  private messageService: MessageResponseService;

  constructor(protected injector: Injector) {
    super(injector);
    this.messageService = this.injector.get(MessageResponseService);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const method: string = request.method;
    return next.handle(request).pipe(
      map((resp) => {
        if (resp instanceof HttpResponse) {
          const data = this.messageService.getMessage(resp, method);
          resp = resp.clone({ body: data });
        }
        return resp;
      }),
      catchError((error: any) => {
        if (error.status && error instanceof HttpErrorResponse) {
          const errorMessage = this.messageService.getMessage(error);
          this.gerarError(errorMessage);
          return throwError(errorMessage);
        }
        return throwError(error);
      })
    );
  }
}
