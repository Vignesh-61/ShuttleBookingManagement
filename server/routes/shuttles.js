const express = require('express');
const router = express.Router();
const Shuttle = require('../models/Shuttle');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const shuttles = await Shuttle.find({ status: 'ACTIVE' }).populate('owner', 'name email');
        res.json(shuttles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/search', async (req, res) => {
    const { from, to } = req.query;
    try {
        let query = { status: 'ACTIVE' };
        if (from) query.from = { $regex: from, $options: 'i' };
        if (to) query.to = { $regex: to, $options: 'i' };

        const shuttles = await Shuttle.find(query).populate('owner', 'name email');
        res.json(shuttles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/my-shuttles', auth, async (req, res) => {
    try {
        const shuttles = await Shuttle.find({ owner: req.user.id });
        res.json(shuttles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.post('/', auth, async (req, res) => {
    const {
        vehicleName,
        vehicleNumber,
        from,
        to,
        departureTime,
        arrivalTime,
        price,
        totalSeats,
        driverName,
        driverContact,
        images
    } = req.body;

    if (req.user.role !== 'OWNER' && req.user.role !== 'ADMIN') {
        return res.status(403).json({ msg: 'Not authorized to create shuttles' });
    }

    try {
        const newShuttle = new Shuttle({
            owner: req.user.id,
            vehicleName,
            vehicleNumber,
            from,
            to,
            departureTime,
            arrivalTime,
            price,
            totalSeats,
            availableSeats: totalSeats,
            driverName: driverName || 'Not Assigned',
            driverContact: driverContact || '',
            images: images || []
        });

        const shuttle = await newShuttle.save();
        res.json(shuttle);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get schedule (availability) for a specific shuttle within a date range
router.get('/:id/schedule', auth, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        // Basic validation
        if (!startDate || !endDate) {
            return res.status(400).json({ msg: 'Please provide startDate and endDate' });
        }

        const shuttle = await Shuttle.findById(req.params.id);
        if (!shuttle) {
            return res.status(404).json({ msg: 'Shuttle not found' });
        }

        // Authorization check: User must be owner or ADMIN
        if (shuttle.owner.toString() !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Parse dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include the whole end day

        // Find confirmed bookings for this shuttle in the range
        const bookings = await Booking.find({
            shuttle: req.params.id,
            travelDate: { $gte: start, $lte: end },
            status: 'CONFIRMED'
        });

        // Aggregate booked seats per date
        const scheduleMap = {};

        bookings.forEach(booking => {
            // Format date as YYYY-MM-DD
            if (booking.travelDate) {
                const dateStr = booking.travelDate.toISOString().split('T')[0];
                if (!scheduleMap[dateStr]) {
                    scheduleMap[dateStr] = 0;
                }
                scheduleMap[dateStr] += (booking.seatsBooked || 1);
            }
        });

        res.json({
            shuttle,
            schedule: scheduleMap
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
