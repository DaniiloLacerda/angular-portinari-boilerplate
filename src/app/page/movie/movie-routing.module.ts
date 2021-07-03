import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { MovieFormComponent } from './movie-form/movie-form.component';
import { MovieListComponent } from './movie-list/movie-list.component';

const routes: Routes = [
  { path: '', component: MovieListComponent, data: { name: 'Filmes' } },
  { path: 'create', component: MovieFormComponent, data: { name: 'Cadastro de filmes' } },
  { path: ':_id/edit', component: MovieDetailComponent, data: { name: 'Edição de filmes ' } },
  { path: '**', redirectTo: '' },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MovieRoutingModule {}
