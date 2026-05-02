/**
 * Firestore Dev-Seed Script
 * Populates a tenant with realistic Thai garage data for development / demo.
 *
 * Usage:
 *   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json \
 *   TENANT_ID=demo-garage-01 \
 *   pnpm --filter @workspace/scripts run seed:firestore
 *
 * Requires: firebase-admin installed in scripts package.
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";
import { col } from "../../lib/garage-schema/src/collections";
import { getPermissions } from "../../lib/garage-schema/src/roles";
import type { Tenant } from "../../lib/garage-schema/src/types/tenant";
import type { TenantUser } from "../../lib/garage-schema/src/types/user";
import type { Customer } from "../../lib/garage-schema/src/types/customer";
import type { Vehicle } from "../../lib/garage-schema/src/types/vehicle";
import type { Job } from "../../lib/garage-schema/src/types/job";
import type { Payment } from "../../lib/garage-schema/src/types/payment";
import type { StockItem } from "../../lib/garage-schema/src/types/stock";

// ─── Init ─────────────────────────────────────────────────────────────────────

if (!getApps().length) {
  initializeApp({ credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS!) });
}

const db = getFirestore();
const TENANT_ID = process.env.TENANT_ID ?? "demo-garage-01";
const now = Timestamp.now();

function ts(daysAgo: number = 0): Timestamp {
  return Timestamp.fromDate(new Date(Date.now() - daysAgo * 86_400_000));
}

async function runInBatch(writes: Array<() => void>) {
  const batch = db.batch();
  writes.forEach((fn) => fn());
  // Note: batch.commit() is called by the caller
  return batch;
}

// ─── Tenant ───────────────────────────────────────────────────────────────────

const tenant: Tenant = {
  id: TENANT_ID,
  name: "อู่ออโต้โปร เซอร์วิส",
  nameEn: "AutoPro Service Garage",
  slug: TENANT_ID,
  plan: "pro",
  planExpiresAt: ts(-365),   // expires next year
  status: "active",
  ownerUid: "owner-uid-001",
  contact: {
    phone: "02-123-4567",
    email: "autopro@example.co.th",
    address: "123/45 ถ.พระราม 2",
    district: "จอมทอง",
    province: "กรุงเทพมหานคร",
    postalCode: "10150",
  },
  settings: {
    currency: "THB",
    timezone: "Asia/Bangkok",
    language: "th",
    taxId: "0105555000001",
    vatRate: 0.07,
    vatInclusive: false,
    promptpayEnabled: true,
    promptpayId: "0812345678",
    jobNumberPrefix: "JOB",
    workingHours: { open: "08:00", close: "18:00" },
  },
  metrics: {
    totalJobs: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalVehicles: 0,
    lastUpdatedAt: now,
  },
  createdAt: ts(90),
  updatedAt: now,
};

// ─── Users ────────────────────────────────────────────────────────────────────

const users: Omit<TenantUser, "">[] = [
  {
    uid: "owner-uid-001",
    tenantId: TENANT_ID,
    email: "owner@autopro.co.th",
    displayName: "สมชาย มีสุข",
    phone: "0812345678",
    role: "owner",
    permissions: getPermissions("owner"),
    isActive: true,
    notificationPrefs: { jobAssigned: true, dailySummary: true, lineNotify: true },
    joinedAt: ts(90),
    lastSeenAt: now,
    createdAt: ts(90),
    updatedAt: now,
  },
  {
    uid: "manager-uid-002",
    tenantId: TENANT_ID,
    email: "manager@autopro.co.th",
    displayName: "วิชัย ใจดี",
    phone: "0823456789",
    role: "manager",
    permissions: getPermissions("manager"),
    isActive: true,
    invitedBy: "owner-uid-001",
    invitedAt: ts(85),
    joinedAt: ts(84),
    lastSeenAt: ts(1),
    notificationPrefs: { jobAssigned: true, dailySummary: true, lineNotify: false },
    createdAt: ts(85),
    updatedAt: now,
  },
  {
    uid: "tech-uid-003",
    tenantId: TENANT_ID,
    email: "somkid@autopro.co.th",
    displayName: "สมคิด ช่างเก่ง",
    phone: "0834567890",
    role: "technician",
    permissions: getPermissions("technician"),
    isActive: true,
    invitedBy: "manager-uid-002",
    invitedAt: ts(60),
    joinedAt: ts(59),
    lastSeenAt: ts(0),
    notificationPrefs: { jobAssigned: true, dailySummary: false, lineNotify: true },
    createdAt: ts(60),
    updatedAt: now,
  },
  {
    uid: "recep-uid-004",
    tenantId: TENANT_ID,
    email: "reception@autopro.co.th",
    displayName: "นภา รับงาน",
    phone: "0845678901",
    role: "receptionist",
    permissions: getPermissions("receptionist"),
    isActive: true,
    invitedBy: "manager-uid-002",
    invitedAt: ts(30),
    joinedAt: ts(29),
    lastSeenAt: ts(0),
    notificationPrefs: { jobAssigned: false, dailySummary: false, lineNotify: false },
    createdAt: ts(30),
    updatedAt: now,
  },
];

// ─── Customers ────────────────────────────────────────────────────────────────

const customers: Omit<Customer, "">[] = [
  {
    id: "cust-001",
    tenantId: TENANT_ID,
    name: "ประทีป สิงห์โต",
    phone: "0891234567",
    email: "prateep@example.com",
    type: "individual",
    tags: ["vip"],
    note: "ลูกค้าประจำ — ชอบใช้น้ำมันเครื่อง Mobil 1",
    stats: { totalVisits: 5, totalSpent: 12500, totalVehicles: 2 },
    createdBy: "recep-uid-004",
    createdAt: ts(80),
    updatedAt: ts(5),
  },
  {
    id: "cust-002",
    tenantId: TENANT_ID,
    name: "บริษัท ขนส่งเร็ว จำกัด",
    phone: "021234567",
    email: "fleet@kansang.co.th",
    type: "business",
    companyName: "บริษัท ขนส่งเร็ว จำกัด",
    taxId: "0105565000002",
    tags: ["fleet", "corporate"],
    stats: { totalVisits: 12, totalSpent: 68000, totalVehicles: 5 },
    createdBy: "recep-uid-004",
    createdAt: ts(75),
    updatedAt: ts(2),
  },
  {
    id: "cust-003",
    tenantId: TENANT_ID,
    name: "มาลี สวัสดี",
    phone: "0862345678",
    type: "individual",
    tags: [],
    stats: { totalVisits: 2, totalSpent: 3200, totalVehicles: 1 },
    createdBy: "recep-uid-004",
    createdAt: ts(20),
    updatedAt: ts(10),
  },
];

// ─── Vehicles ─────────────────────────────────────────────────────────────────

const vehicles: Omit<Vehicle, "">[] = [
  {
    id: "veh-001",
    tenantId: TENANT_ID,
    customerId: "cust-001",
    licensePlate: "กข 1234 กรุงเทพมหานคร",
    make: "Toyota",
    model: "Camry",
    year: 2020,
    color: "White",
    fuelType: "gasoline",
    transmission: "automatic",
    currentMileageKm: 65000,
    lastServiceMileageKm: 60000,
    lastServiceAt: ts(30),
    images: [],
    stats: { totalJobs: 4, lastJobId: "job-001", lastJobAt: ts(5) },
    createdBy: "recep-uid-004",
    createdAt: ts(80),
    updatedAt: ts(5),
  },
  {
    id: "veh-002",
    tenantId: TENANT_ID,
    customerId: "cust-002",
    licensePlate: "ขค 5678 นครปฐม",
    make: "Isuzu",
    model: "D-Max",
    year: 2022,
    color: "Gray",
    fuelType: "diesel",
    transmission: "manual",
    currentMileageKm: 45000,
    images: [],
    stats: { totalJobs: 3 },
    createdBy: "recep-uid-004",
    createdAt: ts(70),
    updatedAt: ts(14),
  },
];

// ─── Stock Items ──────────────────────────────────────────────────────────────

const stockItems: Omit<StockItem, "">[] = [
  {
    id: "stock-001",
    tenantId: TENANT_ID,
    name: "น้ำมันเครื่อง Mobil 1 5W-30",
    nameEn: "Mobil 1 5W-30 Engine Oil",
    partNumber: "MB1-5W30-4L",
    sku: "OIL-001",
    category: "น้ำมันเครื่อง",
    brand: "Mobil",
    unit: "ลิตร",
    costPrice: 280,
    sellingPrice: 380,
    quantity: 48,
    minQuantity: 16,
    maxQuantity: 80,
    location: "A1-01",
    isActive: true,
    images: [],
    lastRestockedAt: ts(14),
    lastRestockedQty: 24,
    createdBy: "manager-uid-002",
    createdAt: ts(85),
    updatedAt: ts(14),
  },
  {
    id: "stock-002",
    tenantId: TENANT_ID,
    name: "ไส้กรองน้ำมันเครื่อง Toyota",
    nameEn: "Toyota Oil Filter",
    partNumber: "90915-YZZD3",
    sku: "FLT-TOY-001",
    category: "ไส้กรอง",
    brand: "Toyota Genuine",
    unit: "ชิ้น",
    costPrice: 85,
    sellingPrice: 150,
    quantity: 20,
    minQuantity: 10,
    location: "B2-04",
    isActive: true,
    images: [],
    createdBy: "manager-uid-002",
    createdAt: ts(85),
    updatedAt: ts(20),
  },
  {
    id: "stock-003",
    tenantId: TENANT_ID,
    name: "ผ้าเบรคหน้า Honda Civic",
    nameEn: "Honda Civic Front Brake Pads",
    partNumber: "45022-T7J-H00",
    sku: "BRK-HON-001",
    category: "เบรค",
    brand: "Honda Genuine",
    unit: "ชุด",
    costPrice: 650,
    sellingPrice: 1100,
    quantity: 4,
    minQuantity: 4,
    location: "C1-08",
    isActive: true,
    images: [],
    createdBy: "manager-uid-002",
    createdAt: ts(60),
    updatedAt: ts(3),
  },
];

// ─── Jobs ─────────────────────────────────────────────────────────────────────

const jobs: Omit<Job, "">[] = [
  {
    id: "job-001",
    tenantId: TENANT_ID,
    jobNumber: "JOB-2025-0001",
    status: "completed",
    priority: "normal",
    customerId: "cust-001",
    vehicleId: "veh-001",
    assignedTo: ["tech-uid-003"],
    approvedBy: "manager-uid-002",
    mileageInKm: 65000,
    mileageOutKm: 65010,
    scheduledAt: ts(5),
    startedAt: ts(5),
    completedAt: ts(5),
    deliveredAt: ts(4),
    customerNote: "เปลี่ยนถ่ายน้ำมันเครื่อง + เช็คระยะ",
    internalNote: "ลูกค้าพอใจมาก",
    services: [
      {
        name: "เปลี่ยนถ่ายน้ำมันเครื่อง",
        quantity: 1,
        unitPrice: 200,
        total: 200,
        technicianId: "tech-uid-003",
        completed: true,
        completedAt: ts(5),
      },
    ],
    partsUsed: [
      {
        stockItemId: "stock-001",
        name: "น้ำมันเครื่อง Mobil 1 5W-30",
        quantity: 4,
        unitCost: 280,
        unitPrice: 380,
        total: 1520,
        stockDeducted: true,
      },
      {
        stockItemId: "stock-002",
        name: "ไส้กรองน้ำมันเครื่อง Toyota",
        quantity: 1,
        unitCost: 85,
        unitPrice: 150,
        total: 150,
        stockDeducted: true,
      },
    ],
    laborCost: 200,
    partsCost: 1670,
    discountAmount: 0,
    discountPercent: 0,
    subtotal: 1870,
    vatRate: 0.07,
    vatAmount: 130.9,
    totalAmount: 2000.9,
    paidAmount: 2000.9,
    paymentStatus: "paid",
    images: [],
    attachments: [],
    createdBy: "recep-uid-004",
    createdAt: ts(6),
    updatedAt: ts(4),
  },
  {
    id: "job-002",
    tenantId: TENANT_ID,
    jobNumber: "JOB-2025-0002",
    status: "in_progress",
    priority: "high",
    customerId: "cust-002",
    vehicleId: "veh-002",
    assignedTo: ["tech-uid-003"],
    scheduledAt: ts(0),
    startedAt: ts(0),
    estimatedCompletionAt: ts(-1),
    customerNote: "เสียงดังจากเบรค",
    services: [
      {
        name: "ตรวจสอบและเปลี่ยนผ้าเบรค",
        quantity: 1,
        unitPrice: 300,
        total: 300,
        technicianId: "tech-uid-003",
        completed: false,
      },
    ],
    partsUsed: [],
    laborCost: 300,
    partsCost: 0,
    discountAmount: 0,
    discountPercent: 0,
    subtotal: 300,
    vatRate: 0.07,
    vatAmount: 21,
    totalAmount: 321,
    paidAmount: 0,
    paymentStatus: "unpaid",
    images: [],
    attachments: [],
    createdBy: "recep-uid-004",
    createdAt: ts(1),
    updatedAt: ts(0),
  },
];

// ─── Payments ─────────────────────────────────────────────────────────────────

const payments: Omit<Payment, "">[] = [
  {
    id: "pay-001",
    tenantId: TENANT_ID,
    jobId: "job-001",
    customerId: "cust-001",
    jobNumber: "JOB-2025-0001",
    amount: 2000.9,
    method: "promptpay",
    status: "completed",
    reference: "QR20250428123456",
    note: "จ่ายผ่าน PromptPay",
    collectedBy: "recep-uid-004",
    receivedAt: ts(4),
    createdAt: ts(4),
    updatedAt: ts(4),
  },
];

// ─── Seeder ───────────────────────────────────────────────────────────────────

async function seed() {
  console.log(`\n🌱  Seeding tenant: ${TENANT_ID}\n`);

  const batch = db.batch();

  // Tenant
  batch.set(db.doc(`tenants/${TENANT_ID}`), tenant);
  console.log("  ✔ tenant");

  // Users
  users.forEach((u) => {
    batch.set(db.doc(`${col.users(TENANT_ID)}/${u.uid}`), u);
  });
  console.log(`  ✔ ${users.length} users`);

  // Customers
  customers.forEach((c) => {
    batch.set(db.doc(`${col.customers(TENANT_ID)}/${c.id}`), c);
  });
  console.log(`  ✔ ${customers.length} customers`);

  // Vehicles
  vehicles.forEach((v) => {
    batch.set(db.doc(`${col.vehicles(TENANT_ID)}/${v.id}`), v);
  });
  console.log(`  ✔ ${vehicles.length} vehicles`);

  // Stock
  stockItems.forEach((s) => {
    batch.set(db.doc(`${col.stockItems(TENANT_ID)}/${s.id}`), s);
  });
  console.log(`  ✔ ${stockItems.length} stock items`);

  // Jobs
  jobs.forEach((j) => {
    batch.set(db.doc(`${col.jobs(TENANT_ID)}/${j.id}`), j);
  });
  console.log(`  ✔ ${jobs.length} jobs`);

  // Payments
  payments.forEach((p) => {
    batch.set(db.doc(`${col.payments(TENANT_ID)}/${p.id}`), p);
  });
  console.log(`  ✔ ${payments.length} payments`);

  await batch.commit();

  console.log("\n✅  Seed complete!\n");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
