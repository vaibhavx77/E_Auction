import express from "express";
import { createAuction } from "../controllers/auctionController.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.js";
import upload from "../utils/multerConfig.js";

const router = express.Router();

// Admin/Manager/Viewer can create auctions
router.post(
  "/create",
  authenticate,
  authorizeRoles("Admin", "Manager", "Viewer"),
  upload.fields([
    { name: "auctionDocs", maxCount: 5 },
    { name: "lotDocs0", maxCount: 5 },
    { name: "lotDocs1", maxCount: 5 },
    // Add more lotDocs fields as needed for lots
  ]),
  createAuction
);

export default router;