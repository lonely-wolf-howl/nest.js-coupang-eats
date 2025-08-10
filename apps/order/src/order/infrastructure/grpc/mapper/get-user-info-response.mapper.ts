import { UserMicroservice } from '@app/common';
import { CustomerDomain } from '../../../domain/customer.domain';

export class GetUserInfoResponseMapper {
  constructor(
    private readonly response: UserMicroservice.GetUserInfoResponse,
  ) {}

  toDomain() {
    return new CustomerDomain({
      userId: this.response.id,
      email: this.response.email,
      name: this.response.name,
    });
  }
}
