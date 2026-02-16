import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  date: { 
    type: String, // Date ko String rakhna better hai (YYYY-MM-DD) sorting ke liye
    required: true
  },

  // --- TIME FIELDS ---
  startTime: { type: String, default: "" }, // "09:30"
  endTime: { type: String, default: "" },   // "18:00"
  
  // --- VEHICLE LOGIC (UPDATED) ---
  // Agar Regular hai to ID hogi, Adhoc hai to Null hoga
  vehicleId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Vehicle", 
    default: null 
  },
  
  // New Adhoc Fields
  isAdhoc: { type: Boolean, default: false }, // Kya ye bahar ki gadi hai?
  adhocVehicleNumber: { type: String, default: "" }, // Agar Adhoc hai to number yahan aayega

  // --- REPLACEMENT VEHICLE LOGIC ---
  isReplacement: { type: Boolean, default: false },
  replacementVehicleNumber: { type: String, default: "" },

  // --- DRIVER LOGIC (UPDATED) ---
  // Agar Registered driver hai to ID, nahi to Null
  driverId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Driver", 
    default: null 
  },
  // Agar 'Other' driver select kiya to naam yahan aayega
  adhocDriverName: { type: String, default: "" },

  // Company Info
  company: { type: String, default: "" }, // Flipkart, Godrej, or Adhoc/Market

  // --- READINGS ---
  startKm: { type: Number, default: 0 },
  endKm: { type: Number, default: 0 },
  totalKm: { type: Number, default: 0 },

  // --- HISAB KITAB ---
  income: { type: Number, default: 0 },
  expense: { type: Number, default: 0 },

  // --- FUEL / OIL FIELDS ---
  fuelStation: { type: String, default: "" },
  fuelType: { 
    type: String, 
    enum: ["Diesel", "Petrol", "CNG", "None"], 
    default: "None" 
  },
  fuelCost: { type: Number, default: 0 },
  
  // Notes
  notes: { type: String, default: "" }

}, { timestamps: true });

export default mongoose.model("Trip", tripSchema);