import { Directive, Injector, ViewChild } from '@angular/core';
import { MessageResponse } from '@core/model/message-response.model';
import {
  PoNotificationService,
  PoDialogService,
  PoNotification,
  PoModalComponent,
  PoModalAction,
  PoToasterType,
  PoToasterOrientation,
} from '@po-ui/ng-components';

@Directive()
export abstract class BaseNotificationComponent {
  constructor(protected injector: Injector) {
    this.notification = this.injector.get(PoNotificationService);
    this.poAlert = this.injector.get(PoDialogService);
  }
  public notification: PoNotificationService;
  public toaster: PoNotification;
  protected poAlert: PoDialogService;
  public modalErrorMessage: string;

  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  public modalTitle: string = '';
  public primaryAction: PoModalAction = {
    action: () => {
      this.onModelSave();
    },
    label: 'Salvar',
  };

  public secondaryAction: PoModalAction = {
    action: () => {
      this.onModalCancel();
    },
    label: 'Cancelar',
    danger: true,
  };

  public alert(titulo: string, mensagem: string, funcao: Function = () => {}) {
    this.poAlert.alert({
      title: titulo,
      message: mensagem,
      ok: funcao,
    });
  }

  public confirm(titulo: string, mensagem: string, confirmFunction: Function = () => {}) {
    this.poAlert.confirm({
      title: titulo,
      message: mensagem,
      confirm: confirmFunction,
    });
  }

  public showModal() {
    this.poModal.open();
  }

  public onModalCancel() {
    this.poModal.close();
  }

  public onModelSave() {
    this.poModal.close();
  }

  public gerarError(error: MessageResponse): void {
    this.createNotification(
      `${error.message} \t ${error.detailedMessage}`,
      PoToasterType.Error
    );
  }

  public createNotification(mensagem: string): void;
  public createNotification(mensagem: string, tipo: number): void;
  public createNotification(mensagem: string, tipo: number, duration: number): void;
  public createNotification(
    mensagem: string,
    tipo: number,
    duration: number,
    action: Function,
    actionLabel: string
  ): void;
  public createNotification(
    message: string,
    type: number = PoToasterType.Success,
    duration = 6000,
    action?: Function,
    actionLabel?: string
  ): void {
    this.toaster = {
      message: message,
      duration: duration,
      orientation: PoToasterOrientation.Top,
      action,
      actionLabel,
    };
    this.startNotification(type);
  }

  private startNotification(tipo: number) {
    switch (tipo) {
      case PoToasterType.Success: {
        this.notification.success(this.toaster);
        break;
      }
      case PoToasterType.Error: {
        this.notification.error(this.toaster);
        break;
      }
      case PoToasterType.Warning: {
        this.notification.warning(this.toaster);
        break;
      }
      case PoToasterType.Information: {
        this.notification.information(this.toaster);
        break;
      }
      default: {
        this.notification.success(this.toaster);
        break;
      }
    }
  }
}
