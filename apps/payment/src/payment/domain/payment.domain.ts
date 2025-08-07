import { NotificationStatus, PaymentMethod, PaymentStatus } from './payment.vo';

export class PaymentModel {
  id: string;
  orderId: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  cardNumber: string;
  expiryYear: string;
  expiryMonth: string;
  birthOrRegistration: string;
  passwordTwoDigits: string;
  notificationStatus: NotificationStatus;
  amount: number;
  userEmail: string;

  constructor(param: {
    orderId: string;
    paymentMethod: PaymentMethod;
    cardNumber: string;
    expiryYear: string;
    expiryMonth: string;
    birthOrRegistration: string;
    passwordTwoDigits: string;
    amount: number;
    userEmail: string;
  }) {
    this.paymentStatus = PaymentStatus.pending;
    this.notificationStatus = NotificationStatus.pending;

    this.orderId = param.orderId;
    this.paymentMethod = param.paymentMethod;
    this.cardNumber = param.cardNumber;
    this.expiryYear = param.expiryYear;
    this.expiryMonth = param.expiryMonth;
    this.birthOrRegistration = param.birthOrRegistration;
    this.passwordTwoDigits = param.passwordTwoDigits;
    this.amount = param.amount;
    this.userEmail = param.userEmail;
  }

  assignId(id: string) {
    this.id = id;
  }

  processPayment() {
    if (!this.id) {
      throw new Error('');
    }
    this.paymentStatus = PaymentStatus.approved;
  }

  rejectPayment() {
    if (!this.id) {
      throw new Error('');
    }
    this.paymentStatus = PaymentStatus.rejected;
  }

  sendNotification() {
    this.notificationStatus = NotificationStatus.sent;
  }
}
