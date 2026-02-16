import connectDB from './config/db.js';
import server from './server.js';

if (process.env.NODE_ENV !== 'test') {
    connectDB();

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
