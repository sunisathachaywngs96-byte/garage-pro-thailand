import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { vehiclesTable, customersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateVehicleBody,
  UpdateVehicleBody,
  GetVehicleParams,
  ListVehiclesQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/vehicles", async (req, res) => {
  const query = ListVehiclesQueryParams.safeParse(req.query);
  const rows = await db
    .select({
      id: vehiclesTable.id,
      customerId: vehiclesTable.customerId,
      customerName: customersTable.name,
      make: vehiclesTable.make,
      model: vehiclesTable.model,
      year: vehiclesTable.year,
      licensePlate: vehiclesTable.licensePlate,
      color: vehiclesTable.color,
      mileage: vehiclesTable.mileage,
    })
    .from(vehiclesTable)
    .leftJoin(customersTable, eq(vehiclesTable.customerId, customersTable.id))
    .where(
      query.success && query.data.customerId
        ? eq(vehiclesTable.customerId, query.data.customerId)
        : undefined
    );
  res.json(
    rows.map((r) => ({
      id: r.id,
      customerId: r.customerId,
      customerName: r.customerName ?? "",
      make: r.make,
      model: r.model,
      year: r.year,
      licensePlate: r.licensePlate,
      color: r.color,
      mileage: r.mileage,
    }))
  );
});

router.post("/vehicles", async (req, res) => {
  const body = CreateVehicleBody.parse(req.body);
  const [vehicle] = await db.insert(vehiclesTable).values(body).returning();
  const [customer] = await db
    .select()
    .from(customersTable)
    .where(eq(customersTable.id, vehicle.customerId));
  res.status(201).json({
    id: vehicle.id,
    customerId: vehicle.customerId,
    customerName: customer?.name ?? "",
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    licensePlate: vehicle.licensePlate,
    color: vehicle.color,
    mileage: vehicle.mileage,
  });
});

router.get("/vehicles/:id", async (req, res) => {
  const { id } = GetVehicleParams.parse({ id: Number(req.params.id) });
  const [row] = await db
    .select({
      id: vehiclesTable.id,
      customerId: vehiclesTable.customerId,
      customerName: customersTable.name,
      make: vehiclesTable.make,
      model: vehiclesTable.model,
      year: vehiclesTable.year,
      licensePlate: vehiclesTable.licensePlate,
      color: vehiclesTable.color,
      mileage: vehiclesTable.mileage,
    })
    .from(vehiclesTable)
    .leftJoin(customersTable, eq(vehiclesTable.customerId, customersTable.id))
    .where(eq(vehiclesTable.id, id));
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json({
    id: row.id,
    customerId: row.customerId,
    customerName: row.customerName ?? "",
    make: row.make,
    model: row.model,
    year: row.year,
    licensePlate: row.licensePlate,
    color: row.color,
    mileage: row.mileage,
  });
});

router.put("/vehicles/:id", async (req, res) => {
  const { id } = GetVehicleParams.parse({ id: Number(req.params.id) });
  const body = UpdateVehicleBody.parse(req.body);
  const [vehicle] = await db
    .update(vehiclesTable)
    .set(body)
    .where(eq(vehiclesTable.id, id))
    .returning();
  if (!vehicle) return res.status(404).json({ error: "Not found" });
  const [customer] = await db
    .select()
    .from(customersTable)
    .where(eq(customersTable.id, vehicle.customerId));
  res.json({
    id: vehicle.id,
    customerId: vehicle.customerId,
    customerName: customer?.name ?? "",
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    licensePlate: vehicle.licensePlate,
    color: vehicle.color,
    mileage: vehicle.mileage,
  });
});

export default router;
