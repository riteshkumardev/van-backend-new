import Trip from "../models/Trip.js";
import Vehicle from "../models/Vehicle.js";
import Driver from "../models/Driver.js"; // ✅ Driver Model Import Kiya (Attendance ke liye)

// 1. Add New Trip (Regular + Adhoc Logic + Billing + Attendance)
export const addTrip = async (req, res) => {
  try {
    const { 
      date, 
      startTime,
      endTime,
      
      // Vehicle Fields
      vehicleId, 
      isAdhoc,
      adhocVehicleNumber,
      
      // Driver Fields
      driverId, 
      adhocDriverName,

      // Readings & Money
      startKm, 
      endKm, 
      expense, 
      
      // Replacement Logic
      isReplacement,
      replacementVehicleNumber,

      // Fuel Fields
      fuelStation, 
      fuelType, 
      fuelCost,
      notes
    } = req.body;

    let company = "Adhoc"; 
    let finalVehicleId = vehicleId;
    let finalDriverId = driverId;

    // --- LOGIC 1: Vehicle Check ---
    if (!isAdhoc) {
      // Agar Regular trip hai, to Vehicle DB mein hona chahiye
      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      company = vehicle.currentCompany || "Other";
    } else {
      // Agar Adhoc hai, to vehicleId null rahega
      finalVehicleId = null;
      company = "Market/Adhoc";
    }

    // --- LOGIC 2: Driver Check ---
    if (driverId === "Other") {
      // Agar "Other" select kiya hai, to ID null hogi aur naam save hoga
      finalDriverId = null;
    }

    // --- LOGIC 3: Calculations (🔥 UPDATED BILLING LOGIC) ---
    const start = Number(startKm) || 0;
    const end = Number(endKm) || 0;
    const totalKm = end > start ? end - start : 0;
    
    const fixedRent = 800;             // Fix daily rent
    const ratePerKm = 7;               // Per KM rate
    const fuelReimbursement = Number(fuelCost) || 0; // Oil ka paisa wapas
    const tollReimbursement = Number(expense) || 0;  // Toll/Bhatta wapas

    // Total Income = 800 + (KM * 7) + Oil + Toll
    const calculatedIncome = fixedRent + (totalKm * ratePerKm) + fuelReimbursement + tollReimbursement;

    // --- Create Trip Object ---
    const newTrip = new Trip({
      date,
      startTime,
      endTime,
      isAdhoc: Boolean(isAdhoc),
      vehicleId: finalVehicleId,
      adhocVehicleNumber: isAdhoc ? adhocVehicleNumber : undefined,
      driverId: finalDriverId,
      adhocDriverName: (driverId === "Other" || isAdhoc) ? adhocDriverName : undefined,
      company, 
      startKm: start,
      endKm: end,
      totalKm,
      income: calculatedIncome,  // ✅ Auto Calculated Income Save Hogi
      expense: tollReimbursement,
      isReplacement: Boolean(isReplacement),
      replacementVehicleNumber: isReplacement ? replacementVehicleNumber : undefined,
      fuelStation: fuelStation || "",
      fuelType: fuelType || "None",
      fuelCost: fuelReimbursement,
      notes
    });

    const savedTrip = await newTrip.save();

    // --- LOGIC 4: MARK DRIVER ATTENDANCE (🔥 NEW) ---
    if (finalDriverId) {
      // Agar registered driver hai to uski haaziri (attendance) lagao
      await Driver.findByIdAndUpdate(finalDriverId, {
        $push: {
          attendance: {
            date: new Date(date),
            status: "Present",
            tripId: savedTrip._id,
            note: "Auto-marked from Daily Entry"
          }
        }
      });
    }

    res.status(201).json(savedTrip);

  } catch (err) {
    console.error("Add Trip Error:", err);
    res.status(400).json({ message: "Error adding trip", error: err.message });
  }
};

// 2. Get All Trips
export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate("vehicleId", "plateNumber brand model")
      .populate("driverId", "name")
      .sort({ date: -1, createdAt: -1 }); 
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Delete Trip
export const deleteTrip = async (req, res) => {
    try {
        // Optional: Yahan aap chahein to delete karne par driver ki attendance bhi hata sakte hain
        // filhal sirf trip delete ho rahi hai.
        await Trip.findByIdAndDelete(req.params.id);
        res.json({ message: "Trip deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};