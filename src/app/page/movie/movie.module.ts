import { NgModule } from '@angular/core';
import { MovieRoutingModule } from './movie-routing.module';

import { SharedModule } from 'src/app/shared/shared.module';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieFormComponent } from './movie-form/movie-form.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';

@NgModule({
  declarations: [MovieListComponent, MovieFormComponent, MovieDetailComponent],
  imports: [SharedModule, MovieRoutingModule],
})
export class MovieModule {}
