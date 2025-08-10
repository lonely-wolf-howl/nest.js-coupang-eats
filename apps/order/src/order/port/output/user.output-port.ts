import { CustomerDomain } from '../../domain/customer.domain';

export interface UserOutputPort {
  getUserById(userId: string): Promise<CustomerDomain>;
}
