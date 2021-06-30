import { AfterContentChecked, Directive, Injector, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageResponse } from '@core/model/message-response.model';
import { ActionsUrl } from '@enum/actions-url.enum';
import { PoPageAction, PoTableAction, PoToasterType } from '@po-ui/ng-components';
import { AuthService } from '@core/service/auth.service';
import { BaseResourceModel } from '@shared/base/base-resource/base-resource.model';
import { LoaderService } from '@shared/base/loader.service';
import { UserModel } from '@shared/base/user.model';
import { BaseNotificationComponent } from './base-notification.component';

@Directive()
export abstract class BaseResourceComponent
  extends BaseNotificationComponent
  implements AfterContentChecked
{
  protected hasChanges = false;
  protected isLoading: boolean;
  public pageTitle: string;
  public pageActions: Array<PoPageAction>;
  public serverErrorMessages: string[];
  public componentUrl: string;
  public redirectAfterUpdate = true;
  public actionsGrid: Array<PoTableAction>;
  protected currentAction: string;
  protected route: ActivatedRoute;
  protected router: Router;
  protected filterChips: Array<string> = new Array<string>();
  protected filterReport = '';

  protected readonly ACTION_CREATE: string = 'create';
  protected readonly ACTION_EDIT: string = 'edit';
  protected readonly ACTION_VIEW: string = 'view';
  protected readonly ACTION_REPORT: string = 'report';
  protected readonly ROLE_READ: string = 'read';
  protected readonly ROLE_WRITE: string = 'write';

  private loading: LoaderService;
  protected authService: AuthService;
  protected currentUser: UserModel;

  @ViewChild('resourceForm', { static: true }) resourceForm: NgForm;

  constructor(protected injector: Injector) {
    super(injector);
    this.route = this.injector.get(ActivatedRoute);
    this.router = this.injector.get(Router);
    this.loading = this.injector.get(LoaderService);
    this.authService = this.injector.get(AuthService);
    this.authService.currentUser.subscribe((user) => (this.currentUser = user));
    this.route.data.subscribe((data) => (this.pageTitle = data.name || ''));
    this.route.snapshot.url.forEach((url) => {
      if (ActionsUrl[url.path.toUpperCase()]) {
        this.currentAction = url.path;
      }
    });
    this.componentUrl = this.route.snapshot.parent!.url[0].path;
    this.loading.isLoading.subscribe((load) => (this.isLoading = load));
  }

  ngAfterContentChecked(): void {
    this.setActions();
    this.setCurrentAction();
  }

  public getForm(form: NgForm) {
    this.resourceForm = form;
  }

  public redirectToPrevious(validateChanges = true): void {
    if (this.hasChanges && validateChanges) {
      this.confirm(
        'Mudanças pendentes!',
        'As alterações serão descartadas, deseja prosseguir?',
        () => this.redirectTo(this.componentUrl)
      );
    } else {
      this.redirectTo(this.componentUrl);
    }
  }

  protected setCurrentAction() {
    switch (this.currentAction) {
      case 'create':
        this.loadCreateComponent();
        break;
      case 'edit':
        this.loadEditComponent();
        break;
      case 'view':
        this.loadViewComponent();
        break;
      case 'report':
        this.loadReportComponent();
        break;
    }
  }

  public onEdit(item: any) {}
  protected condEdit(): boolean {
    return false;
  }
  private dataBtnEdit(): any {
    return {
      label: 'Editar',
      action: this.onEdit.bind(this),
      disabled: this.condEdit.bind(this),
    };
  }
  protected btnEdit(): PoPageAction {
    return this.dataBtnEdit();
  }
  protected tblEdit(): PoTableAction {
    return this.dataBtnEdit();
  }

  public onCancel() {
    this.redirectToPrevious();
  }
  protected condCancel(): boolean {
    return false;
  }
  protected btnCancel(): PoPageAction {
    return {
      label: 'Cancelar',
      action: this.onCancel.bind(this),
      disabled: this.condCancel.bind(this),
      type: 'danger',
    };
  }

  /** Clear -> Action - Button - Condition */
  public onClear() {
    this.resourceForm.resetForm();
  }
  protected condClear(): boolean {
    return false;
  }
  protected btnClear(): PoPageAction {
    return {
      label: 'Limpar',
      action: this.onClear.bind(this),
      disabled: this.condClear.bind(this),
    };
  }

  public onBack() {
    this.redirectToPrevious();
  }
  protected condBack(): boolean {
    return false;
  }
  protected btnBack(): PoPageAction {
    return {
      label: 'Voltar',
      action: this.onCancel.bind(this),
      disabled: this.condBack.bind(this),
    };
  }

  public onSearch(filter?: any, searchUrl?: string) {}
  protected condSearch(): boolean {
    return false;
  }
  protected btnSearch(): PoPageAction {
    return {
      label: 'Pesquisar',
      action: this.onSearch.bind(this),
      disabled: this.condSearch.bind(this),
    };
  }

  public onSave() {}
  protected condSave(): boolean {
    return false;
  }
  protected btnSave(): PoPageAction {
    return {
      label: 'Salvar',
      action: this.onSave.bind(this),
      disabled: this.condSave.bind(this),
    };
  }

  public onSaveAndNew() {}
  protected condSaveAndNew(): boolean {
    return false;
  }
  protected btnSaveAndNew(): PoPageAction {
    return {
      label: 'Salvar e Novo',
      action: this.onSaveAndNew.bind(this),
      disabled: this.condSaveAndNew.bind(this),
    };
  }

  public onNew() {}
  protected condNew(): boolean {
    return true;
  }

  protected loadEditComponent() {
    this.currentAction = this.ACTION_EDIT;
    if (this.pageTitle == '') {
      this.pageTitle = this.editionPageTitle();
    }
    if (this.pageActions == null) {
      this.pageActions = [this.btnSave(), this.btnClear(), this.btnCancel()];
    }
  }

  protected loadViewComponent() {
    this.currentAction = this.ACTION_VIEW;
    if (this.pageActions == null) {
      this.pageActions = [this.btnBack()];
    }
  }

  protected loadReportComponent() {
    this.currentAction = this.ACTION_REPORT;
    if (this.pageTitle == '') {
      this.pageTitle = this.reportPageTitle();
    }
    if (this.pageActions == null) {
      this.pageActions = [this.btnSearch(), this.btnClear()];
    }
  }

  protected loadCreateComponent() {
    this.currentAction = this.ACTION_CREATE;
    if (this.pageTitle == '') {
      this.pageTitle = this.creationPageTitle();
    }
    if (this.pageActions == null) {
      this.pageActions = [this.btnSave(), this.btnSaveAndNew(), this.btnCancel()];
    }
  }

  protected creationPageTitle(): string {
    return 'Novo Cadastro';
  }

  protected editionPageTitle(): string {
    return 'Edição';
  }

  protected reportPageTitle(): string {
    return 'Relatório';
  }

  /**
   * Redirect To
   * @param path
   */
  protected redirectTo(path: string): void;
  protected redirectTo(path: string, id: string): void;
  protected redirectTo(path: string, id: string, action: string): void;
  protected redirectTo(id: string, action: string): void;
  protected redirectTo(path?: string, id?: string, action?: string): void {
    const baseComponentPath: string = path || this.componentUrl;
    this.router
      .navigateByUrl(baseComponentPath, { skipLocationChange: true })
      .then(() => this.router.navigate([baseComponentPath, id || '', action || '']));
  }

  protected actionsForSuccess(resource: BaseResourceModel) {
    if (this.redirectAfterUpdate) {
      this.redirectTo('');
    }
  }

  protected actionsForError(error: MessageResponse) {
    if ((error as MessageResponse).detailedMessage) {
      this.gerarError(error);
    } else {
      this.createNotification(
        'Ocorreu um erro ao processar a sua solicitação!',
        PoToasterType.Error
      );
    }
  }

  protected setActions(): PoPageAction[] {
    return [];
  }

  validBoolValue(value: any) {
    if (value == 'true') {
      return true;
    }
    if (value == 'false') {
      return false;
    }
    return value;
  }

  protected validCondition(condition: string) {
    return condition
      .replace('contains', 'Contém')
      .replace('eq', 'Exatamente')
      .replace('ge', 'Maior ou igual a')
      .replace('le', 'Menor ou igual a');
  }

  protected validBoolParameter(param: any) {
    return param.replace(false, 'Não').replace(true, 'Sim');
  }

  /**
   * @param resource
   * @param filters
   * Para que filters funcione corretamente, o form passado como parametro
   * deve conter um campo de nome composto por Filter para cada campo equivalente.
   * Ex.: { "name": "Lucas", "nameFilter": "eq" } -> Neste caso o filtro será aplicado para
   * nomes exatamente iguais a Lucas
   */
  protected createAdvancedFilter(searchData: any, form: any, fields: any): any {
    const bodySearch = {};
    this.filterChips = [];
    Object.keys(searchData).forEach((k) => {
      if (form.hasOwnProperty(k) && form[k]) {
        const itemToSearch: any = {};
        if (form[`${k}Filter`]) {
          itemToSearch[form[`${k}Filter`]] = this.validBoolValue(form[k]);
        } else {
          itemToSearch.contains = this.validBoolValue(form[k]);
        }
        bodySearch[`${k}`] = itemToSearch;
        const field = fields.find((f: { property: string }) => f.property == k);
        this.filterChips.push(
          `${field.label} (${
            form[`${k}Filter`] ? this.validCondition(form[`${k}Filter`]) : 'Contem'
          }: ${this.validBoolParameter(form[k])})`
        );
      }
    });
    return bodySearch;
  }
}
