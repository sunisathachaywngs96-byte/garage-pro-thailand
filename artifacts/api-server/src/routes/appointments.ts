import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { appointmentsTable, customersTable, vehiclesTable, servicesTable, techniciansTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import {
  CreateAppointmentBody,
  UpdateAppointmentBody,
  GetAppointmentParams,
  DeleteAppointmentParams,
  ListAppointmentsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

const joinedSelect = {
  id: appointmentsTable.id,
  customerId: appointmentsTable.customerId,
  customerName: customersTable.name,
  vehicleId: appointmentsTable.vehicleId,
  vehicleMake: vehiclesTable.make,
  vehicleModel: vehiclesTable.model,
  vehicleYear: vehiclesTable.year,
  serviceId: appointmentsTable.serviceId,
  serviceName: servicesTable.name,
  technicianId: appointmentsTable.technicianId,
  technicianName: techniciansTable.name,
  scheduledAt: appointmentsTable.scheduledAt,
  status: appointmentsTable.status,
  notes: appointmentsTable.notes,
  totalCost: appointmentsTable.totalCost,
};

function formatAppointment(r: typeof joinedSelect extends Record<string, unknown> ? any : never) {
  return {
    id: r.id,
    customerId: r.customerId,
    customerName: r.customerName ?? "",
    vehicleId: r.vehicleId,
    vehicleDescription: `${r.vehicleYear} ${r.vehicleMake} ${r.vehicleModel}`,
    serviceId: r.serviceId,
    serviceName: r.serviceName ?? "",
    technicianId: r.technicianId,
    technicianName: r.technicianName ?? "",
    scheduledAt: r.scheduledAt instanceof Date ? r.scheduledAt.toISOString() : r.scheduledAt,
    status: r.status,
    notes: r.notes ?? undefined,
    totalCost: Number(r.totalCost),
  };
}

function baseQuery() {
  return db
    .select(joinedSelect)
    .from(appointmentsTable)
    .leftJoin(customersTable, eq(appointmentsTable.customerId, customersTable.id))
    .leftJoin(vehiclesTable, eq(appointmentsTable.vehicleId, vehiclesTable.id))
    .leftJoin(servicesTable, eq(appointmentsTable.serviceId, servicesTable.id))
    .leftJoin(techniciansTable, eq(appointmentsTable.technicianId, techniciansTable.id));
}

router.get("/appointments", async (req, res) => {
  const query = ListAppointmentsQueryParams.safeParse(req.query);
  const filters = [];
  if (query.success) {
    if (query.data.status) filters.push(eq(appointmentsTable.status, query.data.status));
    if (query.data.technicianId) filters.push(eq(appointmentsTable.technicianId, query.data.technicianId));
    if (query.data.date) {
      filters.push(sql`DATE(${appointmentsTable.scheduledAt}) = ${query.data.date}`);
    }
  }
  const rows = await baseQuery().where(filters.length ? and(...filters) : undefined);
  res.json(rows.map(formatAppointment));
});

router.post("/appointments", async (req, res) => {
  const body = CreateAppointmentBody.parse(req.body);
  const [service] = await db.select().from(servicesTable).where(eq(servicesTable.id, body.serviceId));
  const totalCost = service ? service.price : "0";
  const [appointment] = await db
    .insert(appointmentsTable)
    .values({
      customerId: body.customerId,
      vehicleId: body.vehicleId,
      serviceId: body.serviceId,
      technicianId: body.technicianId,
      scheduledAt: new Date(body.scheduledAt),
      notes: body.notes,
      totalCost: totalCost,
      status: "scheduled",
    })
    .returning();
  const rows = await baseQuery().where(eq(appointmentsTable.id, appointment.id));
  res.status(201).json(formatAppointment(rows[0]));
});

router.get("/appointments/:id", async (req, res) => {
  const { id } = GetAppointmentParams.parse({ id: Number(req.params.id) });
  const rows = await baseQuery().where(eq(appointmentsTable.id, id));
  if (!rows.length) return res.status(404).json({ error: "Not found" });
  res.json(formatAppointment(rows[0]));
});

router.put("/appointments/:id", async (req, res) => {
  const { id } = GetAppointmentParams.parse({ id: Number(req.params.id) });
  const body = UpdateAppointmentBody.parse(req.body);
  const updateData: Record<string, unknown> = { status: body.status };
  if (body.technicianId !== undefined) updateData.technicianId = body.technicianId;
  if (body.scheduledAt !== undefined) updateData.scheduledAt = new Date(body.scheduledAt);
  if (body.notes !== undefined) updateData.notes = body.notes;
  await db.update(appointmentsTable).set(updateData).where(eq(appointmentsTable.id, id));
  const rows = await baseQuery().where(eq(appointmentsTable.id, id));
  if (!rows.length) return res.status(404).json({ error: "Not found" });
  res.json(formatAppointment(rows[0]));
});

router.delete("/appointments/:id", async (req, res) => {
  const { id } = DeleteAppointmentParams.parse({ id: Number(req.params.id) });
  await db.delete(appointmentsTable).where(eq(appointmentsTable.id, id));
  res.status(204).send();
});

export default router;
