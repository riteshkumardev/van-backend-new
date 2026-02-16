import Part from "../models/Part.js";

// 1. Create Part
export const createPart = async (req, res) => {
    try {
        const newPart = new Part(req.body);
        await newPart.save();
        res.status(201).json(newPart);
    } catch (err) {
        res.status(400).json({ message: "Error creating part", error: err.message });
    }
};

// 2. Get All Parts
export const getAllParts = async (req, res) => {
    try {
        // Sort by itemName ascending
        const parts = await Part.find().sort({ itemName: 1 });
        res.json(parts);
    } catch (err) {
        res.status(500).json({ message: "Error fetching parts", error: err.message });
    }
};

// 3. Get Part By ID
export const getPartById = async (req, res) => {
    try {
        const part = await Part.findById(req.params.id);
        if (!part) {
            return res.status(404).json({ message: "Part not found" });
        }
        res.json(part);
    } catch (err) {
        res.status(500).json({ message: "Error fetching part", error: err.message });
    }
};

// 4. Update Part (Edit Stock/Price/Details)
export const updatePart = async (req, res) => {
    try {
        const updatedPart = await Part.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Return updated document
        );
        if (!updatedPart) return res.status(404).json({ message: "Part not found" });
        res.json(updatedPart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 5. Delete Part (NEW: Needed for Frontend)
export const deletePart = async (req, res) => {
    try {
        const part = await Part.findByIdAndDelete(req.params.id);
        if (!part) return res.status(404).json({ message: "Part not found" });
        res.json({ message: "Part deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting part", error: err.message });
    }
};

// 6. Add Order (Stock Increase Logic)
export const addPartOrder = async (req, res) => {
    try {
        const { supplier, amount, notes, quantityAdded } = req.body;
        
        // Frontend might send 'quantityAdded' or 'amount'
        const stockToAdd = Number(quantityAdded) || Number(amount);

        if (!stockToAdd || stockToAdd <= 0) {
            return res.status(400).json({ message: "Invalid quantity to add" });
        }

        const part = await Part.findById(req.params.id);
        if (!part) return res.status(404).json({ message: "Part not found" });

        // Update Stock
        part.quantity += stockToAdd;
        
        // Update History
        part.lastOrder = {
            supplier: supplier || "",
            orderDate: new Date(),
            amount: stockToAdd,
            notes: notes || ""
        };

        await part.save();
        res.json({ message: "Stock Updated", part });

    } catch (err) {
        res.status(500).json({ message: "Failed to record order", error: err.message });
    }
};

// 7. Get Low Stock Parts (Smart Logic)
export const getLowStockParts = async (req, res) => {
    try {
        // Find parts where quantity is less than or equal to ITS OWN minLevel
        const lowStockParts = await Part.find({ 
            $expr: { $lte: ["$quantity", "$minLevel"] } 
        });

        res.json(lowStockParts);
    } catch (err) {
        res.status(500).json({ message: "Error fetching low stock parts", error: err.message });
    }
};