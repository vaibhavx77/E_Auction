import express from "express";
import { addCurrencyRate, getCurrencyRates } from "../controllers/currencyRateController.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", authenticate, authorizeRoles("Admin", "Manager", "Viewer"), addCurrencyRate);
router.get("/", authenticate, getCurrencyRates);

export default router;