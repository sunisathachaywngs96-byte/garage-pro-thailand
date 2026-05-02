import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { servicesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateServiceBody,
  UpdateServiceBody,
  UpdateServiceParams,
  DeleteServiceParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/services", async (_req, res) => {
  const services = await db.select().from(servicesTable);
  res.json(
    services.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      price: Number(s.price),
      estimatedDurationMinutes: s.estimatedDurationMinutes,
    }))
  );
});

router.post("/services", async (req, res) => {
  const body = CreateServiceBody.parse(req.body);
  const [service] = await db
    .insert(servicesTable)
    .values({ ...body, price: String(body.price) })
    .returning();
  res.status(201).json({
    id: service.id,
    name: service.name,
    description: service.description,
    price: Number(service.price),
    estimatedDurationMinutes: service.estimatedDurationMinutes,
  });
});

router.put("/services/:id", async (req, res) => {
  const { id } = UpdateServiceParams.parse({ id: Number(req.params.id) });
  const body = UpdateServiceBody.parse(req.body);
  const [service] = await db
    .update(servicesTable)
    .set({ ...body, price: body.price !== undefined ? String(body.price) : undefined })
    .where(eq(servicesTable.id, id))
    .returning();
  if (!service) return res.status(404).json({ error: "Not found" });
  res.json({
    id: service.id,
    name: service.name,
    description: service.description,
    price: Number(service.price),
    estimatedDurationMinutes: service.estimatedDurationMinutes,
  });
});

router.delete("/services/:id", async (req, res) => {
  const { id } = DeleteServiceParams.parse({ id: Number(req.params.id) });
  await db.delete(servicesTable).where(eq(servicesTable.id, id));
  res.status(204).send();
});

export default router;
