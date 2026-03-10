import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import addressRoutes from './routes/addressRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('E-commerce Backend is running...');
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env file');
} else {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.error('MongoDB connection error:', err));
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
