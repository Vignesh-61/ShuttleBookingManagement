const mongoose = require('mongoose');

const ShuttleSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vehicleName: {
        type: String,
        required: true
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    departureTime: {
        type: String,
        required: true
    },
    arrivalTime: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    totalSeats: {
        type: Number,
        required: true
    },
    availableSeats: {
        type: Number,
        required: true
    },
    driverName: {
        type: String,
        default: 'Not Assigned'
    },
    driverContact: {
        type: String,
        default: ''
    },
    images: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'COMPLETED'],
        default: 'ACTIVE'
    }
}, { timestamps: true });

module.exports = mongoose.model('Shuttle', ShuttleSchema);
