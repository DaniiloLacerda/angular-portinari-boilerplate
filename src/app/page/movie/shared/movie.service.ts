import { Injectable, Injector } from '@angular/core';
import { BaseResourceService } from '@shared/base/base-resource.service';
import { MovieModel } from '@shared/base/movie.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService extends BaseResourceService<MovieModel> {
  constructor(protected injector: Injector) {
    super('movie', injector, MovieModel);
  }
}
