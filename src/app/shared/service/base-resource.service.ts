import { BaseResourceModel } from '@shared/base/base-resource/base-resource.model';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';
import { Directive, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environments/environment';
import { Utils } from '../utils/utils';
import { ListModel } from '@shared/base/list.model';

@Directive()
export abstract class BaseResourceService<T extends BaseResourceModel> implements OnInit {
  protected header = {
    headers: {
      'Content-Type': 'application/json',
      'X-PO-No-Message': 'false',
    },
  };

  protected http: HttpClient;
  protected apiPath;
  protected route: ActivatedRoute;
  protected router: Router;
  constructor(
    protected pathInToApi: string = '',
    protected injector: Injector,
    protected type: new () => T
  ) {
    this.http = injector.get(HttpClient);
    this.router = injector.get(Router);
    this.route = injector.get(ActivatedRoute);
    this.apiPath = `${environment.API_URL}/${pathInToApi}`;
  }

  ngOnInit() {
    if (!this.pathInToApi) {
      this.pathInToApi = this.route.snapshot.url[0].path;
    }
  }

  async getAll(): Promise<T[]> {
    return await this.http
      .get(this.apiPath, this.header)
      .pipe(map<any, any>(this.jsonDataToResources.bind(this)), catchError(this.handleError))
      .toPromise();
  }

  async getPaginate(pageSize = 10, page = 0): Promise<ListModel<T>> {
    return await this.http
      .get(`${this.apiPath}/paginate?pagesize=${pageSize}&page=${page}`, this.header)
      .pipe(
        timeout(20000),
        map(this.jsonDataToResourcesPaginate.bind(this)),
        catchError(this.handleError)
      )
      .toPromise();
  }

  async getReport(queryString?: string): Promise<ListModel<T>> {
    return await this.http
      .get(`${environment.API_URL}/report/${this.pathInToApi}${queryString ?? ''}`, this.header)
      .pipe(
        timeout(20000),
        map(this.jsonDataToResourcesPaginate.bind(this)),
        catchError(this.handleError)
      )
      .toPromise();
  }

  async getById(id: string): Promise<T>;
  async getById(id: string, url: string): Promise<T>;
  async getById(id: string, url?: string): Promise<T> {
    return await this.http
      .get(`${!url ? this.apiPath : url}/${id}`, this.header)
      .pipe(
        timeout(20000),
        map(this.jsonDataToResource.bind(this)),
        catchError(this.handleError)
      )
      .toPromise();
  }

  async create(resource: T): Promise<T>;
  async create(resource: T, url: string): Promise<T>;
  async create(resource: T, url?: string): Promise<T> {
    return await this.http
      .post(
        !url ? this.apiPath : url,
        this.jsonDataToResource(this.cleanIDOfChild(resource, true)),
        this.header
      )
      .pipe(
        timeout(20000),
        map(this.jsonDataToResource.bind(this)),
        catchError(this.handleError)
      )
      .toPromise();
  }

  async search(resource: any, url?: string): Promise<T[]> {
    return await this.http
      .post(!url ? `${this.apiPath}/search` : url, resource, this.header)
      .pipe(map<any, any>(this.jsonDataToResources.bind(this)), catchError(this.handleError))
      .toPromise();
  }

  async update(resource: T): Promise<T>;
  async update(resource: T, url: string): Promise<T>;
  async update(resource: T, url?: string): Promise<T> {
    const data = Utils.instanceOf<T>(this.type, resource);
    return await this.http
      .put(
        `${!url ? this.apiPath : url}/${resource.id}`,
        this.jsonDataToResource(this.cleanIDOfChild(data)),
        this.header
      )
      .pipe(
        timeout(20000),
        map(this.jsonDataToResource.bind(this)),
        catchError(this.handleError)
      )
      .toPromise();
  }

  async processList(resources: T[]): Promise<T[]> {
    const retorno: T[] = [];
    await Promise.all(
      resources.map(async (x) => {
        if (!x.id) {
          await this.create(x).then((resp) => retorno.push(resp));
        } else {
          await this.update(x).then((resp) => retorno.push(resp));
        }
      })
    );
    return retorno;
  }

  async delete(id: string): Promise<any>;
  async delete(id: string, url: string): Promise<any>;
  async delete(id: string, url?: string): Promise<any> {
    return await this.http
      .delete(`${!url ? this.apiPath : url}/${id}`, this.header)
      .pipe(
        timeout(20000),
        map(() => null),
        catchError(this.handleError)
      )
      .toPromise();
  }

  protected jsonDataToResourcesPaginate(jsonData: any): ListModel<T> {
    const resources: ListModel<T> = new ListModel();
    jsonData['data'].forEach((element) =>
      resources.data.push(Utils.fromJson<T>(this.type, element))
    );
    resources.totalPage = jsonData.totalPage;
    return resources;
  }

  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach((element) => resources.push(Utils.fromJson<T>(this.type, element)));
    return resources;
  }

  protected jsonDataToResource(jsonData: any): T {
    return Utils.fromJson<T>(this.type, jsonData);
  }

  protected handleError(error: any): Observable<any> {
    return throwError(error);
  }

  protected cleanIDOfChild(data: T, isCreated?: boolean): T {
    data.id = undefined;
    return data;
  }
}
