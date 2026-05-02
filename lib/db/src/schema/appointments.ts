import { pgTable, serial, integer, text, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { customersTable } from "./customers";
import { vehiclesTable } from "./vehicles";
import { servicesTable } from "./services";
import { techniciansTable } from "./technicians";

export const appointmentsTable = pgTable("appointments", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => customersTable.id),
  vehicleId: integer("vehicle_id").notNull().references(() => vehiclesTable.id),
  serviceId: integer("service_id").notNull().references(() => servicesTable.id),
  technicianId: integer("technician_id").notNull().references(() => techniciansTable.id),
  scheduledAt: timestamp("scheduled_at").notNull(),
  status: text("status").notNull().default("scheduled"),
  notes: text("notes"),
  totalCost: numeric("total_cost", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAppointmentSchema = createInsertSchema(appointmentsTable).omit({ id: true, createdAt: true });
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointmentsTable.$inferSelect;
