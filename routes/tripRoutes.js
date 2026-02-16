import express from "express";
// Ab 'addTrip' aur 'deleteTrip' dono controller mein exist karte hain
import { addTrip, getTrips, deleteTrip } from "../controllers/tripController.js";

const router = express.Router();

// POST: नई ट्रिप (Adhoc या Regular) सेव करने के लिए
router.post("/", addTrip); 

// GET: पुरानी ट्रिप्स की लिस्ट देखने के लिए
router.get("/", getTrips);

// DELETE: किसी गलत एंट्री को आईडी से हटाने के लिए
router.delete("/:id", deleteTrip);

export default router;