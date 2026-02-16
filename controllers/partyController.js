import Party from "../models/Party.js";
import PartyTransaction from "../models/PartyTransaction.js";

// 1. Create New Party
export const createParty = async (req, res) => {
  try {
    const { name, type, phone, address, openingBalance } = req.body;
    const party = new Party({ 
      name, 
      type, 
      phone, 
      address, 
      currentBalance: Number(openingBalance) || 0 
    });
    await party.save();
    res.status(201).json(party);
  } catch (err) {
    res.status(400).json({ message: "Error creating party" });
  }
};

// 2. Get All Parties (List)
export const getAllParties = async (req, res) => {
  try {
    const parties = await Party.find().sort({ name: 1 });
    res.json(parties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Get Party Ledger (Details + Transactions)
export const getPartyLedger = async (req, res) => {
  try {
    const party = await Party.findById(req.params.id);
    if (!party) return res.status(404).json({ message: "Party not found" });

    const transactions = await PartyTransaction.find({ partyId: req.params.id })
      .sort({ date: -1 }); // Newest first

    res.json({ party, transactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. Add Transaction (Len-Den Entry)
export const addTransaction = async (req, res) => {
  try {
    const { partyId, date, description, type, amount } = req.body;
    
    const party = await Party.findById(partyId);
    if (!party) return res.status(404).json({ message: "Party not found" });

    const numAmount = Number(amount);
    let newBalance = Number(party.currentBalance);

    // LOGIC: 
    // DEBIT (You Gave Goods/Money) -> Balance Increases (+)
    // CREDIT (You Got Money) -> Balance Decreases (-)
    if (type === "DEBIT") {
        newBalance += numAmount;
    } else {
        newBalance -= numAmount;
    }

    // 1. Create Transaction Record
    const transaction = new PartyTransaction({
        partyId,
        date,
        description,
        type,
        amount: numAmount,
        runningBalance: newBalance
    });
    await transaction.save();

    // 2. Update Party Balance
    party.currentBalance = newBalance;
    await party.save();

    res.status(201).json({ message: "Entry Saved", transaction, newBalance });

  } catch (err) {
    res.status(500).json({ message: "Transaction failed", error: err.message });
  }
};