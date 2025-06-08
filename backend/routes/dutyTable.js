import express from "express";
import { addDutyRate, getDutyRates } from "../controllers/dutyTableController.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", authenticate, authorizeRoles("Admin", "Manager", "Viewer"), addDutyRate);
router.get("/", authenticate, getDutyRates);

export default router;