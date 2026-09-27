export interface Address {
  readonly id: string;
  readonly recipientName: string;
  readonly line1: string;
  readonly line2?: string;
  readonly city: string;
  readonly state: string;
  readonly postalCode: string;
  readonly country: string;
  readonly phone?: string;
  readonly isDefault?: boolean;
}
