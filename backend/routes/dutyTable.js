import express from "express";
import { addDutyRate, getDutyRates, addCountry, addProduct, getAllProducts, getAllCountries } from "../controllers/dutyTableController.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", authenticate, authorizeRoles("Admin", "Manager", "Viewer"), addDutyRate);
router.get("/", authenticate, getDutyRates);


router.post('/product', authenticate, addProduct);
router.post('/country', authenticate, addCountry);

router.get('/products', getAllProducts);
router.get('/countries', getAllCountries);

export default router;