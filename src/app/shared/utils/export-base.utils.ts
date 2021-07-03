import { Injector } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { PoTableColumn } from '@po-ui/ng-components';

export abstract class ExportBaseUtilsService {
  protected datePipe: DatePipe;
  protected currencyPipe: CurrencyPipe;

  constructor(protected injector: Injector) {
    this.datePipe = this.injector.get(DatePipe);
    this.currencyPipe = this.injector.get(CurrencyPipe);
  }

  public formatType(text: string, type: string, returnString = false): any {
    if (type && text) {
      if (type.toLowerCase().localeCompare('date') == 0) {
        return returnString
          ? this.datePipe.transform(text, 'dd/mm/yyyy')
          : new Date(new Date(text).toDateString());
      }
    }
    return text;
  }

  protected headerOfTable: any[];
  protected rowTable: any[];
  protected indexOfTable: number;

  protected processDataTable<T>(data: T[], columns: PoTableColumn[]): void {
    this.headerOfTable = [];
    this.processToHeader(columns);
    this.rowTable = [];
    this.indexOfTable = 0;
    this.processToRows(data, columns);
    this.rowTable = this.rowTable.filter((row) => row != undefined);
  }

  private processToHeader(columns: PoTableColumn[]) {
    columns.forEach((c) => {
      if (c.detail) {
        this.processToHeader(c.detail.columns);
      } else {
        this.headerOfTable.push({
          name: `${c.label}`,
          width: `${c.width}`,
          filterButton: true,
        });
      }
    });
  }

  private processToRows<T>(
    data: T[],
    columns: PoTableColumn[],
    subItem = false,
    subItemContent?: any[]
  ) {
    data.forEach((r) => {
      const temp = subItemContent;
      this.rowTable[this.indexOfTable] = subItem ? Object.assign([], temp) : [];
      this.processColumns(columns, r);
      this.indexOfTable++;
    });
  }

  private processColumns<T>(columns, r) {
    columns.forEach((c) => {
      if (c.detail) {
        if (
          Array.isArray(r[c.property]) &&
          r[c.property].length &&
          this.rowTable[this.indexOfTable]
        ) {
          this.processToRows<T>(
            r[c.property],
            c.detail.columns,
            true,
            this.rowTable[this.indexOfTable]
          );
        } else {
          c.detail.columns.forEach(() => this.rowTable[this.indexOfTable].push(''));
        }
      } else {
        this.rowTable[this.indexOfTable].push(this.formatType(r[c.property] || ' ', c.type));
      }
    });
  }
}
