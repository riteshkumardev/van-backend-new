import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; 
import { authMiddleware } from './middlewares/authMiddleware.js';

// Routes Imports
import authRoutes from './routes/authRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import billRoutes from './routes/billRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import partRoutes from './routes/partRoutes.js';
import driverRoutes from './routes/driverRoutes.js'; 
import tripRoutes from './routes/tripRoutes.js'; 
import partyRoutes from './routes/partyRoutes.js';

// Database Connection
import './models/index.js';

// Environment Variables लोड करें
dotenv.config();

const app = express();

// Middleware - CORS Setup
const allowedOrigins = [
    "http://localhost:5173",
    "https://vehicle-management-system-vms.vercel.app",
    "https://van-backend-new.vercel.app" // ✅ आपकी नई backend URL
];

app.use(
    cors({
        origin(origin, callback) {
            // Postman या सर्वर टू सर्वर कॉल के लिए
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            } else {
                return callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.options(/.*/, cors());
app.use(express.json());

// --- Routes ---

// 1. Routes without authentication (Public)
app.use('/api/auth', authRoutes);

// 2. Global Authentication Middleware
app.use('/api', authMiddleware);

// 3. Protected Routes (Auth Required)
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/parts', partRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/parties', partyRoutes);

// Root Redirect (Vercel पर 404 से बचने के लिए)
app.get("/", (req, res) => {
    res.redirect(302, "https://vehicle-management-system-vms.vercel.app/");
});

// Health Check
app.get("/health", (req, res) => {
    res.json({ 
        status: "ok", 
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// Server Listen (Local Environment के लिए)
const PORT = process.env.PORT || 5000;

// Vercel पर डिप्लॉयमेंट के दौरान 'app.listen' को नजरअंदाज किया जा सकता है, 
// लेकिन लोकल टेस्टिंग के लिए यह अनिवार्य है।
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`-----------------------------------------`);
        console.log(`🚀 Dharashakti Server is running!`);
        console.log(`📍 Port: ${PORT}`);
        console.log(`🔗 Local: http://localhost:${PORT}`);
        console.log(`-----------------------------------------`);
    });
}

export default app;