import { OnInit, Injector, AfterContentChecked, ViewChild, Directive } from '@angular/core';
import { BaseResourceModel } from '@shared/base/base-resource/base-resource.model';
import {
  PoPageAction,
  PoTableColumn,
  PoTableDetail,
  PoDynamicFormField,
  PoPageFilter,
  PoTableAction,
  PoTableLiterals,
} from '@po-ui/ng-components';
import { PoModalAction, PoModalComponent } from '@po-ui/ng-components/lib/components/po-modal';
import { BaseResourceComponent } from './base-resource.component';
import { MatChipList } from '@angular/material/chips';
import { BaseResourceService } from '@shared/base/base-resource.service';

@Directive()
export abstract class BaseResourceListComponent<T extends BaseResourceModel>
  extends BaseResourceComponent
  implements OnInit, AfterContentChecked
{
  public totalExpanded = 0;
  public resources: Array<T> = new Array<T>();
  public displayedColumns: string[];
  public actionsGrid: Array<PoPageAction>;
  public actionsPage: Array<PoPageAction>;
  public totalPages = 1;
  public pageSize = 15;
  public currentPage = 1;
  public detailColumns: PoTableDetail | null = this.configDetailsColumns();
  public columns: Array<PoTableColumn>;
  public itemToRemove: any;
  public filterChips = [];
  public searchFields: PoDynamicFormField[];
  public searchFieldsValues: any;
  public columnToSort = 'name';
  public labelFilter = '';
  protected placeholder = 'Campo de Pesquisa...';
  readonly literals: PoTableLiterals = {
    noData: 'Sem dados para mostrar',
  };

  @ViewChild('advancedFilterModal', { static: true }) advancedFilterModal: PoModalComponent;
  @ViewChild('activeFilter', { static: true }) activeFilter: MatChipList;

  constructor(
    protected injector: Injector,
    protected resource: T,
    protected resourceService: BaseResourceService<T>,
    protected gridWithDetail: boolean = true
  ) {
    super(injector);
    this.columns = this.getGrid(resource, this.gridWithDetail);

    this.searchFields = this.resource.advancedSearchBuild();
    this.searchFieldsValues = this.resource.advancedSearchValues();
  }

  public filterSettings: PoPageFilter;

  public readonly advancedFilterPrimaryAction: PoModalAction = {
    action: () => {
      this.advancedFilterModal.close();
      this.filterAdvancedAction();
    },
    label: 'Aplicar filtros',
  };

  advancedFilterActionModal() {
    this.advancedFilterModal.open();
  }

  protected abstract dataSearch(filter: string): any;
  filterAction(filter = this.labelFilter) {
    const search = this.dataSearch(filter);
    this.onSearch(search);
    this.filterChips = [];
  }

  filterAdvancedAction() {
    this.labelFilter = '';
    this.onSearch(
      this.createAdvancedFilter(this.resource, this.resourceForm.value, this.searchFields)
    );
  }

  getGrid<T extends BaseResourceModel>(data: T, showDetails?: boolean): Array<PoTableColumn> {
    if (showDetails) {
      return data.gridColumns;
    }
    return data.gridColumnsSample;
  }

  async ngOnInit() {
    await this.onLoadDataPage();
    this.filterSettings = {
      action: this.filterAction.bind(this),
      placeholder: this.placeholder,
    };
  }

  protected async onLoadDataPage() {
    await this.resourceService.getAll().then((resp: T[]) => {
      this.resources = resp;
    });

    this.resources.sort((a, b) => {
      return a[this.columnToSort] > b[this.columnToSort] ? 1 : -1;
    });
  }

  public async onPageChange(num: number) {
    this.currentPage = num;
    await this.onLoadDataPage();
    this.processBeforeLoadData();
  }

  public ngAfterContentChecked() {
    this.loadActions();
  }

  protected processBeforeLoadData() {
    return [];
  }

  public showRemoveAlert(item: any) {
    this.itemToRemove = item;
    this.confirm('Excluir', 'Deseja realmente deletar este item?', this.onDelete.bind(this));
  }

  public async onDelete() {
    if (this.itemToRemove._id) {
      await this.resourceService.delete(this.itemToRemove._id).then(() => {
        this.resources = this.resources.filter(
          (element) => element._id != this.itemToRemove._id
        );
      });
    } else {
      if (this.itemToRemove.code) {
        this.resources = this.resources.filter(
          (element: any) => element.code != this.itemToRemove.code
        );
      } else {
        this.resources = this.resources.filter(
          (element: any) => element.name !== this.itemToRemove.name
        );
      }
    }
  }

  public async onSearch(filter: any, searchUrl?: string) {
    this.resources = await this.resourceService.search(filter, searchUrl);
    this.resources.sort((a, b) => {
      return a[this.columnToSort] > b[this.columnToSort] ? 1 : -1;
    });
  }

  onEdit(row: any) {
    this.redirectTo(this.componentUrl, row._id, this.ACTION_EDIT);
  }

  viewResource(row: any) {
    this.redirectTo(this.componentUrl, row._id, this.ACTION_VIEW);
  }

  private loadActions() {
    this.setActions();
    if (this.actionsGrid == null) {
      this.actionsGrid = this.defaultActionsToList();
    }
    if (this.actionsPage == null) {
      this.actionsPage = this.defaultActionsPageList();
    }
  }

  private defaultActionsToList(): Array<PoPageAction> {
    const items: Array<PoPageAction> = [];
    items.push({
      label: 'Visualizar',
      action: this.viewResource.bind(this),
      icon: 'po-icon-eye',
    });

    items.push({
      label: 'Editar',
      action: this.onEdit.bind(this),
      icon: 'po-icon-edit',
    });

    items.push({
      label: 'Excluir',
      action: this.showRemoveAlert.bind(this),
      icon: 'po-icon-delete',
      type: 'danger',
    });
    return items;
  }

  public actionsWithoutView(): PoTableAction[] {
    const items: Array<PoTableAction> = [];
    items.push({
      label: 'Editar',
      action: this.onEdit.bind(this),
      icon: 'po-icon-edit',
    });

    items.push({
      label: 'Excluir',
      action: this.showRemoveAlert.bind(this),
      icon: 'po-icon-delete',
      type: 'danger',
    });
    return items;
  }

  private defaultActionsPageList(): Array<PoPageAction> {
    const item: Array<PoPageAction> = [];
    item.push({ label: 'Novo', url: this.componentUrl + '/create', disabled: false });
    return item;
  }

  onCollapseDetail() {
    this.totalExpanded -= 1;
    this.totalExpanded = this.totalExpanded < 0 ? 0 : this.totalExpanded;
  }

  onExpandDetail() {
    this.totalExpanded += 1;
  }

  public configColumns(): Array<PoTableColumn> {
    return [];
  }
  public configDetailsColumns(): PoTableDetail | null {
    return null;
  }
}
