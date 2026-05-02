import type { Timestamp } from "./timestamp";

export type TenantPlan = "trial" | "basic" | "pro" | "enterprise";
export type TenantStatus = "active" | "suspended" | "cancelled";

export interface TenantContact {
  phone: string;
  phoneAlt?: string;
  email: string;
  address: string;
  district?: string;
  province?: string;
  postalCode?: string;
  lat?: number;
  lng?: number;
}

export interface TenantSettings {
  /** ISO 4217 currency code */
  currency: "THB" | "USD";
  /** IANA timezone, default "Asia/Bangkok" */
  timezone: string;
  /** UI default language */
  language: "th" | "en";
  /** Thailand tax ID (เลขประจำตัวผู้เสียภาษี) */
  taxId?: string;
  /** VAT rate fraction, e.g. 0.07 */
  vatRate: number;
  /** Include VAT in displayed prices */
  vatInclusive: boolean;
  /** Enable PromptPay QR payment */
  promptpayEnabled: boolean;
  promptpayId?: string;
  /** Daily job number prefix, e.g. "JOB" → "JOB-2025-0001" */
  jobNumberPrefix: string;
  /** Hours open per weekday, used for scheduling */
  workingHours: { open: string; close: string };
  /** Line OA channel access token for notifications */
  lineChannelToken?: string;
}

export interface TenantMetrics {
  totalJobs: number;
  totalRevenue: number;
  totalCustomers: number;
  totalVehicles: number;
  /** Updated by Cloud Function on job completion */
  lastUpdatedAt: Timestamp;
}

/**
 * /tenants/{tenantId}
 *
 * Top-level document representing a garage business (tenant).
 * Created automatically when an owner signs up.
 */
export interface Tenant {
  /** Firestore document ID == tenantId */
  id: string;
  /** Thai garage name */
  name: string;
  /** English / romanised name (optional) */
  nameEn?: string;
  /** URL-safe slug, globally unique */
  slug: string;
  plan: TenantPlan;
  planExpiresAt: Timestamp;
  status: TenantStatus;
  /** Firebase Auth UID of the owner */
  ownerUid: string;
  contact: TenantContact;
  settings: TenantSettings;
  metrics: TenantMetrics;
  /** Stripe / Omise subscription ID */
  subscriptionId?: string;
  /** Storage path to garage logo */
  logoUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** Payload for creating a new tenant (omit server-set fields) */
export type CreateTenantPayload = Pick<Tenant, "name" | "slug" | "contact"> &
  Partial<Pick<Tenant, "nameEn" | "settings" | "logoUrl">>;

/** Fields an owner/manager can update */
export type UpdateTenantPayload = Partial<
  Pick<Tenant, "name" | "nameEn" | "contact" | "settings" | "logoUrl">
>;
