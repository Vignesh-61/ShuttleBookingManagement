const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const Notification = require('../models/Notification');

router.post('/', async (req, res) => {
    const { name, email, rating, message } = req.body;
    try {
        const newFeedback = new Feedback({
            name,
            email,
            rating,
            message
        });
        await newFeedback.save();

        const admins = await User.find({ role: 'ADMIN' });
        const adminNotifications = admins.map(admin => ({
            user: admin._id,
            title: 'New Feedback Received',
            message: `Feedback from ${name} (${rating} stars): ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`,
            type: 'SUPPORT_MESSAGE'
        }));

        if (adminNotifications.length > 0) {
            await Notification.insertMany(adminNotifications);
        }

        res.json({ msg: 'Thank you for your feedback!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
