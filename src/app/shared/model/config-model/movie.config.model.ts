import {
  PoDynamicFormField,
  PoDynamicViewField,
  PoTableColumn,
  PoDynamicFieldType,
} from '@po-ui/ng-components';
import { BaseResourceModel } from '../base-resource/base-resource.model';

export class MovieConfigModel extends BaseResourceModel {
  constructor() {
    super();
  }
  protected formBuild(): PoDynamicFormField[] {
    return [];
  }
  protected viewBuild(): PoDynamicViewField[] {
    return [];
  }

  protected viewStoreQuantityBuild(): PoDynamicViewField[] {
    return [
      {
        property: 'quantityTotal',
        label: 'Quantidade Total',
        gridColumns: 3,
        gridSmColumns: 12,
      },
    ];
  }

  get gridOrderStoreQuantity(): Array<PoTableColumn> {
    return this.viewStoreQuantityBuild();
  }

  protected gridBuild(): PoTableColumn[] {
    return [
      {
        property: 'status',
        type: 'label',
        width: '20%',
        labels: [
          {
            value: 'ACTIVE',
            color: 'color-02',
            label: 'ATIVO',
          },
          {
            value: 'COMPLETED',
            color: 'color-10',
            label: 'COMPLETO',
          },
          {
            value: 'CANCELED',
            color: 'color-07',
            label: 'CANCELADO',
          },
        ],
      },
      {
        property: 'date',
        label: 'Data',
        width: '20%',
        type: PoDynamicFieldType.Date,
      },
      {
        property: 'total',
        label: 'Total ',
        width: '50%',
        type: PoDynamicFieldType.Currency,
        format: 'BRL',
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
    return [];
  }

  public advancedSearchBuild(): PoDynamicFormField[] {
    return [];
  }

  public advancedSearchValues() {
    return [];
  }
}
