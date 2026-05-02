/**
 * Type-safe Firestore collection / document path helpers.
 *
 * Usage (with firebase/firestore):
 *   import { collection, doc } from "firebase/firestore";
 *   import { col, docPath } from "@workspace/garage-schema";
 *
 *   const tenantsRef   = collection(db, col.tenants());
 *   const tenantRef    = doc(db, docPath.tenant(tenantId));
 *   const usersRef     = collection(db, col.users(tenantId));
 *   const jobsRef      = collection(db, col.jobs(tenantId));
 */

// ─── Collection paths ────────────────────────────────────────────────────────

export const col = {
  /** /tenants */
  tenants: () => "tenants" as const,

  /** /tenants/{tenantId}/users */
  users: (tenantId: string) => `tenants/${tenantId}/users` as const,

  /** /tenants/{tenantId}/customers */
  customers: (tenantId: string) => `tenants/${tenantId}/customers` as const,

  /** /tenants/{tenantId}/vehicles */
  vehicles: (tenantId: string) => `tenants/${tenantId}/vehicles` as const,

  /** /tenants/{tenantId}/jobs */
  jobs: (tenantId: string) => `tenants/${tenantId}/jobs` as const,

  /** /tenants/{tenantId}/jobs/{jobId}/status_history */
  jobStatusHistory: (tenantId: string, jobId: string) =>
    `tenants/${tenantId}/jobs/${jobId}/status_history` as const,

  /** /tenants/{tenantId}/payments */
  payments: (tenantId: string) => `tenants/${tenantId}/payments` as const,

  /** /tenants/{tenantId}/stock_items */
  stockItems: (tenantId: string) => `tenants/${tenantId}/stock_items` as const,

  /** /tenants/{tenantId}/stock_items/{itemId}/movements */
  stockMovements: (tenantId: string, itemId: string) =>
    `tenants/${tenantId}/stock_items/${itemId}/movements` as const,
} as const;

// ─── Document paths ───────────────────────────────────────────────────────────

export const docPath = {
  tenant:      (tenantId: string) => `tenants/${tenantId}`,
  user:        (tenantId: string, uid: string) => `tenants/${tenantId}/users/${uid}`,
  customer:    (tenantId: string, id: string) => `tenants/${tenantId}/customers/${id}`,
  vehicle:     (tenantId: string, id: string) => `tenants/${tenantId}/vehicles/${id}`,
  job:         (tenantId: string, id: string) => `tenants/${tenantId}/jobs/${id}`,
  jobStatus:   (tenantId: string, jobId: string, eventId: string) =>
                 `tenants/${tenantId}/jobs/${jobId}/status_history/${eventId}`,
  payment:     (tenantId: string, id: string) => `tenants/${tenantId}/payments/${id}`,
  stockItem:   (tenantId: string, id: string) => `tenants/${tenantId}/stock_items/${id}`,
  stockMove:   (tenantId: string, itemId: string, moveId: string) =>
                 `tenants/${tenantId}/stock_items/${itemId}/movements/${moveId}`,
} as const;

// ─── Useful query constants ───────────────────────────────────────────────────

/** Default field to sort jobs by when listing */
export const JOB_DEFAULT_ORDER_FIELD = "scheduledAt" as const;

/** Maximum items per page for pagination */
export const PAGE_SIZE = 20;

/** Sentinel for "no tenant" (unauthenticated context) */
export const NO_TENANT = "" as const;
