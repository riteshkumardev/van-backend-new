import mongoose from "mongoose";

const partyTransactionSchema = new mongoose.Schema({
  partyId: { type: mongoose.Schema.Types.ObjectId, ref: "Party", required: true },
  date: { type: Date, default: Date.now },
  description: { type: String, required: true }, // e.g., "Bill #101", "Cash Received"
  
  // Transaction Type
  type: { type: String, enum: ["DEBIT", "CREDIT"], required: true },
  
  // DEBIT (+) = Maal Diya / Udhaar Diya (Balance Badhega)
  // CREDIT (-) = Paisa Aaya / Payment Diya (Balance Ghatega)
  amount: { type: Number, required: true },
  
  // Balance after this transaction (Snapshot)
  runningBalance: { type: Number, default: 0 }

}, { timestamps: true });

export default mongoose.model("PartyTransaction", partyTransactionSchema);