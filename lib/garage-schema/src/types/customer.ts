import type { Timestamp } from "./timestamp";

/**
 * /tenants/{tenantId}/customers/{customerId}
 *
 * A garage customer (individual or business).
 * Vehicles reference this document via customerId.
 */
export interface Customer {
  /** Firestore document ID */
  id: string;
  tenantId: string;
  /** Full Thai name or company name */
  name: string;
  /** English / romanised name */
  nameEn?: string;
  /** Primary mobile number (Thai format: 08x-xxx-xxxx) */
  phone: string;
  phoneAlt?: string;
  email?: string;
  /** LINE ID for messaging */
  lineId?: string;
  /** Customer type */
  type: "individual" | "business";
  /** Company/business name if type=business */
  companyName?: string;
  /** Thai Tax ID if business */
  taxId?: string;
  address?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  /** Internal tags, e.g. ["vip", "fleet"] */
  tags: string[];
  /** Free-form internal note */
  note?: string;
  /** Denormalised counters — updated by Cloud Function */
  stats: {
    totalVisits: number;
    totalSpent: number;
    totalVehicles: number;
    lastVisitAt?: Timestamp;
    lastJobId?: string;
  };
  /** Source of lead */
  source?: "walk_in" | "referral" | "line" | "facebook" | "google" | "other";
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreateCustomerPayload = Pick<Customer, "name" | "phone" | "type"> &
  Partial<Omit<Customer, "id" | "tenantId" | "stats" | "createdBy" | "createdAt" | "updatedAt">>;

export type UpdateCustomerPayload = Partial<
  Omit<Customer, "id" | "tenantId" | "stats" | "createdBy" | "createdAt" | "updatedAt">
>;
