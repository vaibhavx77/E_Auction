import express from "express";
import { getProfile, updateProfile } from "../controllers/supplierController.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

// Only authenticated suppliers can access these routes
router.get("/profile", authenticate, authorizeRoles("Supplier"), getProfile);
router.put("/profile", authenticate, authorizeRoles("Supplier"), updateProfile);

export default router;