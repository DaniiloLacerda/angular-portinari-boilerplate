import { PoDynamicFormField, PoDynamicViewField, PoTableColumn } from '@po-ui/ng-components';
import { BaseResourceModel } from '../base-resource/base-resource.model';

export class UserConfigModel extends BaseResourceModel {
  constructor() {
    super();
  }

  public advancedSearchValues(): PoDynamicFormField[] {
    return [];
  }

  protected formSearchBuild(): PoDynamicFormField[] {
    return [];
  }

  protected viewBuild(): PoDynamicViewField[] {
    return [];
  }

  protected formReportBuild(): PoDynamicFormField[] {
    return [];
  }

  protected reportBuild(): PoTableColumn[] {
    return [];
  }

  protected dependencyBuild(): Array<PoTableColumn> {
    return [];
  }

  public gridBuild(): Array<PoTableColumn> {
    return [];
  }

  public formViewBuild(): Array<PoDynamicViewField> {
    return [];
  }

  public formBuild(): PoDynamicFormField[] {
    return [];
  }

  public formBuildEdit(): PoDynamicFormField[] {
    return [];
  }

  public advancedSearchBuild(): PoDynamicFormField[] {
    return [];
  }
}
