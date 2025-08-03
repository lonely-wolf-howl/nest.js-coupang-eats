import { IsNotEmpty, IsString } from 'class-validator';

export class SendPaymentNotificationDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  to: string;
}
