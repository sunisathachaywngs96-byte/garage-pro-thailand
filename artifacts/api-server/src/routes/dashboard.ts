import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { appointmentsTable, customersTable, vehiclesTable, servicesTable, techniciansTable } from "@workspace/db";
import { eq, sql, count, sum } from "drizzle-orm";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res) => {
  const today = new Date().toISOString().split("T")[0];

  const [todayRow] = await db
    .select({ count: count() })
    .from(appointmentsTable)
    .where(sql`DATE(${appointmentsTable.scheduledAt}) = ${today}`);

  const [inProgressRow] = await db
    .select({ count: count() })
    .from(appointmentsTable)
    .where(eq(appointmentsTable.status, "in_progress"));

  const [completedTodayRow] = await db
    .select({ count: count() })
    .from(appointmentsTable)
    .where(
      sql`${appointmentsTable.status} = 'completed' AND DATE(${appointmentsTable.scheduledAt}) = ${today}`
    );

  const [customersRow] = await db.select({ count: count() }).from(customersTable);
  const [vehiclesRow] = await db.select({ count: count() }).from(vehiclesTable);

  const firstOfMonth = new Date();
  firstOfMonth.setDate(1);
  firstOfMonth.setHours(0, 0, 0, 0);

  const [revenueRow] = await db
    .select({ total: sum(appointmentsTable.totalCost) })
    .from(appointmentsTable)
    .where(
      sql`${appointmentsTable.status} = 'completed' AND ${appointmentsTable.scheduledAt} >= ${firstOfMonth.toISOString()}`
    );

  const [availableTechRow] = await db
    .select({ count: count() })
    .from(techniciansTable)
    .where(eq(techniciansTable.isAvailable, true));

  res.json({
    todayAppointments: todayRow?.count ?? 0,
    inProgressCount: inProgressRow?.count ?? 0,
    completedToday: completedTodayRow?.count ?? 0,
    totalCustomers: customersRow?.count ?? 0,
    totalVehicles: vehiclesRow?.count ?? 0,
    monthlyRevenue: Number(revenueRow?.total ?? 0),
    availableTechnicians: availableTechRow?.count ?? 0,
  });
});

router.get("/dashboard/recent-activity", async (_req, res) => {
  const rows = await db
    .select({
      id: appointmentsTable.id,
      customerName: customersTable.name,
      status: appointmentsTable.status,
      serviceName: servicesTable.name,
      createdAt: appointmentsTable.createdAt,
    })
    .from(appointmentsTable)
    .leftJoin(customersTable, eq(appointmentsTable.customerId, customersTable.id))
    .leftJoin(servicesTable, eq(appointmentsTable.serviceId, servicesTable.id))
    .orderBy(sql`${appointmentsTable.createdAt} DESC`)
    .limit(10);

  res.json(
    rows.map((r, i) => ({
      id: r.id * 100 + i,
      type: "appointment_created",
      description: `${r.customerName ?? "Unknown"} booked ${r.serviceName ?? "service"} — ${r.status}`,
      timestamp: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
      customerName: r.customerName ?? "Unknown",
    }))
  );
});

router.get("/dashboard/service-breakdown", async (_req, res) => {
  const rows = await db
    .select({
      serviceName: servicesTable.name,
      count: count(),
      revenue: sum(appointmentsTable.totalCost),
    })
    .from(appointmentsTable)
    .leftJoin(servicesTable, eq(appointmentsTable.serviceId, servicesTable.id))
    .groupBy(servicesTable.name);

  res.json(
    rows.map((r) => ({
      serviceName: r.serviceName ?? "Unknown",
      count: r.count,
      revenue: Number(r.revenue ?? 0),
    }))
  );
});

router.get("/dashboard/revenue-by-month", async (_req, res) => {
  const rows = await db
    .select({
      month: sql<string>`TO_CHAR(${appointmentsTable.scheduledAt}, 'YYYY-MM')`,
      revenue: sum(appointmentsTable.totalCost),
      appointmentCount: count(),
    })
    .from(appointmentsTable)
    .where(
      sql`${appointmentsTable.scheduledAt} >= NOW() - INTERVAL '6 months' AND ${appointmentsTable.status} = 'completed'`
    )
    .groupBy(sql`TO_CHAR(${appointmentsTable.scheduledAt}, 'YYYY-MM')`)
    .orderBy(sql`TO_CHAR(${appointmentsTable.scheduledAt}, 'YYYY-MM')`);

  res.json(
    rows.map((r) => ({
      month: r.month,
      revenue: Number(r.revenue ?? 0),
      appointmentCount: r.appointmentCount,
    }))
  );
});

export default router;
