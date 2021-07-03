import { PoDynamicFormField, PoDynamicViewField, PoTableColumn } from '@po-ui/ng-components';
import { BaseResourceModel } from '../base-resource/base-resource.model';

export class MovieConfigModel extends BaseResourceModel {
  constructor() {
    super();
  }
  protected formBuild(): PoDynamicFormField[] {
    return [
      {
        property: 'name',
        label: 'Nome',
        minLength: 3,
        gridColumns: 6,
        gridSmColumns: 12,
        required: true,
        pattern: '[^0-9]*',
        errorMessage: 'O nome deve ser preenchido com letras.',
        maxLength: 60,
      },
      {
        property: 'gender',
        label: 'Gênero',
        minLength: 3,
        gridColumns: 6,
        gridSmColumns: 12,
        required: true,
        pattern: '[^0-9]*',
        maxLength: 60,
      },
      {
        property: 'producer',
        label: 'Produtor',
        minLength: 3,
        gridColumns: 6,
        gridSmColumns: 12,
        required: true,
        pattern: '[^0-9]*',
        maxLength: 60,
      },
    ];
  }
  protected viewBuild(): PoDynamicViewField[] {
    return [];
  }

  protected gridBuild(): PoTableColumn[] {
    return [
      {
        property: 'name',
        width: '30%',
      },
      {
        property: 'gender',
        width: '30%',
        label: 'Gênero',
      },
      {
        property: 'producer',
        width: '40%',
        label: 'Produtor',
      },
    ];
  }

  protected dependencyBuild(): PoTableColumn[] {
    return [];
  }

  protected formSearchBuild(): PoDynamicFormField[] {
    return [];
  }

  protected formReportBuild(): PoDynamicFormField[] {
    return [];
  }

  protected reportBuild(): PoTableColumn[] {
    return [
      {
        property: 'name',
        label: 'Nome',
        width: '30%',
      },
      {
        property: 'gender',
        width: '30%',
        label: 'Gênero',
      },
      {
        property: 'producer',
        width: '40%',
        label: 'Produtor',
      },
    ];
  }

  public advancedSearchBuild(): PoDynamicFormField[] {
    return [];
  }

  public advancedSearchValues() {
    return [];
  }
}
