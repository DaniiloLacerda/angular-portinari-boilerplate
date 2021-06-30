import { MovieConfigModel } from './config-model/movie.config.model';

export class MovieModel extends MovieConfigModel {
  constructor(
    public name?: string,
    public gender?: string,
    public producer?: string,
    public type?: MovieTypeEnum,
    public userId?: string,
    public active?: boolean
  ) {
    super();
  }
}

export enum MovieTypeEnum {
  MOVIE,
  SERIE,
}
