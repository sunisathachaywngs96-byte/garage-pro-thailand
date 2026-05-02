import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { techniciansTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateTechnicianBody,
  UpdateTechnicianBody,
  UpdateTechnicianParams,
  DeleteTechnicianParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/technicians", async (_req, res) => {
  const technicians = await db.select().from(techniciansTable);
  res.json(technicians);
});

router.post("/technicians", async (req, res) => {
  const body = CreateTechnicianBody.parse(req.body);
  const [tech] = await db.insert(techniciansTable).values(body).returning();
  res.status(201).json(tech);
});

router.put("/technicians/:id", async (req, res) => {
  const { id } = UpdateTechnicianParams.parse({ id: Number(req.params.id) });
  const body = UpdateTechnicianBody.parse(req.body);
  const [tech] = await db
    .update(techniciansTable)
    .set(body)
    .where(eq(techniciansTable.id, id))
    .returning();
  if (!tech) return res.status(404).json({ error: "Not found" });
  res.json(tech);
});

router.delete("/technicians/:id", async (req, res) => {
  const { id } = DeleteTechnicianParams.parse({ id: Number(req.params.id) });
  await db.delete(techniciansTable).where(eq(techniciansTable.id, id));
  res.status(204).send();
});

export default router;
