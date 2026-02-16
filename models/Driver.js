import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  
  // ✅ Salary & Joining Info
  salary: { type: Number, default: 0 },
  joinedDate: { type: Date, default: Date.now },
  
  // ✅ Current Status
  status: { 
    type: String, 
    enum: ["Active", "On Leave", "Inactive"], 
    default: "Active" 
  },

  // ✅ Attendance History (Haaziri Register)
  attendance: [
    {
      date: { type: Date, default: Date.now },
      status: { 
        type: String, 
        enum: ["Present", "Absent", "Leave", "Half Day"], 
        default: "Present" 
      },
      // Agar Trip lagane se attendance lagi hai, to Trip ka ID yahan save hoga
      tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
      note: { type: String }
    }
  ]

}, { timestamps: true });

export default mongoose.model("Driver", driverSchema);