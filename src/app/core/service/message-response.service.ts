import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ERROR_400,
  ERROR_401,
  ERROR_404_LOGIN,
  ERROR_406,
  ERROR_409,
  ERROR_500,
  ERROR_502,
  SUCCESS_200,
  SUCCESS_200_LOGIN,
  SUCCESS_201,
  SUCCESS_203,
  SUCCESS_204,
} from '@core/constants/type-message-response';
import { MessageResponse } from '@core/model/message-response.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MessageResponseService {
  constructor(private authService: AuthService) {}

  private currentPath: string;
  private currentMethod: string | undefined;
  private errorResponse: any;

  public getMessage(response: HttpResponse<any>): any;
  public getMessage(response: HttpResponse<any>, method: string): any;
  public getMessage(response: HttpErrorResponse): any;
  public getMessage(response: HttpErrorResponse, method: string): any;
  public getMessage(response: any, method?: string): any {
    this.currentMethod = method;
    if (response instanceof HttpResponse) {
      return Object.assign(response.body ?? {}, {
        _messages: this.messageResponse(response.status, response.url as string),
      });
    }
    if (response instanceof HttpErrorResponse) {
      this.errorResponse = response;
      return this.messageResponse(response.status, response.url as string);
    }
  }

  private messageResponse(code: number, url?: string): MessageResponse {
    const currentUrl = url!.split('/');
    this.currentPath = currentUrl[currentUrl.length - 1];
    return this.validateMessage(this.getMessageOfCode(code));
  }

  private validateMessage(message: MessageResponse): MessageResponse {
    if (this.currentMethod) {
      if (this.currentMethod.localeCompare('POST') == 0) {
        if (message.code == 200) {
          switch (this.currentPath) {
            case 'token':
              message = SUCCESS_200_LOGIN;
              break;
          }
        }
      } else if (this.currentMethod.localeCompare('GET') == 0) {
        if (message.code == 200) {
          message.message = null;
          message.detailedMessage = null;
        }
      } else if (this.currentMethod.localeCompare('DELETE') == 0) {
        message.message = 'Item removido com sucesso!';
      } else if (this.currentMethod.localeCompare('PUT') == 0) {
        message.message = 'Item atualizado com sucesso!';
      }
    }
    if (message.code == 400) {
      if (Object.keys(this.errorResponse.error).find((k) => k.localeCompare('errors') == 0)) {
        const messageBody = new Array<string>();
        const errors = Object.assign(new Array<string>(), this.errorResponse.error?.errors);
        errors.forEach((x: any) => {
          messageBody.push(`Campo: ${x?.key}, ${x?.message}`);
        });
        message.message = '';
        message.detailedMessage = messageBody.toString();
      } else if (
        Object.keys(this.errorResponse.error).find((k) => k.localeCompare('errorMessage') == 0)
      ) {
        message.message = '';
        message.detailedMessage = this.errorResponse.error?.errorMessage;
      }
    }
    return message;
  }

  private getMessageOfCode(code: number): MessageResponse {
    switch (code) {
      case 0:
        return ERROR_500;
      case 200:
        return SUCCESS_200;
      case 201:
        return SUCCESS_201;
      case 203:
        return SUCCESS_203;
      case 204:
        return SUCCESS_204;
      case 400:
        return ERROR_400;
      case 401:
      case 403:
        if (this.authService.isTokenExpired) {
          this.authService.logout();
        }
        return ERROR_401;
      case 404:
        if (this.currentPath === 'token') {
          return ERROR_404_LOGIN;
        }
        return ERROR_500;
      case 406:
        return ERROR_406;
      case 409:
        return ERROR_409;
      case 500:
        return ERROR_500;
      case 502:
        return ERROR_502;
      default:
        return ERROR_500;
    }
  }
}
