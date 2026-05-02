import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { customersTable } from "@workspace/db";
import { eq, ilike } from "drizzle-orm";
import {
  CreateCustomerBody,
  UpdateCustomerBody,
  GetCustomerParams,
  DeleteCustomerParams,
  ListCustomersQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/customers", async (req, res) => {
  const query = ListCustomersQueryParams.safeParse(req.query);
  const customers = await db
    .select()
    .from(customersTable)
    .where(
      query.success && query.data.search
        ? ilike(customersTable.name, `%${query.data.search}%`)
        : undefined
    );
  res.json(
    customers.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      createdAt: c.createdAt.toISOString(),
    }))
  );
});

router.post("/customers", async (req, res) => {
  const body = CreateCustomerBody.parse(req.body);
  const [customer] = await db.insert(customersTable).values(body).returning();
  res.status(201).json({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    createdAt: customer.createdAt.toISOString(),
  });
});

router.get("/customers/:id", async (req, res) => {
  const { id } = GetCustomerParams.parse({ id: Number(req.params.id) });
  const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, id));
  if (!customer) return res.status(404).json({ error: "Not found" });
  res.json({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    createdAt: customer.createdAt.toISOString(),
  });
});

router.put("/customers/:id", async (req, res) => {
  const { id } = GetCustomerParams.parse({ id: Number(req.params.id) });
  const body = UpdateCustomerBody.parse(req.body);
  const [customer] = await db
    .update(customersTable)
    .set(body)
    .where(eq(customersTable.id, id))
    .returning();
  if (!customer) return res.status(404).json({ error: "Not found" });
  res.json({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    createdAt: customer.createdAt.toISOString(),
  });
});

router.delete("/customers/:id", async (req, res) => {
  const { id } = DeleteCustomerParams.parse({ id: Number(req.params.id) });
  await db.delete(customersTable).where(eq(customersTable.id, id));
  res.status(204).send();
});

export default router;
