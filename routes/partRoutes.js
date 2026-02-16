import express from "express";
import {
    createPart,
    getAllParts,
    getPartById,
    updatePart,
    deletePart,      // ✅ Added: Delete Import
    addPartOrder,
    getLowStockParts
} from "../controllers/partController.js";

const router = express.Router();

// 1. Create & Read
router.post("/", createPart);
router.get("/", getAllParts);

// 2. Special Routes (Must be before /:id)
router.get("/low-stock", getLowStockParts);

// 3. ID Based Routes
router.get("/:id", getPartById);
router.put("/:id", updatePart);
router.delete("/:id", deletePart); // ✅ Added: Delete Route

// 4. Stock Management
// Record purchase order & increase stock
router.post("/:id/order", addPartOrder);

export default router;