import { NgModule } from '@angular/core';
import { MovieRoutingModule } from './movie-routing.module';

import { SharedModule } from 'src/app/shared/shared.module';
import { MovieListComponent } from './movie-list/movie-list.component';

@NgModule({
  declarations: [MovieListComponent],
  imports: [SharedModule, MovieRoutingModule],
})
export class MovieModule {}
