// ─── Types ───────────────────────────────────────────────────────────────────
export type { Tenant, TenantContact, TenantSettings, TenantMetrics, TenantPlan, TenantStatus, CreateTenantPayload, UpdateTenantPayload } from "./types/tenant";
export type { TenantUser, UserRole, Permission, UserNotificationPrefs, InviteUserPayload, UpdateUserPayload } from "./types/user";
export type { Customer, CreateCustomerPayload, UpdateCustomerPayload } from "./types/customer";
export type { Vehicle, FuelType, TransmissionType, ServiceInterval, CreateVehiclePayload, UpdateVehiclePayload } from "./types/vehicle";
export type { Job, JobService, JobPart, JobStatus, JobPriority, PaymentStatus, JobStatusEvent, JobStatusHistory, CreateJobPayload, UpdateJobPayload } from "./types/job";
export type { Payment, PaymentMethod, PaymentStatusValue, CreatePaymentPayload, UpdatePaymentPayload } from "./types/payment";
export type { StockItem, StockMovement, StockMovementType, CreateStockItemPayload, UpdateStockItemPayload } from "./types/stock";

// ─── Roles & Permissions ─────────────────────────────────────────────────────
export { ROLE_PERMISSIONS, ROLE_RANK, ROLE_LABELS, getPermissions, hasPermission, getRoleRank, isAtLeast } from "./roles";

// ─── Collection Paths ────────────────────────────────────────────────────────
export { col, docPath, JOB_DEFAULT_ORDER_FIELD, PAGE_SIZE, NO_TENANT } from "./collections";
