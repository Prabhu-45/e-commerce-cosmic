import express from 'express';
import Address from '../models/Address.js';

const router = express.Router();

// Get all addresses for a user
router.get('/:userId', async (req, res) => {
    try {
        const addresses = await Address.find({ userId: req.params.userId });
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new address
router.post('/', async (req, res) => {
    const address = new Address(req.body);
    try {
        const newAddress = await address.save();
        res.status(201).json(newAddress);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update an address
router.put('/:id', async (req, res) => {
    try {
        const updatedAddress = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedAddress);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an address
router.delete('/:id', async (req, res) => {
    try {
        await Address.findByIdAndDelete(req.params.id);
        res.json({ message: 'Address deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
