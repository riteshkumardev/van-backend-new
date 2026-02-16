import express from "express";
import { 
  createParty, 
  getAllParties, 
  getPartyLedger, 
  addTransaction 
} from "../controllers/partyController.js";

const router = express.Router();

router.post("/", createParty);
router.get("/", getAllParties);
router.get("/:id", getPartyLedger);
router.post("/transaction", addTransaction);

export default router;