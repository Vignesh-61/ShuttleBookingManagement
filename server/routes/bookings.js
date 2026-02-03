const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Shuttle = require('../models/Shuttle');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const sendEmail = require('../utils/email');

router.post('/', auth, async (req, res) => {
    let { shuttleId, seatsBooked } = req.body;
    const passengerId = req.user.id;

    seatsBooked = parseInt(seatsBooked) || 1;

    console.log(`Booking request: User ${passengerId}, Shuttle ${shuttleId}, Seats ${seatsBooked}`);

    try {
        const shuttle = await Shuttle.findById(shuttleId);
        if (!shuttle) {
            console.log('Shuttle not found');
            return res.status(404).json({ msg: 'Shuttle not found' });
        }

        console.log(`Shuttle found: ${shuttle.vehicleName}, Available: ${shuttle.availableSeats}`);

        if (shuttle.availableSeats < seatsBooked) {
            return res.status(400).json({ msg: 'Not enough seats available' });
        }

        const totalAmount = (shuttle.price || 0) * seatsBooked;

        const bookingDateTime = new Date();
        const bookingTimeString = bookingDateTime.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'full',
            timeStyle: 'short'
        });

        const newBooking = new Booking({
            passenger: passengerId,
            shuttle: shuttleId,
            seatsBooked,
            totalAmount,
            bookingDate: bookingDateTime,
            travelDate: req.body.travelDate || shuttle.departureTime
        });

        const booking = await newBooking.save();
        console.log('Booking saved successfully');
        console.log('Booking Date/Time:', bookingTimeString);
        console.log('Seats Booked:', seatsBooked);
        console.log('Travel Date:', booking.travelDate);

        shuttle.availableSeats -= seatsBooked;
        await shuttle.save();
        console.log(`Updated available seats to: ${shuttle.availableSeats}`);

        const user = await User.findById(passengerId);

        try {
            const message = `Your booking for ${shuttle.vehicleName} (${seatsBooked} seats) from ${shuttle.from} to ${shuttle.to} has been confirmed. Booked on: ${bookingTimeString}. Total: ₹${totalAmount}`;

            const newNotification = new Notification({
                user: passengerId,
                title: 'Booking Confirmed!',
                message: message,
                type: 'BOOKING_SUCCESS'
            });
            await newNotification.save();
            console.log('Notification created');

        } catch (notifErr) {
            console.error('Notification failed but booking succeeded:', notifErr.message);
        }

        res.json(booking);


    } catch (err) {
        console.error('Booking Error:', err.message);
        res.status(500).send('Server Error');
    }
});


router.get('/passenger/:id', async (req, res) => {
    try {
        const bookings = await Booking.find({ passenger: req.params.id })
            .populate('shuttle')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
