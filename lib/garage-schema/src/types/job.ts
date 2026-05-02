import type { Timestamp } from "./timestamp";

export type JobStatus =
  | "pending"          // Created, awaiting confirmation
  | "confirmed"        // Customer confirmed, slot reserved
  | "in_progress"      // Work has started
  | "waiting_parts"    // Waiting for parts to arrive
  | "quality_check"    // Work complete, under QC
  | "completed"        // QC passed, ready for pickup
  | "cancelled";       // Cancelled (reason recorded)

export type JobPriority = "low" | "normal" | "high" | "urgent";

export type PaymentStatus = "unpaid" | "partial" | "paid" | "refunded";

/** A service line item within a job */
export interface JobService {
  /** Reference to a service template (optional) */
  serviceId?: string;
  name: string;
  nameEn?: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  /** quantity × unitPrice */
  total: number;
  /** UID of assigned technician for this specific service */
  technicianId?: string;
  /** Completed flag per line item */
  completed: boolean;
  completedAt?: Timestamp;
}

/** A parts/consumables line item within a job */
export interface JobPart {
  /** Reference to stock_items document (optional) */
  stockItemId?: string;
  name: string;
  nameEn?: string;
  partNumber?: string;
  quantity: number;
  /** Purchase/cost price (internal) */
  unitCost: number;
  /** Selling price to customer */
  unitPrice: number;
  /** quantity × unitPrice */
  total: number;
  /** Whether stock was deducted automatically */
  stockDeducted: boolean;
}

/** Minimal log entry for status history */
export interface JobStatusEvent {
  status: JobStatus;
  changedBy: string;
  changedAt: Timestamp;
  note?: string;
}

/**
 * /tenants/{tenantId}/jobs/{jobId}
 *
 * Central work-order document. References customer and vehicle.
 * Financial totals are always computed fields (Cloud Function or client).
 *
 * Subcollection: /jobs/{jobId}/status_history/{eventId}  →  JobStatusEvent
 */
export interface Job {
  /** Firestore document ID */
  id: string;
  tenantId: string;
  /** Sequential human-readable number, e.g. "JOB-2025-0042" */
  jobNumber: string;
  status: JobStatus;
  priority: JobPriority;

  customerId: string;
  vehicleId: string;

  /** UIDs of technicians assigned to this job */
  assignedTo: string[];
  /** UID of manager who approved/released the job */
  approvedBy?: string;

  /** Odometer reading when vehicle was received */
  mileageInKm?: number;
  /** Odometer reading when vehicle was returned */
  mileageOutKm?: number;

  /** Scheduled appointment start */
  scheduledAt?: Timestamp;
  /** Estimated completion time */
  estimatedCompletionAt?: Timestamp;
  /** When work physically started */
  startedAt?: Timestamp;
  /** When job status moved to "completed" */
  completedAt?: Timestamp;
  /** When vehicle was physically handed back */
  deliveredAt?: Timestamp;

  /** Customer-reported symptoms / request */
  customerNote?: string;
  /** Internal workshop note */
  internalNote?: string;
  /** Cancel reason (required when status = cancelled) */
  cancelReason?: string;

  services: JobService[];
  partsUsed: JobPart[];

  /** ─── Pricing breakdown (THB) ─── */
  laborCost: number;
  partsCost: number;
  /** Flat discount amount */
  discountAmount: number;
  /** Percentage discount (0–100) */
  discountPercent: number;
  /** laborCost + partsCost − discount */
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  /** subtotal + vatAmount */
  totalAmount: number;
  /** Sum of completed payments */
  paidAmount: number;
  paymentStatus: PaymentStatus;

  /** Storage URLs for before/after/damage photos */
  images: string[];
  /** URLs for inspection checklist PDF */
  attachments: string[];

  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/** Status history subcollection document */
export type JobStatusHistory = JobStatusEvent & { id: string };

export type CreateJobPayload = Pick<Job, "customerId" | "vehicleId"> &
  Partial<Omit<Job, "id" | "tenantId" | "jobNumber" | "paymentStatus" | "paidAmount" | "createdBy" | "createdAt" | "updatedAt">>;

export type UpdateJobPayload = Partial<
  Omit<Job, "id" | "tenantId" | "jobNumber" | "customerId" | "vehicleId" | "createdBy" | "createdAt" | "updatedAt">
>;
