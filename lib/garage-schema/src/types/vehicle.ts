import type { Timestamp } from "./timestamp";

export type FuelType = "gasoline" | "diesel" | "hybrid" | "electric" | "lpg" | "ngv";
export type TransmissionType = "manual" | "automatic" | "cvt" | "dual_clutch";

export interface ServiceInterval {
  /** Mileage interval in km */
  mileageKm?: number;
  /** Time interval in days */
  days?: number;
  /** Next service due date */
  nextDueAt?: Timestamp;
  /** Next service due mileage */
  nextDueMileageKm?: number;
}

/**
 * /tenants/{tenantId}/vehicles/{vehicleId}
 *
 * A single vehicle belonging to a customer.
 * One customer may own multiple vehicles.
 */
export interface Vehicle {
  /** Firestore document ID */
  id: string;
  tenantId: string;
  customerId: string;
  /** Thai license plate, e.g. "กข 1234 กรุงเทพมหานคร" */
  licensePlate: string;
  /** Province of registration */
  registrationProvince?: string;
  make: string;
  model: string;
  /** Sub-model / trim, e.g. "2.0 G" */
  subModel?: string;
  year: number;
  color?: string;
  /** Vehicle Identification Number */
  vin?: string;
  /** Engine displacement string, e.g. "2000cc" */
  engineSize?: string;
  fuelType?: FuelType;
  transmission?: TransmissionType;
  /** Current odometer reading in km */
  currentMileageKm?: number;
  /** Odometer at last service */
  lastServiceMileageKm?: number;
  lastServiceAt?: Timestamp;
  /** Oil change interval settings */
  oilChangeInterval?: ServiceInterval;
  /** Thailand annual vehicle tax expiry */
  taxExpiryAt?: Timestamp;
  /** Vehicle insurance expiry */
  insuranceExpiryAt?: Timestamp;
  /** URLs to stored images (front, rear, etc.) */
  images: string[];
  /** Internal technician note */
  note?: string;
  /** Denormalised job counter */
  stats: {
    totalJobs: number;
    lastJobId?: string;
    lastJobAt?: Timestamp;
  };
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreateVehiclePayload = Pick<Vehicle, "customerId" | "licensePlate" | "make" | "model" | "year"> &
  Partial<Omit<Vehicle, "id" | "tenantId" | "stats" | "createdBy" | "createdAt" | "updatedAt">>;

export type UpdateVehiclePayload = Partial<
  Omit<Vehicle, "id" | "tenantId" | "customerId" | "stats" | "createdBy" | "createdAt" | "updatedAt">
>;
