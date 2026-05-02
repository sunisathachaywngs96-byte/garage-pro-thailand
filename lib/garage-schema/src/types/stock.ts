import type { Timestamp } from "./timestamp";

export type StockMovementType =
  | "purchase"    // Received from supplier
  | "adjustment"  // Manual stock correction
  | "job_use"     // Consumed in a job
  | "return"      // Returned to supplier
  | "transfer"    // Between locations (future)
  | "damage"      // Written off as damaged
  | "opening";    // Initial opening stock

/**
 * /tenants/{tenantId}/stock_items/{itemId}
 *
 * Spare part / consumable / product in the garage inventory.
 *
 * Subcollection: /stock_items/{itemId}/movements/{movementId}  →  StockMovement
 */
export interface StockItem {
  /** Firestore document ID */
  id: string;
  tenantId: string;
  /** Thai part/item name */
  name: string;
  nameEn?: string;
  /** OEM / aftermarket part number */
  partNumber?: string;
  /** Internal SKU */
  sku?: string;
  category: string;
  brand?: string;
  /** e.g. "ชิ้น", "ลิตร", "กิโลกรัม", "เมตร" */
  unit: string;

  /** Purchase / cost price (THB) */
  costPrice: number;
  /** Default selling price to customer (THB) */
  sellingPrice: number;

  /** Current on-hand quantity */
  quantity: number;
  /** Minimum quantity before reorder alert fires */
  minQuantity: number;
  /** Maximum quantity (for over-stock alert) */
  maxQuantity?: number;

  /** Physical storage location, e.g. "A3-12" */
  location?: string;

  supplierId?: string;
  supplierName?: string;
  supplierPartNumber?: string;

  isActive: boolean;
  /** Storage URLs for product images */
  images: string[];
  note?: string;

  lastRestockedAt?: Timestamp;
  lastRestockedQty?: number;

  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * /tenants/{tenantId}/stock_items/{itemId}/movements/{movementId}
 *
 * Immutable audit trail for every stock quantity change.
 */
export interface StockMovement {
  id: string;
  tenantId: string;
  stockItemId: string;
  type: StockMovementType;
  /** Positive = in, Negative = out */
  delta: number;
  /** Quantity after this movement */
  quantityAfter: number;
  /** Reference document, e.g. jobId or purchase order number */
  referenceId?: string;
  referenceType?: "job" | "purchase_order" | "adjustment" | "opening";
  note?: string;
  performedBy: string;
  performedAt: Timestamp;
}

export type CreateStockItemPayload = Pick<StockItem, "name" | "unit" | "costPrice" | "sellingPrice" | "quantity" | "minQuantity"> &
  Partial<Omit<StockItem, "id" | "tenantId" | "createdBy" | "createdAt" | "updatedAt">>;

export type UpdateStockItemPayload = Partial<
  Omit<StockItem, "id" | "tenantId" | "quantity" | "createdBy" | "createdAt" | "updatedAt">
>;
