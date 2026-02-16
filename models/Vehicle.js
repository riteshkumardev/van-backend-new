import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  plateNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: 2100
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VehicleCategory',
    required: true
  },
  
  // Changed to FALSE because 'Own' vehicles might not have an external Owner ID
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: false 
  },

  // --- NEW FIELDS FOR FLIPKART/GODREJ BUSINESS LOGIC ---

  // 1. Ownership Type (Apni gadi hai ya Market ki)
  ownership: {
    type: String,
    enum: ["Own", "Market"],
    default: "Own",
    required: true
  },

  // 2. Current Deployment (Kahan chal rahi hai)
  currentCompany: {
    type: String,
    enum: ["Flipkart", "Godrej", "Other"],
    default: "Flipkart"
  },

  // 3. Rate (Company aapko daily kitna deti hai)
  dailyRate: {
    type: Number,
    default: 0
  },

  // 4. Market Owner Details (Agar 'ownerId' link nahi karna, to direct naam likh sakein)
  ownerDetails: {
    name: { type: String, default: "" },
    phone: { type: String, default: "" }
  }

}, {
  timestamps: true
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;