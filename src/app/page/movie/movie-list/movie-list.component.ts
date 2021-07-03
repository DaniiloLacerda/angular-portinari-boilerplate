import { Component, Injector, OnInit } from '@angular/core';
import { MovieService } from '@page/shared/movie.service';

import { PoTableAction } from '@po-ui/ng-components';
import { MovieModel } from '@shared/base/movie.model';
import { BaseResourceListComponent } from 'src/app/shared/component/base-resource/base-resource-list.component';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css'],
})
export class MovieListComponent extends BaseResourceListComponent<MovieModel> {
  public actionsGrid: Array<PoTableAction> = this.actionsWithoutView();

  constructor(protected injector: Injector, protected service: MovieService) {
    super(injector, new MovieModel(), service);
  }

  protected dataSearch(filter: string): any {
    return { name: { contains: filter } };
  }
}
