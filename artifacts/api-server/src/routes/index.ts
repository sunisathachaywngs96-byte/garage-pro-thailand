import { Router, type IRouter } from "express";
import healthRouter from "./health";
import customersRouter from "./customers";
import vehiclesRouter from "./vehicles";
import servicesRouter from "./services";
import techniciansRouter from "./technicians";
import appointmentsRouter from "./appointments";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(customersRouter);
router.use(vehiclesRouter);
router.use(servicesRouter);
router.use(techniciansRouter);
router.use(appointmentsRouter);
router.use(dashboardRouter);

export default router;
