import express from "express";
import { addCurrencyRate, getAllCurrencyRates, getCurrencyRateByCode } from "../controllers/currencyRateController.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();
router.post("/", addCurrencyRate);

// router.post("/", authorizeRoles("Admin", "Manager", "Viewer"), addCurrencyRate);
router.get("/", getAllCurrencyRates);
router.get("/:code", getCurrencyRateByCode);


export default router;