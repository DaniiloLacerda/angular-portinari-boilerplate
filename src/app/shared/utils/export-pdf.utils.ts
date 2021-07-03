// @ts-nocheck
import { BaseResourceModel } from '@shared/base/base-resource/base-resource.model';
import { Injector, Injectable } from '@angular/core';
import { PoDynamicField } from '@po-ui/ng-components/lib/components/po-dynamic/po-dynamic-field.interface';
import { ExportBaseUtilsService } from './export-base.utils';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

export enum PDFOrientation {
  LANDSCAPE = 'landscape',
  PORTRAIT = 'portrait',
}

@Injectable({
  providedIn: 'root',
})
export class ExportPDFUtilsService extends ExportBaseUtilsService {
  private MetaData: any = {};
  private footer: any = {};
  private configPDFPage: any = {};
  private contextPage: any = {};
  private context: Array<any> = new Array<any>();
  private style: any = {};
  private userPassword: string;
  public waterMark: any = {};

  constructor(protected injector: Injector) {
    super(injector);
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  public setMetadata(title: string, author: string, subject: string) {
    this.MetaData = {
      info: { title, author, subject },
    };
  }

  public setFilter(filters: string, userConfigs) {
    this.footer = {
      columns: [{ text: `Filtros: ${filters}`, marginLeft: userConfigs.marginLeft }],
    };
  }

  private setWaterMark(text: string): any {
    return {
      watermark: {
        text,
        color: '#FC4C02',
        opacity: 0.2,
        bold: true,
        italics: false,
      },
    };
  }

  /**
   * Função para informar um cabeçalho para a pagina.
   * @param title
   * @param subtitle
   * @param newPage boolean, indica se deve colocar o conteudo apos este cabeçalho em uma nova pagina
   */
  public setHeader(
    title: string,
    subtitle?: string,
    newPage = false,
    orientation?: PDFOrientation
  ) {
    this.context.push([
      {
        text: title,
        style: 'header',
        pageBreak: `${newPage ? 'before' : ''}`,
        pageOrientation: orientation,
      },
      { text: subtitle, style: 'subheader' },
    ]);
  }

  public userPreferences(userConfigs) {
    this.configPDFPage = {
      pageSize: userConfigs.pageFormat,
      pageOrientation: userConfigs.pageOrientation,
      pageMargins: [
        userConfigs.marginLeft,
        userConfigs.marginTop,
        userConfigs.marginRight,
        userConfigs.marginBottom,
      ],
    };
    this.waterMark = this.setWaterMark(userConfigs.waterMark);
    this.styles(userConfigs);
  }

  public accessPrivileges(userConfigs) {
    this.userPassword = userConfigs.password;
  }

  public styles(userConfigs) {
    this.style = {
      styles: {
        header: this.styleProperties(userConfigs.titleFontSize, 'center', true, '#FC4C02', 10),
        subheader: this.styleProperties(
          userConfigs.titleFontSize,
          'right',
          true,
          '#FC4C02',
          [0, 5, 0, 5]
        ),
        eleveTable: {
          margin: [0, 5, 0, 15],
        },
        labelWithText: {
          margin: [10, 3, 0, 10],
        },
        labelOfText: this.styleProperties(
          userConfigs.textFontSize,
          '',
          true,
          '#000000',
          [0, 8, 0, 4]
        ),
        textOfLabel: this.styleProperties(
          userConfigs.textFontSize,
          '',
          false,
          '',
          [0, 8, 0, 4]
        ),
        tableHeader: this.styleProperties(userConfigs.titleFontSize, '', true, '#FC4C02'),
      },
      defaultStyle: this.styleProperties(userConfigs.textFontSize, 'justify', false, '#000000'),
    };
  }

  public styleProperties(
    fontSize?: any,
    alignment?: string,
    bold?: boolean,
    color?: string,
    margin?: any
  ) {
    return { fontSize, alignment, bold, color, margin };
  }

  public tableLayouts() {
    pdfMake.tableLayouts = {
      tableMPN: {
        hLineWidth(i, node) {
          if (i === 0 || i === node.table.body.length) {
            return 0;
          }
          return i === node.table.headerRows ? 2 : 1;
        },
        vLineWidth(i) {
          return 0;
        },
        hLineColor(i) {
          return i === 1 ? '#FF7F32' : '#AAA';
        },
        paddingLeft(i) {
          return i === 0 ? 0 : 8;
        },
        paddingRight(i, node) {
          return i === node.table.widths.length - 1 ? 0 : 8;
        },
        fillColor(rowIndex) {
          return rowIndex % 2 === 0 ? (rowIndex != 0 ? '#CCCCCC' : null) : null;
        },
      },
    };
  }

  public addLineWithLabel(label: string, text: string, type: string) {
    this.context.push({
      text: [
        { text: `${label}: `, style: 'labelOfText' },
        { text: `${this.formatType(text, type)}`, style: 'textOfLabel' },
      ],
      style: 'labelWithText',
    });
  }

  public addLineTitle(text: string, fontSize = 8, color = 'black') {
    this.context.push({
      text,
      style: { fontSize, color },
      margin: [0, 5, 0, 5],
    });
  }

  public addLineSeparator() {
    this.context.push({
      canvas: [
        {
          type: 'line',
          x1: 0,
          y1: 0,
          x2: 800,
          y2: 0,
          lineWidth: 1,
          color: '#ECEEEE',
        },
      ],
    });
  }

  /**
   * Adicionar uma tabela ao documento PDF utilizando um Model mapeado
   */
  public addTableUsingModel<T extends BaseResourceModel>(model: new () => T, listItem: T[]) {
    const dataGrid = new model().reportColumns;
    this.processDataTable(listItem, dataGrid);
    const header = [];
    const body = [];
    const widths = [];

    this.headerOfTable.forEach((h) => {
      header.push({ text: h.name, style: 'tableHeader' }),
        widths.push(this.normalizeWidth(h.width));
    });

    body.push(header);
    this.rowTable.forEach((d) => body.push(d));

    this.context.push({
      style: 'eleveTable',

      table: { body, dontBreakRows: true, widths },
      layout: 'tableMPN',
    });
  }

  public normalizeWidth(width: string) {
    const normalized = width.replace(/[^0-9]+/, '');
    if (normalized) {
      return parseInt(normalized) * 8;
    } else {
      return 80;
    }
  }

  /**
   * Este metodo se encarrega de Interpretar o componente informado e transformar o mesmo em uma lista de columnas
   * Cada elememnto e dividido por colunas respeitando a formatação informada em gridColumns
   * Caso este campo não seja preenchido nas config do model, sera informado por Default 4 deixando assim 3 colunas para o conteudo informado.
   *
   * Recebe a base do PoDynamicField, permitindo ser passado o
   * PoDynamicViewField, PoDynamicFormField entre outros
   * @param property Array<PoDynamicField>
   *
   * Recebe o dado generico de uma lista, permitindo passar uma lista de objetos
   * @param data Array<T>
   *
   * Recebe o Field informado como Titulo.
   * O mesmo tera o conteudo como destaque.
   * @param primaryField string
   *
   * Informar um Map contendo a chave "nome do field a ser pesquisado", valor array com os Fields
   * @param dependency Map<string, Array<PoDynamicField>>
   */
  public addDynamicView<T>(
    property: Array<PoDynamicField>,
    data: Array<T>,
    primaryField?: string,
    dependency?: Map<string, Array<PoDynamicField>>
  ): void {
    data.forEach((d) => {
      const cols: Array<[string, string, string]> = [];
      let countColumns = 0;
      let countLine = 0;
      if (primaryField && d[primaryField]) {
        this.addLineTitle(d[primaryField], 14, '#FC4C02');
      }
      property.forEach((p) => {
        if (p.divider) {
          this.addLineTitle(p.label, 10, '#FC4C02');
          this.addLineSeparator();
        }
        countLine += p.gridColumns || 4;
        if (countLine <= 12) {
          countColumns++;
        }
        cols.push([p.label, this.formatType(d[p.property], p.type, true), p.type]);
      });
      this.addColumns(countColumns, cols);
      if (dependency) {
        Object.keys(d).forEach((k) => {
          if (d[k] instanceof Array && dependency.has(k)) {
            this.addDynamicView<T>(dependency.get(k), d[k]);
          }
        });
      }
    });
  }

  public addColumns(columns = 2, data: Array<[string, string, string]>) {
    const cols: Array<any> = [];
    const items: Array<Array<any>> = [];
    let index = 0;
    data.forEach((x) => {
      if (!Array.isArray(items[index])) {
        items[index] = [];
      }
      items[index].push(
        { text: `${x[0]}: \n`, style: 'labelOfText' },
        { text: `${this.formatType(x[1], x[2])} \n`, style: 'textOfLabel' }
      );
      index++;
      if (index === columns) {
        index = 0;
      }
    });
    for (let x = 0; x <= columns; x++) {
      if (!Array.isArray(cols[x])) {
        cols[x] = [];
      }
      cols[x].push({
        width: '*',
        text: items[x],
        style: 'labelWithText',
      });
    }
    this.context.push({ columns: cols, columnGap: 10 });
  }

  private createContext() {
    this.contextPage = Object.assign(
      this.waterMark ?? null,
      this.configPDFPage,
      this.MetaData ?? null,
      { footer: this.footer },
      { content: [this.context] },
      this.style,
      { userPassword: this.userPassword }
    );
  }

  public resetReport() {
    this.context = new Array<any>();
    this.configPDFPage = {};
    this.footer = {};
    this.MetaData = {};
  }

  public openPDF() {
    this.createContext();
    pdfMake.createPdf(this.contextPage).open();
    this.resetReport();
  }

  public downloadPDF(nameOfPDF: string) {
    this.createContext();
    pdfMake.createPdf(this.contextPage).download(`${nameOfPDF}.pdf`);
    this.resetReport();
  }
}
