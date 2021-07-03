import { Component, Injector, OnInit } from '@angular/core';
import { MovieService } from '@page/shared/movie.service';

import { PoPageAction } from '@po-ui/ng-components';
import { MovieModel } from '@shared/base/movie.model';
import { BaseResourceFormComponent } from 'src/app/shared/component/base-resource/base-resource-form.component';

@Component({
  selector: 'app-movie-form',
  templateUrl: './movie-form.component.html',
  styleUrls: ['./movie-form.component.css'],
})
export class MovieFormComponent extends BaseResourceFormComponent<MovieModel> {
  readonly pageActions: Array<PoPageAction> = [this.btnSave(), this.btnCancel()];

  constructor(protected injector: Injector, protected movieService: MovieService) {
    super(injector, new MovieModel(), movieService);
  }
}
