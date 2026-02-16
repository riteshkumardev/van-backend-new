import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './server.js';

// Environment variables लोड करें
dotenv.config();

// डेटाबेस कनेक्शन और सर्वर स्टार्ट
const startServer = async () => {
    try {
        await connectDB(); // डेटाबेस कनेक्ट होने का इंतज़ार करें
        
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Dharashakti Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Server startup failed:", error.message);
        process.exit(1);
    }
};

if (process.env.NODE_ENV !== 'test') {
    startServer();
}