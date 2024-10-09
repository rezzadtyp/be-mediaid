export interface IProductArgs {
  name: string;
  qty: number;
}

export interface IOrderArgs {
  products: IProductArgs[];
  paymentMethod: PaymentMethodArgs;
  phoneNumber: string;
}

export enum PaymentMethodArgs {
  QRIS = "QRIS",
  DIGITAL_PAYMENT = "DIGITAL_PAYMENT",
}
