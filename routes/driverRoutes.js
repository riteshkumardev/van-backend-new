import express from "express";
import Driver from "../models/Driver.js";

const router = express.Router();

// GET ALL DRIVERS
router.get("/", async (req, res) => {
  try {
    const drivers = await Driver.find().sort({ joinedDate: -1 });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD NEW DRIVER (✅ Updated with Salary & Date)
router.post("/", async (req, res) => {
  // Frontend se aa rahe naye fields ko yahan receive karein
  const { name, licenseNumber, phone, email, status, salary, joinedDate } = req.body;
  
  try {
    const newDriver = new Driver({ 
        name, 
        licenseNumber, 
        phone, 
        email, 
        status,
        // Salary aur Date save karein (agar khali ho to default values)
        salary: salary || 0, 
        joinedDate: joinedDate || new Date() 
    });

    await newDriver.save();
    res.status(201).json(newDriver);
  } catch (err) {
    res.status(400).json({ message: "Error creating driver", error: err.message });
  }
});

// DELETE DRIVER
router.delete("/:id", async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.json({ message: "Driver deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// EDIT DRIVER
router.put("/:id", async (req, res) => {
    try {
        // req.body me jo bhi naya data ayega (salary, phone etc) wo update ho jayega
        const updatedDriver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedDriver);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;