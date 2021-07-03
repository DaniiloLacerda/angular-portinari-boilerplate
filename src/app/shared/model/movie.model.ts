import { MovieConfigModel } from './config-model/movie.config.model';

export class MovieModel extends MovieConfigModel {
  constructor(
    public _id?: string,
    public name?: string,
    public gender?: string,
    public producer?: string
  ) {
    super();
  }
}
