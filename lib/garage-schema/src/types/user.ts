import type { Timestamp } from "./timestamp";

/**
 * Roles available within a tenant.
 * Stored in the user document AND in Firebase Auth custom claims
 * so Firestore security rules can read them without a document lookup.
 *
 * Hierarchy (descending privilege):
 *   owner > manager > receptionist > technician > viewer
 */
export type UserRole =
  | "owner"       // Full access, billing, can delete tenant
  | "manager"     // Full operational access, cannot manage billing
  | "receptionist"// Create/update customers, vehicles, jobs; create payments
  | "technician"  // View + update assigned jobs only
  | "viewer";     // Read-only access to all tenant data

/**
 * Fine-grained permission identifiers used in business logic.
 * Security rules enforce role-based access; permissions refine UI behaviour.
 */
export type Permission =
  | "tenant:read"   | "tenant:update"   | "tenant:delete"
  | "users:read"    | "users:invite"    | "users:update"   | "users:remove"
  | "customers:read"| "customers:create"| "customers:update"| "customers:delete"
  | "vehicles:read" | "vehicles:create" | "vehicles:update" | "vehicles:delete"
  | "jobs:read"     | "jobs:create"     | "jobs:update"     | "jobs:delete"     | "jobs:approve"
  | "payments:read" | "payments:create" | "payments:update" | "payments:delete"
  | "stock:read"    | "stock:create"    | "stock:update"    | "stock:delete"
  | "reports:read";

export interface UserNotificationPrefs {
  /** Receive push when a job is assigned to them */
  jobAssigned: boolean;
  /** Receive daily summary */
  dailySummary: boolean;
  /** Line notify (uses tenant Line OA) */
  lineNotify: boolean;
}

/**
 * /tenants/{tenantId}/users/{uid}
 *
 * Document ID == Firebase Auth UID so rules can match
 * request.auth.uid == userId cheaply.
 *
 * Custom claims on the Auth token (set by Cloud Function):
 *   { tenantId: string; role: UserRole }
 */
export interface TenantUser {
  /** Firebase Auth UID (= document ID) */
  uid: string;
  tenantId: string;
  email: string;
  displayName: string;
  phone?: string;
  photoURL?: string;
  role: UserRole;
  /** Derived from role; stored for quick checks in app code */
  permissions: Permission[];
  isActive: boolean;
  /** UID of the user who sent the invite */
  invitedBy?: string;
  invitedAt?: Timestamp;
  /** Set by Cloud Function when user accepts invite */
  joinedAt?: Timestamp;
  lastSeenAt?: Timestamp;
  notificationPrefs: UserNotificationPrefs;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type InviteUserPayload = Pick<TenantUser, "email" | "role"> &
  Partial<Pick<TenantUser, "displayName" | "phone">>;

export type UpdateUserPayload = Partial<
  Pick<TenantUser, "displayName" | "phone" | "role" | "isActive" | "notificationPrefs">
>;
