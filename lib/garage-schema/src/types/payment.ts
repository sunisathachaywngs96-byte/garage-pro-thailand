import type { Timestamp } from "./timestamp";

export type PaymentMethod =
  | "cash"
  | "promptpay"     // Thai PromptPay QR
  | "bank_transfer" // Manual bank transfer
  | "credit_card"
  | "debit_card"
  | "cheque"
  | "other";

export type PaymentStatusValue = "pending" | "completed" | "failed" | "refunded";

/**
 * /tenants/{tenantId}/payments/{paymentId}
 *
 * A payment record linked to a job.
 * A job may have multiple payments (deposit + final, instalments).
 * When all payments sum to job.totalAmount, a Cloud Function sets
 * job.paymentStatus = "paid".
 */
export interface Payment {
  /** Firestore document ID */
  id: string;
  tenantId: string;
  jobId: string;
  /** Denormalised for quick display */
  customerId: string;
  jobNumber: string;

  amount: number;
  method: PaymentMethod;
  status: PaymentStatusValue;

  /** Bank reference / PromptPay transaction ID */
  reference?: string;
  /** Storage URL for payment slip image */
  slipUrl?: string;

  /** Omise / Stripe charge ID (if card payment) */
  gatewayChargeId?: string;
  /** Gateway name used */
  gateway?: "omise" | "stripe" | "gbprimepay";

  /** For refunds: reason and original paymentId */
  refundReason?: string;
  refundedPaymentId?: string;

  note?: string;

  /** UID of staff who collected / recorded the payment */
  collectedBy: string;
  /** When the payment was received (may differ from createdAt) */
  receivedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreatePaymentPayload = Pick<Payment, "jobId" | "amount" | "method" | "receivedAt"> &
  Partial<Omit<Payment, "id" | "tenantId" | "customerId" | "jobNumber" | "collectedBy" | "createdAt" | "updatedAt">>;

export type UpdatePaymentPayload = Partial<
  Pick<Payment, "status" | "reference" | "slipUrl" | "note" | "gatewayChargeId" | "refundReason">
>;
