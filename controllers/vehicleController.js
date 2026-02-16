import Vehicle from '../models/Vehicle.js';

// GET /api/vehicles → Get all vehicles
export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find()
      .populate('ownerId')      // Populates owner details if they exist
      .populate('categoryId')   // Populates category details
      .sort({ createdAt: -1 }); // Shows newest vehicles first
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/vehicles → Create a new vehicle
export const createVehicle = async (req, res) => {
  try {
    // --- FIX FOR 400 ERROR ---
    // If ownerId is an empty string (e.g., for "Own" vehicles), remove it.
    // Mongoose treats "" as an invalid ObjectId and throws a CastError.
    if (req.body.ownerId === "") {
      delete req.body.ownerId;
    }

    const newVehicle = new Vehicle(req.body);
    const saved = await newVehicle.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Create Vehicle Error:", err);
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
};

// GET /api/vehicles/:id → Get vehicle by ID
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('ownerId categoryId');
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/vehicles/:id → Update a vehicle
export const updateVehicle = async (req, res) => {
  try {
    // Handle empty ownerId during update too
    if (req.body.ownerId === "") {
        req.body.ownerId = null; // Set to null to remove the relationship in DB
    }

    const updated = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Invalid update', error: err.message });
  }
};

// DELETE /api/vehicles/:id → Delete a vehicle
export const deleteVehicle = async (req, res) => {
  try {
    const deleted = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Vehicle not found' });
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};