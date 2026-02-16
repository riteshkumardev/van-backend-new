import mongoose from "mongoose";

const partySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { 
    type: String, 
    enum: ["Customer", "Supplier", "Mechanic", "Driver", "FuelStation", "Other"],
    default: "Customer" 
  },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  
  // Balance Logic: 
  // Positive (+) means "You will receive" (Lena hai)
  // Negative (-) means "You have to pay" (Dena hai)
  currentBalance: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Party", partySchema);