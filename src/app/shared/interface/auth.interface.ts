export interface IAuth {
  data: {
    active: boolean;
    _id: string;
    name: string;
    username: string;
    createdAt: string;
    updatedAt: string;
  };
  exp: string;
}
