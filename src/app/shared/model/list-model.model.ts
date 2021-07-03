import { BaseResourceModel } from './base-resource/base-resource.model';

export class ListModel<T extends BaseResourceModel> {
  constructor(public data: T[] = [], public totalPage?: number) {}
}
