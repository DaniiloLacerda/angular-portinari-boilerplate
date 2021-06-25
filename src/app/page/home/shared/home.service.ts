import { Injectable, Injector } from '@angular/core';

import { BaseResourceService } from '@shared/base/base-resource.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class HomeService extends BaseResourceService<any> {
    protected productId: string;

    constructor(protected injector: Injector,
                protected router: Router) {
      super('home', injector, null);
    }
}
