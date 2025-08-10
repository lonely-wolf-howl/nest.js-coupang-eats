export class CustomerDomain {
  userId: string;
  email: string;
  name: string;

  constructor(param: CustomerDomain) {
    this.userId = param.userId;
    this.email = param.email;
    this.name = param.name;
  }
}
