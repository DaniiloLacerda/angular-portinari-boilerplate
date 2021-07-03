import { Component, Injector, OnInit } from '@angular/core';
import { MovieService } from '@page/shared/movie.service';

import { PoPageAction } from '@po-ui/ng-components';
import { MovieModel } from '@shared/base/movie.model';
import { BaseResourceReportComponent } from 'src/app/shared/component/base-resource/base-resource-report.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent extends BaseResourceReportComponent<MovieModel> {
  readonly pageActions: Array<PoPageAction> = [];

  constructor(protected injector: Injector, protected service: MovieService) {
    super(injector, new MovieModel(), MovieModel, service);
  }
}
