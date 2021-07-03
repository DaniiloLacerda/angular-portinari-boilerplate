import { BaseResourceModel } from '@shared/base/base-resource/base-resource.model';
import { BaseResourceComponent } from './base-resource.component';
import { Injector, Directive } from '@angular/core';
import { BaseResourceService } from '@shared/base/base-resource.service';
import { PoDynamicFormField, PoDynamicViewField, PoTableColumn } from '@po-ui/ng-components';
import { Utils } from '../../utils/utils';
import { ExportPDFUtilsService, PDFOrientation } from '../../utils/export-pdf.utils';
import { PdfConfigs } from '@interface/pdf-configs.interface';
import { ReportFieldsConfigModel } from '@shared/base/config-model/report-fields.config.model';
import { ListModel } from '@shared/base/list-model.model';

@Directive()
export abstract class BaseResourceReportComponent<
  T extends BaseResourceModel
> extends BaseResourceComponent {
  constructor(
    protected injector: Injector,
    public resource: T,
    public instanceOf: new () => T,
    protected resourceService: BaseResourceService<T>
  ) {
    super(injector);
    this.loadSearchComponent<T>(resource);
    this.UtilsPDF = this.injector.get(ExportPDFUtilsService);
    this.configurationFields();
  }

  static PDFOrientation = PDFOrientation;

  public columns: Array<PoTableColumn>;
  protected UtilsPDF: ExportPDFUtilsService;
  public resourceList: T[] = [];
  public searchFields: Array<PoDynamicFormField>;
  public reportFields: Array<PoDynamicFormField>;
  public viewFields: Array<PoDynamicViewField>;
  public bodySearch: any;
  public nameOfDocumento: string;
  public configFields: Array<PoDynamicFormField>;
  public userConfigs: PdfConfigs = {
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 20,
    marginTop: 20,
    textFontSize: 9,
    titleFontSize: 12,
    pageOrientation: 'landscape',
    pageFormat: 'a4',
    showHeader: true,
    showFooter: true,
    waterMark: 'Movies',
    password: null,
  };

  public totalPages = 1;
  public pageSize = 15;
  public currentPage = 1;
  public printOnlyPage = false;

  public locale = 'pt';
  public endDate: Date;
  public startDate: Date;
  public limitOfEndDate: Date;
  public resources: Array<T> = new Array<T>();

  loadSearchComponent<T extends BaseResourceModel>(data: T) {
    this.viewFields = data.fieldsView;
    this.searchFields = data.formSearchFields;
    this.reportFields = data.formReportFields;
    this.columns = data.gridColumns;
  }

  configurationFields() {
    this.configFields = new ReportFieldsConfigModel().configForm();
  }

  async onSearch() {
    const queryString = this.mountDataQuery(Utils.jsonToQueryString(this.resourceForm.value));
    this.createFooterFilters(this.resourceForm.value);
    await this.resourceService.getReport(queryString).then((resp: ListModel<T>) => {
      this.totalPages = resp.totalPage!;
      this.resourceList = resp.data;
    });
  }

  public onChangeStartDate() {
    const dateAux = new Date(this.startDate);
    this.limitOfEndDate = new Date(dateAux.getFullYear(), dateAux.getMonth() + 4, 0);
    if (+new Date(this.endDate) > this.limitOfEndDate.getTime()) {
      this.endDate = this.limitOfEndDate;
    }
  }

  private mountDataQuery(baseQuery: string, pageSize?: number, page?: number): string {
    let query = baseQuery;
    if (this.startDate) {
      query += `&startDate=${this.startDate}`;
    }
    if (this.endDate) {
      query += `&endDate=${this.endDate}`;
    }
    query += `&pageSize=${pageSize || this.pageSize}&page=${page || this.currentPage}`;
    return query;
  }

  public async onPageChange(num: number) {
    this.currentPage = num;
    await this.onSearch();
  }

  protected loadDataToPDF(pdfConfigs: PdfConfigs) {
    if (pdfConfigs.showHeader) {
      this.UtilsPDF.setHeader(this.pageTitle);
    }
    this.UtilsPDF.setMetadata(this.pageTitle, 'LODAX', 'Corporation');
    if (pdfConfigs.showFooter) {
      this.UtilsPDF.setFilter(this.filterReport, pdfConfigs);
    }
    this.UtilsPDF.userPreferences(pdfConfigs);
    this.UtilsPDF.accessPrivileges(pdfConfigs);
    this.UtilsPDF.tableLayouts();
    this.bodyToPDF();
  }

  protected bodyToPDF() {
    this.UtilsPDF.addTableUsingModel<T>(this.instanceOf, this.resourceList);
  }

  public onSavePDF(userConfigs: PdfConfigs) {
    this.loadDataToPDF(userConfigs);
    this.UtilsPDF.openPDF();
  }

  public onDownloadPDF(userConfigs: PdfConfigs) {
    this.loadDataToPDF(userConfigs);
    this.UtilsPDF.downloadPDF(this.pageTitle);
  }

  protected dataChangeBeforeXlsx(data: Array<T>): Array<T> {
    return data;
  }

  protected async processDataToBody(): Promise<T[]> {
    const resourceData: Array<T> = Object.assign(new Array<T>(), this.resourceList);
    let dataArray: Array<T> = this.dataChangeBeforeXlsx(resourceData);
    if (!this.printOnlyPage) {
      const queryString = Utils.jsonToQueryString(this.resourceForm.value);
      const auxQuery = this.mountDataQuery(queryString, 1000, 1);
      const report = await this.resourceService.getReport(auxQuery);
      dataArray = this.dataChangeBeforeXlsx(report.data);
      if (report.totalPage! > 1) {
        for (let x = 2; x < report.totalPage! + 1; x++) {
          const dataQueryString = this.mountDataQuery(queryString, 1000, x);
          const { data } = await this.resourceService.getReport(dataQueryString);
          dataArray = dataArray.concat(this.dataChangeBeforeXlsx(data));
        }
      }
    }
    return Promise.resolve(dataArray);
  }

  protected buildResourceModel(): PoDynamicFormField[] {
    return [];
  }

  protected createFooterFilters(filters) {
    this.filterReport = '';
    Object.keys(filters).forEach((x) => {
      this.filterReport += filters[x]
        ? //@ts-ignore
          ` ${this.reportFields.find((r) => r.property === x).label}: ${
            this.filterValue(x, filters[x]) ?? ''
          }`
        : '';
    });
  }

  protected filterValue(property, value) {
    const field = this.reportFields.find((r) => r.property === property);
    if (value) {
      if (field) {
        if (field.options) {
          field.options.forEach((x) => {
            if (x.value === value) {
              value = x.label;
            }
          });
        }
        value = this.UtilsPDF.formatType(value, field.type!);
      }
    }
    return value;
  }
}
