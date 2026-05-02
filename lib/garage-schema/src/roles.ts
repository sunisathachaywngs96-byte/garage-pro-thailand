import type { UserRole, Permission } from "./types/user";

/**
 * Permission matrix — maps every role to its allowed permissions.
 * This is the single source of truth used by:
 *   1. Cloud Function `onUserWrite` to derive `permissions[]` stored on the user doc
 *   2. Frontend `usePermission()` hook for conditional rendering
 *   3. Backend middleware for server-side enforcement
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  owner: [
    // Tenant
    "tenant:read", "tenant:update", "tenant:delete",
    // Users
    "users:read", "users:invite", "users:update", "users:remove",
    // Customers
    "customers:read", "customers:create", "customers:update", "customers:delete",
    // Vehicles
    "vehicles:read", "vehicles:create", "vehicles:update", "vehicles:delete",
    // Jobs
    "jobs:read", "jobs:create", "jobs:update", "jobs:delete", "jobs:approve",
    // Payments
    "payments:read", "payments:create", "payments:update", "payments:delete",
    // Stock
    "stock:read", "stock:create", "stock:update", "stock:delete",
    // Reports
    "reports:read",
  ],
  manager: [
    "tenant:read", "tenant:update",
    "users:read", "users:invite", "users:update",
    "customers:read", "customers:create", "customers:update", "customers:delete",
    "vehicles:read", "vehicles:create", "vehicles:update", "vehicles:delete",
    "jobs:read", "jobs:create", "jobs:update", "jobs:delete", "jobs:approve",
    "payments:read", "payments:create", "payments:update",
    "stock:read", "stock:create", "stock:update", "stock:delete",
    "reports:read",
  ],
  receptionist: [
    "tenant:read",
    "users:read",
    "customers:read", "customers:create", "customers:update",
    "vehicles:read", "vehicles:create", "vehicles:update",
    "jobs:read", "jobs:create", "jobs:update",
    "payments:read", "payments:create",
    "stock:read",
  ],
  technician: [
    "tenant:read",
    "customers:read",
    "vehicles:read",
    "jobs:read", "jobs:update",   // update = update assigned job status/notes only
    "stock:read",
  ],
  viewer: [
    "tenant:read",
    "customers:read",
    "vehicles:read",
    "jobs:read",
    "payments:read",
    "stock:read",
    "reports:read",
  ],
};

/** Helper: derive permissions array for a given role */
export function getPermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

/** Helper: check if a role has a specific permission */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Role hierarchy rank — higher = more privileged.
 * Useful for "at least manager" checks: getRoleRank(role) >= getRoleRank("manager")
 */
export const ROLE_RANK: Record<UserRole, number> = {
  viewer: 0,
  technician: 1,
  receptionist: 2,
  manager: 3,
  owner: 4,
};

export function getRoleRank(role: UserRole): number {
  return ROLE_RANK[role] ?? -1;
}

export function isAtLeast(role: UserRole, minimum: UserRole): boolean {
  return getRoleRank(role) >= getRoleRank(minimum);
}

/** Human-readable role labels in Thai and English */
export const ROLE_LABELS: Record<UserRole, { th: string; en: string }> = {
  owner:        { th: "เจ้าของ",        en: "Owner" },
  manager:      { th: "ผู้จัดการ",       en: "Manager" },
  receptionist: { th: "พนักงานต้อนรับ",  en: "Receptionist" },
  technician:   { th: "ช่างเทคนิค",      en: "Technician" },
  viewer:       { th: "ผู้ดูเท่านั้น",   en: "Viewer" },
};
