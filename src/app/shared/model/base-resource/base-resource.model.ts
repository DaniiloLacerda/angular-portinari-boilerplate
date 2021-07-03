import {
  PoDynamicFormField,
  PoTableColumn,
  PoSelectOption,
  PoDynamicViewField,
} from '@po-ui/ng-components';

export abstract class BaseResourceModel {
  public _id?: string;

  protected abstract formBuild(): Array<PoDynamicFormField>;
  get fieldsForm(): Array<PoDynamicFormField> {
    return this.formBuild();
  }

  protected abstract viewBuild(): Array<PoDynamicViewField>;
  get fieldsView(): Array<PoDynamicViewField> {
    return this.viewBuild();
  }

  protected abstract gridBuild(): Array<PoTableColumn>;
  protected abstract dependencyBuild(): Array<PoTableColumn>;
  get gridColumns(): Array<PoTableColumn> {
    if (this.dependencyBuild()) {
      return Object.assign(Array<PoTableColumn>(), this.gridBuild(), this.dependencyBuild());
    }
    return this.gridBuild();
  }

  get gridColumnsSample(): Array<PoTableColumn> {
    return this.gridBuild();
  }

  protected abstract formSearchBuild(): Array<PoDynamicFormField>;
  get formSearchFields(): Array<PoDynamicFormField> {
    return this.formSearchBuild();
  }

  protected abstract formReportBuild(): Array<PoDynamicFormField>;
  get formReportFields(): Array<PoDynamicFormField> {
    return this.formReportBuild();
  }

  get filterOptions(): PoSelectOption[] {
    return [
      { label: 'Contém', value: 'contains' },
      { label: 'Exatamente', value: 'eq' },
      { label: 'Maior ou igual a', value: 'ge' },
      { label: 'Menor ou igual a', value: 'le' },
    ];
  }

  protected abstract reportBuild(): Array<PoTableColumn>;
  get reportColumns(): Array<PoTableColumn> {
    return this.reportBuild();
  }

  public abstract advancedSearchBuild(): Array<PoDynamicFormField>;
  public abstract advancedSearchValues(): Array<PoDynamicFormField>;
}
