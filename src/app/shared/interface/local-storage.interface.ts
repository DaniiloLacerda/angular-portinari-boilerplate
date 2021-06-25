export interface DataItems {
  id: string;
  name: string;
}

export interface LocalStorageCurrentUser {
  name: string;
  id: string;
}
export interface LocalStorage {
  USER_KEY: string;
  TIME_EXPIRE: number;
  JWT_TOKEN: string;
  stores: DataItems[];
  products: DataItems[];
  vendors: DataItems[];
  CURRENT_USER: LocalStorageCurrentUser;
}
