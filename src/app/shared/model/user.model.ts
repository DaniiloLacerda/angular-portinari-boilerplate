import { UserConfigModel } from './config-model/user.config.model';

export class UserModel extends UserConfigModel {
  constructor(
    public name?: string,
    public userName?: string,
    public password?: string,
    public token?: string,
    public exp?: number
  ) {
    super();
  }
}
