import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; // ✅ 1. dotenv इम्पोर्ट करें
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

// ✅ 2. dotenv को कॉन्फ़िगर करें ताकि .env फाइल से डेटा पढ़ा जा सके
dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
    "http://localhost:5173",
    "https://vehicle-management-system-vms.vercel.app"
];

app.use(
    cors({
        origin(origin, callback) {
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

// Routes without authentication
app.use('/api/auth', authRoutes);

// Routes with authentication
app.use('/api', authMiddleware);

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

// Root Redirect
app.get("/", (req, res) => {
    res.redirect(302, "https://vehicle-management-system-vms.vercel.app/");
});

// Health Check
app.get("/health", (req, res) => {
    res.json({ status: "ok", environment: process.env.NODE_ENV });
});

// ✅ 3. सर्वर को स्टार्ट करने के लिए यह कोड जोड़ें (Local testing के लिए जरूरी)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`-----------------------------------------`);
    console.log(`🚀 Dharashakti Server is running!`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`🔗 Local: http://localhost:${PORT}`);
    console.log(`-----------------------------------------`);
});

export default app;