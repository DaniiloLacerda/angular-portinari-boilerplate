/* eslint-disable */

import { PoSelectOption } from '@po-ui/ng-components';

export class Utils {
  static fromJson<T>(type: new () => T, jsonData: any): T {
    return Object.assign(new type(), this.processJson<T>(type, jsonData));
  }

  static jsonToQueryString(json: any) {
    return (
      '?' +
      Object.keys(json)
        .map(function (key) {
          if (json[key]) {
            return (
              encodeURIComponent(key) +
              '=' +
              encodeURIComponent(
                `${json[key]}${
                  key == 'startDate' ? 'T00:00:00Z' : key == 'endDate' ? 'T23:59:59Z' : ''
                }`
              )
            );
          } else {
            return key;
          }
        })
        .join('&')
    );
  }

  static processJson<T>(type: new () => T, jsonData: any): any {
    const data = Object.assign({}, jsonData);
    Object.keys(data).forEach(function (key) {
      if (!(key in new type()) && key != 'id') {
        delete data[key];
      }
      if (data[key] == undefined) {
        delete data[key];
      }
    });
    return data;
  }

  static instanceOf<T>(type: new () => T, ...data: any[]): T {
    const model = new type();
    data.forEach((x) => {
      if (x) {
        Object.assign(model, this.processJson<T>(type, Object.assign({}, x)));
      }
    });
    return model;
  }

  static enumToOptions(data: any, inverter = false) {
    const dataResult: Array<PoSelectOption> = [];
    for (const [propertyKey, propertyValue] of Object.entries(data)) {
      if (!Number.isNaN(Number(propertyKey))) {
        continue;
      }
      dataResult.push(
        !inverter
          ? { label: propertyKey as string, value: propertyValue as string }
          : { label: propertyValue as string, value: propertyKey as string }
      );
    }
    return dataResult;
  }

  static clearFormatDocument(document: string): string {
    return document.replace(/[\/\.\s-]+/g, '');
  }
}
