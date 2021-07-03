import { Directive, Injector, ViewChild } from '@angular/core';
import { BaseResourceModel } from '@shared/base/base-resource/base-resource.model';
import { BaseResourceService } from '@shared/base/base-resource.service';
import { BaseResourceComponent } from './base-resource.component';
import {
  PoDynamicFormField,
  PoDynamicFormFieldChanged,
  PoDynamicFormValidation,
  PoToasterType,
} from '@po-ui/ng-components';
import { NgForm } from '@angular/forms';
import { PoModalAction } from '@po-ui/ng-components/lib/components/po-modal';

@Directive()
export abstract class BaseResourceFormComponent<
  T extends BaseResourceModel
> extends BaseResourceComponent {
  constructor(
    protected injector: Injector,
    public resource: T,
    protected resourceService: BaseResourceService<T>
  ) {
    super(injector);
    this.fields = this.getFields<T>(resource);
  }

  public literalsDetail: any = { edit: 'Salvar' };

  public fields: Array<PoDynamicFormField>;
  public fieldsModel: Array<PoDynamicFormField> = this.buildResourceModel();
  public formLiterals = { back: 'Voltar', edit: 'Salvar', remove: 'Excluir' };
  public primaryAction: PoModalAction;

  @ViewChild('modelForm', { static: true }) modelForm: NgForm;

  getFields<T extends BaseResourceModel>(data: T): Array<PoDynamicFormField> {
    const dataForm = data.fieldsForm;
    if (this.currentAction == this.ACTION_EDIT) {
      const code = dataForm.find((x) => x.property == 'code');
      if (code) {
        code.disabled = true;
      }
    }
    return dataForm;
  }

  public getFormModel(form: NgForm) {
    this.modelForm = form;
  }

  public onSave() {
    if (this.validateFields()) {
      if (this.currentAction == this.ACTION_CREATE) {
        this.createResource();
      } else {
        this.updateResource();
      }
    }
  }

  public async onSaveAndNew() {
    if (this.validateFields()) {
      await this.resourceService.create(this.resource).then((resp) => {
        if (resp) {
          this.resourceForm.form.reset();
        }
      });
    }
  }

  public validateFields() {
    if (this.resourceForm && !this.resourceForm.valid) {
      const invalidFields: Array<string> = [];
      this.fields.forEach((field) => {
        if (this.resourceForm.form.controls[field.property].status === 'INVALID') {
          invalidFields.push(` ${field.label} `);
        }
      });

      this.createNotification(
        `Por favor, valide os dados informados nos campos: ${invalidFields.toString()}`,
        PoToasterType.Warning
      );
      return false;
    } else {
      return true;
    }
  }

  public onChangeFields(
    changedValue: PoDynamicFormFieldChanged
  ): PoDynamicFormValidation | null {
    if (!this.isLoading) {
      this.hasChanges = true;
    }
    return null;
  }

  public async loadResource(): Promise<any> {
    if (this.currentAction == this.ACTION_EDIT || this.currentAction == this.ACTION_VIEW) {
      let paramID: string = '';
      this.route.params.subscribe((param) => (paramID = param._id));
      await this.resourceService.getById(paramID).then(
        (resource) => (this.resource = resource),
        () =>
          this.createNotification(
            'Ocorreu um erro no servidor, tente mais tarde',
            PoToasterType.Error
          )
      );
      return this.resource;
    }
  }

  protected async createResource() {
    await this.resourceService.create(this.resource).then((resource) => {
      this.actionsForSuccess(resource);
    });
  }

  protected async updateResource() {
    await this.resourceService.update(this.resource).then((resource) => {
      this.resource = resource;
      this.actionsForSuccess(resource);
    });
  }

  protected buildResourceModel(): PoDynamicFormField[] {
    return [];
  }
}
