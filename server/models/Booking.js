const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    passenger: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shuttle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shuttle',
        required: true
    },
    seatsBooked: {
        type: Number,
        default: 1
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
        default: 'CONFIRMED'
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    travelDate: {
        type: Date,
        required: false
    },
    bookingTime: {
        type: String,
        default: function () {
            return new Date().toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);

